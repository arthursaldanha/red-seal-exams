"use client";

import { motion } from "framer-motion";

import { features } from "@/app/(root)/constants/landing";

export function Features() {
  return (
    <section id="features" className="bg-slate-50 py-24 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
            Everything you need to pass
          </h2>
          <p className="text-muted-foreground text-lg">
            Our platform is designed specifically for the Canadian Red Seal
            standards, covering all major trades with up-to-date material.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group border-border bg-background rounded-2xl border p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-foreground mb-3 text-xl font-bold">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
