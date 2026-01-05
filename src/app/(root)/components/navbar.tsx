"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Hammer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 left-0 z-50 border-b border-transparent transition-all duration-300 ease-in-out",
        isScrolled
          ? "border-border/50 bg-background/80 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          <Link href="/" className="flex shrink-0 cursor-pointer items-center">
            <div className="bg-primary text-primary-foreground shadow-primary/20 mr-2 flex h-8 w-8 items-center justify-center rounded-lg shadow-lg md:mr-3 md:h-10 md:w-10">
              <Hammer className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <span className="font-heading text-foreground text-lg font-bold tracking-tight md:text-xl">
              <span className="text-primary">Pass</span>RedSeal
            </span>
          </Link>

          <nav className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group text-muted-foreground hover:text-primary relative text-sm font-medium transition-colors"
              >
                {link.name}
                <span className="bg-primary absolute -bottom-1 left-0 h-0.5 w-0 opacity-0 transition-all group-hover:w-full group-hover:opacity-100" />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center space-x-4 md:flex">
            <Button
              asChild
              variant="ghost"
              className="text-muted-foreground hover:text-foreground font-medium"
            >
              <Link href="/sign-in">Log in</Link>
            </Button>
            <Button
              asChild
              className="shadow-primary/20 hover:shadow-primary/30 font-medium shadow-lg transition-all"
            >
              <Link href="/sign-up">Start Free Trial</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-border bg-background overflow-hidden border-b md:hidden"
          >
            <div className="space-y-2 px-4 pt-2 pb-6 shadow-inner">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-foreground hover:bg-muted block w-full rounded-md px-3 py-3 text-left text-base font-medium transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-border mt-4 space-y-3 border-t pt-4">
                <Button
                  asChild
                  variant="ghost"
                  className="text-muted-foreground w-full justify-start"
                >
                  <Link href="/sign-in">Log in</Link>
                </Button>

                <Button asChild className="w-full">
                  <Link href="/sign-up">Start Free Trial</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
