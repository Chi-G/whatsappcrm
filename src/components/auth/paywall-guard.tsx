"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CreditCard, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

export function PaywallGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [lockReason, setLockReason] = useState<"new" | "past_due" | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [currency, setCurrency] = useState<"NGN" | "USD" | "GBP">("NGN");
  const [rates, setRates] = useState({ usd: 1500, gbp: 1900 });
  const supabase = createClient();
  const pathname = usePathname();

  useEffect(() => {
    async function checkSubscription() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: tu } = await supabase
        .from("tenant_users")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (tu) {
        const { data: t } = await supabase
          .from("tenants")
          .select("subscription_status")
          .eq("id", tu.tenant_id)
          .single();

        const status = t?.subscription_status;
        
        // Strict Paywall Logic:
        if (status === "past_due" || status === "canceled") {
          setLockReason("past_due");
          setIsLocked(true);
        } else if (status !== "active" && status !== "trialing") {
          // This catches new users (null, undefined, "inactive", "incomplete")
          setLockReason("new");
          setIsLocked(true);
        }
      }
      
      const { data: settings } = await supabase.from("global_settings").select("*").single();
      if (settings) {
        setRates({ usd: settings.usd_to_ngn_rate, gbp: settings.gbp_to_ngn_rate });
      }

      setLoading(false);
    }
    
    // Don't lock the billing settings page so they can actually fix the issue
    if (pathname === "/settings" || pathname === "/settings?tab=billing" || pathname.includes("/settings")) {
       setLoading(false);
       return;
    }
    
    checkSubscription();
  }, [supabase, pathname]);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      const res = await fetch("/api/paystack/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during checkout.");
    } finally {
      setIsSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              {lockReason === "past_due" ? "Subscription Past Due" : "Subscription Required"}
            </h2>
            <p className="text-slate-400 text-sm">
              {lockReason === "past_due" 
                ? "Your dashboard has been temporarily locked due to a failed payment. Please update your payment method to restore access. Don't worry, your customer data is safe!"
                : "Welcome to Fora CRM! To access your dashboard, connect your WhatsApp, and start building pipelines, please complete your subscription setup."}
            </p>
          </div>

          <div className="flex justify-center space-x-2 mt-4">
            {(["NGN", "USD", "GBP"] as const).map(c => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  currency === c 
                    ? "bg-primary text-white" 
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {c === "NGN" ? "🇳🇬 NGN" : c === "USD" ? "🇺🇸 USD" : "🇬🇧 GBP"}
              </button>
            ))}
          </div>

          <div className="text-center py-2">
            <span className="text-4xl font-bold text-white">
              {currency === "NGN" && "₦30,000"}
              {currency === "USD" && `$${Math.round(40000 / rates.usd)}`}
              {currency === "GBP" && `£${Math.round(42000 / rates.gbp)}`}
            </span>
            <span className="text-slate-400 text-sm"> / month</span>
          </div>

          <Button
            onClick={handleSubscribe}
            disabled={isSubscribing}
            className="w-full bg-primary hover:bg-primary-hover text-white shadow-[0_0_15px_rgba(var(--primary),0.3)]"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {isSubscribing ? "Redirecting to checkout..." : lockReason === "past_due" ? "Update Payment Method" : "Subscribe Now"}
          </Button>
          <div className="text-xs text-slate-500">
            Secure checkout powered by Paystack.
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
