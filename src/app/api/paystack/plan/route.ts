import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const planCode = process.env.NEXT_PUBLIC_PAYSTACK_PLAN_CODE;
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    // You can set the default fallback amount in your .env.local file
    const fallbackAmount = parseInt(process.env.NEXT_PUBLIC_SUBSCRIPTION_AMOUNT || "30000", 10);

    if (!planCode || !secretKey) {
      return NextResponse.json({
        amount: fallbackAmount,
        interval: "monthly",
        currency: "NGN",
        fallback: true
      });
    }

    const response = await fetch(`https://api.paystack.co/plan/${planCode}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      // Ensure Next.js doesn't aggressively cache this so if the user changes the price, it reflects
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok || !data.status) {
      console.error("Paystack Plan Fetch Error:", data);
      return NextResponse.json({
        amount: fallbackAmount,
        interval: "monthly",
        currency: "NGN",
        fallback: true
      });
    }

    // Paystack returns amount in kobo (base unit), so divide by 100
    const amountInMainUnit = data.data.amount / 100;

    return NextResponse.json({
      amount: amountInMainUnit,
      interval: data.data.interval, // Usually 'monthly', 'annually'
      currency: data.data.currency, // e.g. 'NGN'
    });

  } catch (error: any) {
    console.error("Paystack API Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
