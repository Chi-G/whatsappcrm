import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, currency, description } = await req.json();

    if (!amount || !currency) {
      return NextResponse.json({ error: "Amount and currency are required" }, { status: 400 });
    }

    // Fetch dynamic exchange rate
    const { data: settings } = await supabase.from('global_settings').select('*').single();
    const usdRate = settings?.usd_to_ngn_rate || 1500;
    const gbpRate = settings?.gbp_to_ngn_rate || 1900;

    let finalAmountInNaira = parseFloat(amount);

    if (currency === "USD") {
      finalAmountInNaira = (finalAmountInNaira * usdRate) + 10000;
    } else if (currency === "GBP") {
      finalAmountInNaira = (finalAmountInNaira * gbpRate) + 12000;
    }

    const amountInKobo = Math.round(finalAmountInNaira * 100);

    const payload = {
      email: user.email,
      amount: amountInKobo,
      metadata: {
        custom_fields: [
          {
            display_name: "Description",
            variable_name: "description",
            value: description || `Payment for ${currency} ${amount}`
          }
        ],
        user_id: user.id
      }
    };

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
      return NextResponse.json({ error: data.message || "Failed to initialize transaction" }, { status: 500 });
    }

    return NextResponse.json({ url: data.data.authorization_url, finalAmountInNaira });
  } catch (error: any) {
    console.error("Payment Link Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
