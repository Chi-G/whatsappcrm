"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Check, CreditCard, ShieldAlert } from "lucide-react";

export function BillingPanel() {
  const [loading, setLoading] = useState(false);
  const [tenant, setTenant] = useState<any>(null);
  const [planDetails, setPlanDetails] = useState<{ amount: number, interval: string, currency: string } | null>(null);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const toastShown = useRef(false);

  useEffect(() => {
    // Check if user just returned from a successful Paystack checkout
    const reference = searchParams.get("reference");
    if (reference && !toastShown.current) {
      toast.success("Payment successful! Your subscription is now active.");
      toastShown.current = true;
      // Clean up the URL
      router.replace("/settings?tab=billing");
    }

    async function loadTenant() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: tu } = await supabase
        .from("tenant_users")
        .select("tenant_id")
        .eq("user_id", user.id)
        .single();

      if (tu) {
        const { data: t } = await supabase
          .from("tenants")
          .select("*")
          .eq("id", tu.tenant_id)
          .single();
        setTenant(t);
      }
    }
    
    async function loadPlanDetails() {
      try {
        const res = await fetch("/api/paystack/plan");
        if (res.ok) {
          const data = await res.json();
          setPlanDetails(data);
        }
      } catch (err) {
        console.error("Failed to fetch plan details");
      }
    }
    
    loadTenant();
    loadPlanDetails();
  }, [supabase]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/paystack/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planCode: process.env.NEXT_PUBLIC_PAYSTACK_PLAN_CODE || "PLN_dummy",
        }),
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
      setLoading(false);
    }
  };

  const isActive = tenant?.subscription_status === "active";
  const isPastDue = tenant?.subscription_status === "past_due";

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Subscription Plan
          </CardTitle>
          <CardDescription className="text-slate-400">
            Manage your billing and subscription status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-700 bg-slate-800 p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Fora CRM Pro</h3>
              <p className="text-slate-400 text-sm mt-1">
                Everything you need to run your WhatsApp sales team.
              </p>
              
              <div className="mt-4 flex items-center gap-2">
                {isActive ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-400">
                    <Check className="h-3 w-3" /> Active
                  </span>
                ) : isPastDue ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-400">
                    <ShieldAlert className="h-3 w-3" /> Past Due
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-2.5 py-1 text-xs font-semibold text-yellow-400">
                    Trial / Inactive
                  </span>
                )}
                
                {tenant?.paystack_current_period_end && (
                  <span className="text-xs text-slate-500">
                    Renews on {new Date(tenant.paystack_current_period_end).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <div className="text-3xl font-bold text-white">
                {planDetails ? (
                  planDetails.currency === 'NGN' 
                    ? `₦${planDetails.amount.toLocaleString()}` 
                    : `${planDetails.currency} ${planDetails.amount.toLocaleString()}`
                ) : (
                  <span className="text-2xl text-slate-500 animate-pulse">Loading...</span>
                )}
              </div>
              <div className="text-sm text-slate-400 capitalize">
                per {planDetails?.interval || "month"}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-900 border-t border-slate-700 pt-6 justify-end">
          <Button
            onClick={handleSubscribe}
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? "Loading..." : isActive ? "Manage Subscription" : "Subscribe Now"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
