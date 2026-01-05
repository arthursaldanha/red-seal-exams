import Link from "next/link";
import { Hammer, Twitter, Linkedin, Facebook } from "lucide-react";

const productLinks = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Study Guides", href: "/guides" },
  { name: "Mobile App", href: "/app" },
];

const resourceLinks = [
  { name: "Blog", href: "/blog" },
  { name: "Success Stories", href: "/stories" },
  { name: "Exam Tips", href: "/tips" },
  { name: "Help Center", href: "/help" },
];

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
];

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="border-border border-t bg-slate-50 pt-16 pb-8 dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <div className="bg-primary text-primary-foreground mr-2 flex h-8 w-8 items-center justify-center rounded-lg shadow-md">
                <Hammer className="h-4 w-4" />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight">
                RedSeal<span className="text-primary">Prep</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Helping skilled tradespeople across Canada pass their Red Seal
              exams with confidence. Expert-crafted questions, detailed
              explanations, and progress tracking.
            </p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full p-2 transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-foreground mb-4 font-semibold">Product</h3>
            <ul className="text-muted-foreground space-y-3 text-sm">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground mb-4 font-semibold">Resources</h3>
            <ul className="text-muted-foreground space-y-3 text-sm">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground mb-4 font-semibold">Company</h3>
            <ul className="text-muted-foreground space-y-3 text-sm">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-border flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="text-muted-foreground mb-4 text-xs md:mb-0">
            &copy; {new Date().getFullYear()} Red Seal Prep. All rights
            reserved.
          </p>
          <div className="text-muted-foreground flex space-x-6 text-xs">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              className="hover:text-primary transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
