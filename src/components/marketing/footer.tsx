import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Logo className="h-8 w-8" />
              <span className="font-bold text-lg">fora CRM</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              The open-source WhatsApp Inbox & CRM for modern businesses.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#benefits" className="hover:text-primary transition-colors">Benefits</Link></li>
              <li><Link href="#how-it-works" className="hover:text-primary transition-colors">How it works</Link></li>
              <li><Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Fora CRM. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-foreground transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Discord</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
