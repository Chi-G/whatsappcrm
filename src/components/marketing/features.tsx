import { Users, Zap, Bot, Megaphone, Contact } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Team Inbox",
      description: "Collaborate with your team on a single WhatsApp number. Assign chats, leave internal notes, and never miss a message.",
      icon: Users,
      colSpan: "md:col-span-2",
    },
    {
      title: "Auto-replies",
      description: "Set up instant replies for out-of-office hours or common queries. Keep your response time near zero.",
      icon: Bot,
      colSpan: "md:col-span-1",
    },
    {
      title: "Automations",
      description: "Build no-code workflows. Trigger actions based on keywords or events. Tag users, route chats, or send webhooks.",
      icon: Zap,
      colSpan: "md:col-span-1",
    },
    {
      title: "Broadcasts",
      description: "Send targeted campaigns to segmented audiences. Track delivery, reads, and replies in real-time.",
      icon: Megaphone,
      colSpan: "md:col-span-1",
    },
    {
      title: "Contacts CRM",
      description: "Manage your leads effectively. Add custom fields, tags, and track the entire customer journey.",
      icon: Contact,
      colSpan: "md:col-span-1",
    },
  ];

  return (
    <section id="features" className="py-24 bg-secondary/30 relative">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">Capabilities</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-4">One toolkit for your WhatsApp business</h3>
          <p className="text-lg text-muted-foreground">
            Everything you need to support, sell, and market on WhatsApp, packaged in a beautiful interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-8 transition-all hover:shadow-[0_0_30px_rgba(var(--primary),0.15)] hover:border-primary/40 ${feature.colSpan}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-sm group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h4 className="mb-3 text-xl font-bold">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
