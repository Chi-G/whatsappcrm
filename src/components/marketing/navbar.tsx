import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8" />
            <span className="font-bold text-lg hidden sm:inline-block">fora CRM</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#benefits" className="hover:text-foreground transition-colors">Benefits</Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it works</Link>
          <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className={buttonVariants({ variant: "ghost", className: "hidden sm:inline-flex" })}>
            Log in
          </Link>
          {/* <Link href="/signup" className={buttonVariants({ className: "bg-primary hover:bg-primary-hover text-white shadow-[0_0_15px_rgba(var(--primary),0.5)]" })}>
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link> */}
        </div>
      </div>
    </header>
  );
}
