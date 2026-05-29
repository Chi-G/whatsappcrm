import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { Benefits } from "@/components/marketing/benefits";
import { Steps } from "@/components/marketing/steps";
import { FAQ } from "@/components/marketing/faq";
import { Footer } from "@/components/marketing/footer";

export default function RootPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans selection:bg-primary/30 text-foreground max-w-[1200px] mx-auto shadow-2xl shadow-primary/5">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Benefits />
        <Steps />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
