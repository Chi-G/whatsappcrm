export function Steps() {
  const steps = [
    {
      number: "01",
      title: "Connect your WhatsApp number",
      description: "Link your existing WhatsApp Business API number or get a new one directly through our provider integrations.",
    },
    {
      number: "02",
      title: "Invite your team",
      description: "Add team members, assign roles, and set up routing rules so the right person gets the right messages.",
    },
    {
      number: "03",
      title: "Start selling and supporting",
      description: "Use the unified inbox, set up automations, and launch your first broadcast campaign to your customers.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-card/30 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent -z-10"></div>
      
      <div className="container mx-auto px-4 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">Quick Setup</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-4">Live in under 30 minutes</h3>
          <p className="text-lg text-muted-foreground">
            No complex engineering required. Get your team up and running on the WhatsApp API quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0"></div>

          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-background border border-primary/20 shadow-lg shadow-primary/10 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-primary/5 rounded-2xl"></div>
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-hover">
                  {step.number}
                </span>
              </div>
              <h4 className="text-xl font-bold mb-3">{step.title}</h4>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
