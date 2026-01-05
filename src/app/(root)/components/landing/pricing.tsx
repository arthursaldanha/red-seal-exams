"use client";

import Link from "next/link";
import { CheckCircle, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Pricing() {
  return (
    <section id="pricing" className="bg-slate-50 py-24 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose the plan that fits your study timeline.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-2">
          <MonthlyCard />
          <GuaranteeCard />
        </div>

        <div className="mx-auto mt-12 w-fit rounded-full bg-slate-100 px-6 py-3 dark:bg-slate-800">
          <p className="text-muted-foreground inline-block text-center text-sm">
            <ShieldCheck className="text-primary mr-2 inline h-4 w-4" />
            Both plans include our 7-day risk-free money-back guarantee.
          </p>
        </div>
      </div>
    </section>
  );
}

function MonthlyCard() {
  return (
    <Card className="border-border h-full shadow-sm transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Monthly Pass</CardTitle>
        <CardDescription>Flexible study option</CardDescription>
        <div className="mt-4">
          <span className="text-foreground text-4xl font-bold">$49</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm">
          <li className="flex items-center gap-2">
            <CheckCircle className="text-primary h-4 w-4" /> Unlimited practice
            questions
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="text-primary h-4 w-4" /> Unlimited exam
            simulations
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="text-primary h-4 w-4" /> Basic progress
            tracking
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="text-primary h-4 w-4" /> Mobile app access
          </li>
          <li className="text-muted-foreground/50 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" /> Cancel anytime
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="h-12 w-full font-semibold">
          <Link href="/sign-up">Start Monthly Plan</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function GuaranteeCard() {
  return (
    <Card className="border-primary bg-background relative z-10 flex h-full scale-105 flex-col shadow-2xl">
      <div className="bg-primary text-primary-foreground absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide whitespace-nowrap uppercase shadow-md">
        Most Popular
      </div>
      <CardHeader className="pb-4">
        <CardTitle className="text-primary text-2xl">Exam Guarantee</CardTitle>
        <CardDescription>
          Study until you pass - One time payment
        </CardDescription>
        <div className="mt-4">
          <span className="text-foreground text-5xl font-bold">$129</span>
          <span className="text-muted-foreground font-medium">/lifetime</span>
        </div>
      </CardHeader>
      <CardContent className="grow">
        <ul className="space-y-4 text-sm font-medium">
          <li className="flex items-center gap-2">
            <CheckCircle className="text-accent h-5 w-5 shrink-0" />
            <span className="font-bold">Pass Guarantee</span> (Money back)
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="text-accent h-5 w-5 shrink-0" /> Lifetime
            access to all content
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="text-accent h-5 w-5 shrink-0" /> Advanced
            analytics & AI insights
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="text-accent h-5 w-5 shrink-0" /> Detailed
            code book references
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="text-accent h-5 w-5 shrink-0" /> Printable
            study cheat sheets
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="text-accent h-5 w-5 shrink-0" /> Priority
            24/7 support
          </li>
        </ul>
      </CardContent>
      <CardFooter className="pt-4">
        <Button
          asChild
          size="lg"
          className="shadow-primary/20 hover:shadow-primary/30 h-14 w-full text-lg shadow-lg transition-all"
        >
          <Link href="/sign-up">Get Lifetime Access</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
