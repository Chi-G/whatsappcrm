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
  const [isSubscribing, setIsSubscribing] = useState(false);
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

        if (t?.subscription_status === "past_due" || t?.subscription_status === "canceled") {
          setIsLocked(true);
        }
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
        body: JSON.stringify({ planCode: process.env.NEXT_PUBLIC_PAYSTACK_PLAN_CODE || "PLN_dummy" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to initiate checkout");
      }
    } catch (err) {
      toast.error("Failed to initiate checkout");
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
        <div className="max-w-md w-full bg-slate-900 border border-red-500/20 rounded-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Subscription Past Due</h2>
            <p className="text-slate-400 text-sm">
              Your dashboard has been temporarily locked due to a failed payment or canceled subscription. 
              Please update your payment method to restore access. 
              Don't worry, your customer data and inbound messages are still safely secured!
            </p>
          </div>
          <Button
            onClick={handleSubscribe}
            disabled={isSubscribing}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {isSubscribing ? "Loading..." : "Update Payment Method"}
          </Button>
          <div className="text-xs text-slate-500">
            Or contact support if you believe this is an error.
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
