import Link from "next/link";
import { ArrowRight, MessageSquare, Play, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-16 md:pt-20 md:pb-24">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
      <div className="pointer-events-none absolute -top-1/2 -left-1/2 h-[1000px] w-[1000px] opacity-30 bg-[radial-gradient(circle_400px_at_50%_50%,_var(--tw-gradient-stops))] from-primary/30 to-transparent blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 min-w-0 text-center lg:text-left">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
            <Sparkles className="mr-2 h-4 w-4" /> Open Source WhatsApp Inbox
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl mb-6">
            Run your WhatsApp <br className="hidden lg:block" />
            business from <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover inline-block mt-2">
              one Inbox.
            </span>
          </h1>
          <p className="mt-4 text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
            Fora is an open-source WhatsApp Inbox & CRM. Build relationships, collaborate with your team, automate replies, and boost sales, all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link href="/signup" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto bg-primary hover:bg-primary-hover text-white shadow-[0_0_20px_rgba(var(--primary),0.4)] text-base h-12 px-8" })}>
              Get started for free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className={buttonVariants({ size: "lg", variant: "outline", className: "w-full sm:w-auto h-12 px-8 border-primary/20 hover:bg-primary/10" })}>
              <Play className="mr-2 h-5 w-5 text-primary" /> Book a demo
            </button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-[11px] sm:text-xs font-normal text-muted-foreground tracking-wide">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_5px_rgba(16,185,129,0.4)]"></div> No credit card required
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_5px_rgba(16,185,129,0.4)]"></div> Open source
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_5px_rgba(16,185,129,0.4)]"></div> Self-hostable
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 w-full max-w-2xl lg:max-w-[850px] relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl -z-10 rounded-[3rem]"></div>
          <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-2 shadow-2xl overflow-hidden ring-1 ring-white/10 relative">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            {/* Mockup Dashboard Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/50">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-sm text-muted-foreground font-medium flex items-center gap-2 truncate min-w-0">
                  <span className="truncate">Inbox <span className="text-border">•</span> Fora-CRM</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-green-500/10 text-green-500 border border-green-500/20 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide shrink-0">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                LIVE
              </div>
            </div>
            {/* Mockup Dashboard Content */}
            <div className="flex h-[350px] md:h-[420px] w-full min-w-0">
              {/* Chat list */}
              <div className="w-[180px] lg:w-[220px] border-r border-border/50 flex flex-col bg-background/40 shrink-0 hidden sm:flex">
                <div className="p-3 border-b border-border/50">
                  <div className="h-8 rounded-md bg-muted/30 border border-border/50 w-full flex items-center px-2.5 text-xs text-muted-foreground">
                    <svg className="w-3.5 h-3.5 mr-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    Search conversations...
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 p-2">
                  {[
                    { name: 'Chijindu', msg: 'Comparets being coinized a...', initial: 'C', color: 'bg-blue-500' },
                    { name: 'Sammy', msg: 'Sure, we can do 500 units.', initial: 'S', color: 'bg-purple-500', active: true },
                    { name: 'Oluchi', msg: 'Price sheet attached to ada...', initial: 'O', color: 'bg-yellow-600' },
                    { name: 'C nebe', msg: 'We are earning in eurddit is...', initial: 'C', color: 'bg-green-600' },
                    { name: 'David', msg: 'Sure, we can do 500 units.', initial: 'D', color: 'bg-teal-500' },
                    { name: 'Chibuike', msg: 'Do you ship to Brazil?.', initial: 'C', color: 'bg-yellow-600' }
                  ].map((chat, i) => (
                    <div key={i} className={`p-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer ${chat.active ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-muted/30 border-l-2 border-transparent'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0 ${chat.color}`}>
                        {chat.initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <div className={`text-xs font-semibold truncate ${chat.active ? 'text-foreground' : 'text-foreground/90'}`}>{chat.name}</div>
                          {chat.active && <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>}
                        </div>
                        <div className={`text-[11px] truncate ${chat.active ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>{chat.msg}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Chat window */}
              <div className="flex-1 flex flex-col bg-background/20 relative min-w-0">
                <div className="p-4 border-b border-border/50 flex items-center justify-between bg-background/30">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-medium shrink-0">S</div>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs truncate">Sammy</div>
                      <div className="text-[11px] text-muted-foreground truncate">+234 812 345 6789</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full text-[11px] font-medium shrink-0">
                    <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                    Open
                  </div>
                </div>
                
                <div className="flex-1 p-2 sm:p-4 overflow-hidden space-y-4 sm:space-y-6 relative flex flex-col">
                  {/* Decorative blur */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-3xl rounded-full"></div>
                  
                  {/* Incoming message */}
                  <div className="flex gap-2 max-w-[85%] sm:max-w-[75%] relative z-10">
                    <div className="bg-card border border-border/50 rounded-2xl rounded-tl-sm p-3 shadow-sm">
                      <p className="text-xs leading-relaxed">
                        We are going to called out for your Meta Cloud API templates.<br/>
                        <span className="text-muted-foreground mt-1 inline-block">Price: $100</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Outgoing message */}
                  <div className="flex gap-2 justify-end relative z-10">
                    <div className="bg-card border border-border/50 text-foreground rounded-2xl rounded-tr-sm px-3 py-2 shadow-md">
                      <p className="text-xs">Thanks! Received it</p>
                    </div>
                  </div>
                  
                  {/* Typing indicator */}
                  <div className="flex gap-2 max-w-[85%] sm:max-w-[75%] relative z-10">
                    <div className="bubble typing bg-card border border-border/50 rounded-2xl rounded-tl-sm px-3.5 py-3 shadow-sm flex items-center gap-1.5 h-[34px]">
                      <span className="d w-1.5 h-1.5 bg-foreground/60 rounded-full typing-dot"></span>
                      <span className="d w-1.5 h-1.5 bg-foreground/60 rounded-full typing-dot"></span>
                      <span className="d w-1.5 h-1.5 bg-foreground/60 rounded-full typing-dot"></span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border-t border-border/50 bg-background/40 w-full min-w-0">

                  <div className="relative">
                    <div className="h-10 w-full rounded-lg bg-background border border-border/60 flex items-center px-3 text-sm text-muted-foreground/80 overflow-hidden pr-20">
                      <span className="truncate flex-1 min-w-0">Type a message...</span><span className="w-px h-4 bg-primary animate-pulse ml-px shrink-0"></span>
                    </div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button className="text-muted-foreground hover:text-foreground">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </button>
                      <button className="w-8 h-8 rounded-md bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                        <svg className="w-4 h-4 text-foreground/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                      </button>
                    </div>
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
