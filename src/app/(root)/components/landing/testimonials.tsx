"use client";

import Image from "next/image";
import { Star } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { testimonials } from "@/app/(root)/constants/landing";

export function Testimonials() {
  return (
    <section id="testimonials" className="relative overflow-hidden py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-slate-900 md:text-4xl dark:text-white">
            Join thousands of certified tradespeople
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            We&apos;ve helped over 15,000 apprentices across Canada achieve
            their Red Seal certification. See what they have to say about their
            journey.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3"
                >
                  <div className="border-border flex h-full flex-col justify-between rounded-xl border bg-white p-6 shadow-sm dark:bg-slate-900">
                    <div>
                      <div className="mb-4 flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-foreground mb-6 leading-relaxed font-medium italic">
                        &quot;{testimonial.quote}&quot;
                      </p>
                    </div>
                    <div className="mt-auto flex items-center gap-3">
                      <Image
                        src={testimonial.img}
                        alt={testimonial.author}
                        width={40}
                        height={40}
                        className="rounded-full bg-slate-200"
                      />
                      <div>
                        <p className="text-foreground text-sm font-bold">
                          {testimonial.author}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-8 flex justify-center gap-2">
              <CarouselPrevious className="static mr-2 translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
