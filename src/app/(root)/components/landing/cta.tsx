"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="bg-primary text-primary-foreground relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h2 className="mb-6 text-3xl font-bold md:text-5xl">
          Ready to get your Red Seal?
        </h2>
        <p className="text-primary-foreground/80 mx-auto mb-10 max-w-2xl text-xl">
          Stop stressing and start studying smarter. Join thousands of
          successful tradespeople today.
        </p>
        <Button
          asChild
          size="lg"
          variant="secondary"
          className="text-primary h-14 px-10 text-lg font-bold shadow-2xl hover:bg-white"
        >
          <Link href="/sign-up">Start Your Free Trial</Link>
        </Button>
        <p className="text-primary-foreground/70 mt-4 text-sm">
          No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  );
}
