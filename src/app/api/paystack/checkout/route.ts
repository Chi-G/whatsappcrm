import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { planCode } = body;

    if (!planCode) {
      return NextResponse.json({ error: "planCode is required" }, { status: 400 });
    }

    // Get the user's primary tenant
    const { data: tenantUser, error: tuError } = await supabase
      .from("tenant_users")
      .select("tenant_id, tenants(name, paystack_customer_code, paystack_subscription_code, subscription_status)")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    if (tuError || !tenantUser) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const tenantId = tenantUser.tenant_id;
    const tenantData: any = tenantUser.tenants;

    // If the user already has an active subscription, return the Paystack Manage Link instead
    if (tenantData?.subscription_status === "active" && tenantData?.paystack_subscription_code) {
      const manageRes = await fetch(`https://api.paystack.co/subscription/${tenantData.paystack_subscription_code}/manage/link`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        }
      });
      
      const manageData = await manageRes.json();
      if (manageRes.ok && manageData.status) {
        return NextResponse.json({ url: manageData.data.link });
      }
    }
    // We do not strictly need to create a Paystack customer ahead of time like Stripe, 
    // Paystack creates it automatically on checkout using the email.

    // Construct return URL
    const headersList = await headers();
    const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const returnUrl = `${origin}/settings?tab=billing`;

    const fallbackAmount = parseInt(process.env.NEXT_PUBLIC_SUBSCRIPTION_AMOUNT || "30000", 10);
    const amountInKobo = fallbackAmount * 100; // Paystack expects amount in Kobo

    const payload: any = {
      email: user.email,
      amount: amountInKobo,
      callback_url: returnUrl,
      metadata: {
        tenant_id: tenantId,
        user_id: user.id
      }
    };

    // If a valid plan code was sent, attach it to automatically create a subscription
    if (planCode && !planCode.includes("dummy")) {
      payload.plan = planCode;
    }

    // Initialize Paystack Transaction
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error("Paystack API Error:", data);
      return NextResponse.json({ error: data.message || "Failed to initialize transaction" }, { status: 500 });
    }

    // Return the authorization_url to redirect the user
    return NextResponse.json({ url: data.data.authorization_url });

  } catch (error: any) {
    console.error("Paystack Checkout Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
