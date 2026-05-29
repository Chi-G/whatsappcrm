import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      question: "Do I need a WhatsApp Business API account?",
      answer: "Yes, Fora CRM connects to the official WhatsApp Business API. You can bring your own API provider credentials (like Meta Cloud API, Twilio, or MessageBird) to use our platform."
    },
    {
      question: "Is Fora CRM truly open source?",
      answer: "Yes! The core platform is open source under the MIT license. You can fork it, host it yourself, and modify it to fit your exact business needs without any vendor lock-in."
    },
    {
      question: "Can I use my existing WhatsApp number?",
      answer: "Yes, you can migrate an existing WhatsApp number to the Business API, provided it's not currently active on the regular WhatsApp consumer or Business app."
    },
    {
      question: "What happens if I exceed the message limits?",
      answer: "Message limits and pricing are determined by your API provider (e.g., Meta). Fora CRM does not charge per message. You only pay for your hosting or our cloud plan."
    },
    {
      question: "How difficult is it to self-host?",
      answer: "If you're familiar with Next.js and Supabase, it's very straightforward. We provide detailed deployment guides for platforms like Vercel and Railway to get you up and running quickly."
    }
  ];

  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4 sm:px-8 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-primary font-semibold tracking-wide uppercase text-sm mb-3">FAQ</h2>
          <h3 className="text-3xl md:text-5xl font-bold">Questions, answered</h3>
          <p className="text-lg text-muted-foreground mt-4">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <Accordion className="w-full mb-24">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border/40">
              <AccordionTrigger className="text-left text-lg font-medium hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* CTA Banner */}
        <div className="relative rounded-3xl border border-border/50 bg-card p-10 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background -z-10"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-64 bg-primary/20 blur-[100px] rounded-full -z-10"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to stop switching between tools?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join modern businesses running their WhatsApp operations on Fora CRM.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto bg-primary hover:bg-primary-hover text-white shadow-[0_0_20px_rgba(var(--primary),0.4)] h-12 px-8 text-base" })}>
              Get started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/login" className={buttonVariants({ size: "lg", variant: "ghost", className: "w-full sm:w-auto h-12 px-8 text-base" })}>
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
