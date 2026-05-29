import { CheckCircle2, TrendingUp, Clock, Target } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export function Benefits() {
  const benefits = [
    {
      title: "Increase reply rates",
      description: "WhatsApp has a 98% open rate. Reach your customers where they already are and get responses in minutes, not days.",
      icon: TrendingUp,
    },
    {
      title: "Save team time",
      description: "Automate repetitive questions with bots and quick replies. Free up your team to handle complex queries.",
      icon: Clock,
    },
    {
      title: "Close deals faster",
      description: "Move leads through your pipeline seamlessly with our built-in CRM features and targeted broadcasts.",
      icon: Target,
    },
  ];

  const checklists = [
    "Unified Team Inbox",
    "No-code Automations",
    "Targeted Broadcasts",
    "Contact Management",
    "Detailed Analytics",
    "Developer API",
  ];

  return (
    <section id="benefits" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">Why Fora CRM</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6">How it helps WhatsApp businesses ROI</h3>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Stop juggling between personal phones and limited WhatsApp Web setups. Fora gives you the power of an enterprise contact center, built specifically for the WhatsApp Business API.
            </p>
            
            <div className="space-y-6 mb-10">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{benefit.title}</h4>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Link href="/signup" className={buttonVariants({ size: "lg", className: "bg-primary hover:bg-primary-hover" })}>See all features</Link>
          </div>
          
          <div className="relative">
            {/* Abstract visual representation of benefits */}
            <div className="relative rounded-2xl border border-border/50 bg-card p-8 shadow-2xl overflow-hidden z-10">
              <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl -z-10"></div>
              
              <h4 className="text-xl font-bold mb-6">You get everything, in just one tab</h4>
              <p className="text-muted-foreground mb-8">
                Say goodbye to scattered context. Have your chats, deals, and customer data side-by-side.
              </p>
              
              <ul className="space-y-4">
                {checklists.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-8 border-t border-border/50">
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Weekly Replies</div>
                    <div className="text-2xl font-bold">12,450</div>
                  </div>
                  <div className="h-12 w-24 rounded flex items-end gap-1">
                    {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                      <div key={i} className="w-full bg-primary/80 rounded-t-sm" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
