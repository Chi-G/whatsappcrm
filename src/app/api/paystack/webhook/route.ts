import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { sendSubscriptionSuccessEmail } from "@/lib/email";

// Disable Next.js default body parser for this route so we can verify the raw buffer signature
export const runtime = "nodejs";

// Initialize Supabase Admin client to bypass RLS when updating subscription status
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const bodyText = await req.text();
  const signature = req.headers.get("x-paystack-signature");
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!signature || !secret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }

  // Validate the Paystack signature
  const hash = crypto.createHmac("sha512", secret).update(bodyText).digest("hex");
  if (hash !== signature) {
    console.error("⚠️ Paystack Webhook signature verification failed.");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const event = JSON.parse(bodyText);

    // ============================================================
    // IDEMPOTENCY CHECK
    // ============================================================
    // Attempt to insert the unique signature as the reference.
    // If it violates the UNIQUE constraint, this webhook has already been processed.
    const { error: idempotencyError } = await supabaseAdmin
      .from("paystack_webhook_events")
      .insert({ reference: signature, event_type: event.event });

    if (idempotencyError && idempotencyError.code === "23505") {
      // 23505 is PostgreSQL's unique_violation error code
      console.log(`[Idempotency] Event already processed, skipping: ${event.event}`);
      return NextResponse.json({ received: true }); // Acknowledge safely
    } else if (idempotencyError) {
      console.error("Idempotency db error:", idempotencyError);
      throw idempotencyError;
    }

    switch (event.event) {
      case "subscription.create": {
        const { customer, subscription_code, plan, next_payment_date } = event.data;
        // In subscription.create, custom metadata from checkout isn't always deeply nested the same way,
        // but we can query by customer code or we rely on charge.success to set the tenant_id first.
        // Usually, charge.success fires right before subscription.create on a new subscription.
        const { data: tenant } = await supabaseAdmin
          .from("tenants")
          .select("id")
          .eq("paystack_customer_code", customer.customer_code)
          .single();

        if (tenant) {
          await supabaseAdmin
            .from("tenants")
            .update({
              paystack_subscription_code: subscription_code,
              paystack_plan_code: plan.plan_code,
              paystack_current_period_end: next_payment_date,
              subscription_status: "active",
            })
            .eq("id", tenant.id);
        }
        break;
      }
      
      case "charge.success": {
        // charge.success has the metadata we passed in checkout!
        const { metadata, customer, plan, amount } = event.data;
        if (metadata && metadata.tenant_id) {
          const tenantId = metadata.tenant_id;
          
          await supabaseAdmin
            .from("tenants")
            .update({
              paystack_customer_code: customer.customer_code,
              subscription_status: "active",
            })
            .eq("id", tenantId);

          // Send welcome/receipt email
          const formattedAmount = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount / 100);
          await sendSubscriptionSuccessEmail(customer.email, "Fora CRM Pro", formattedAmount);
        }
        break;
      }

      case "subscription.disable": {
        const { customer } = event.data;
        const { data: tenant } = await supabaseAdmin
          .from("tenants")
          .select("id")
          .eq("paystack_customer_code", customer.customer_code)
          .single();

        if (tenant) {
          await supabaseAdmin
            .from("tenants")
            .update({
              subscription_status: "canceled",
            })
            .eq("id", tenant.id);
        }
        break;
      }

      case "invoice.payment_failed": {
        const { customer } = event.data;
        const { data: tenant } = await supabaseAdmin
          .from("tenants")
          .select("id")
          .eq("paystack_customer_code", customer.customer_code)
          .single();

        if (tenant) {
          await supabaseAdmin
            .from("tenants")
            .update({
              subscription_status: "past_due",
            })
            .eq("id", tenant.id);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Paystack Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed", details: error.message },
      { status: 500 }
    );
  }
}
