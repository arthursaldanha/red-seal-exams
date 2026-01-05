import type { Metadata } from "next";

import { Navbar } from "@/app/(root)/components/navbar";
import { Footer } from "@/app/(root)/components/footer";
import {
  Hero,
  Features,
  Testimonials,
  Pricing,
  FAQ,
  CTA,
} from "@/app/(root)/components/landing";

export const metadata: Metadata = {
  title: "PassRedSeal - Pass Your Red Seal Exam on the First Try",
  description:
    "Master your trade with comprehensive practice questions, detailed explanations, and smart progress tracking. Join thousands of Canadian tradespeople who certified with confidence. Electrician, Plumber, Carpenter, Welder, HVAC and 50+ trades.",
  keywords: [
    "Red Seal Exam",
    "Red Seal Practice Test",
    "Red Seal Certification",
    "Canadian Trades Exam",
    "Electrician Exam",
    "Plumber Exam",
    "Carpenter Exam",
    "Welder Exam",
    "HVAC Exam",
    "Trade Certification Canada",
    "Interprovincial Standards",
    "Red Seal Prep",
    "Trade Practice Questions",
  ],
  authors: [{ name: "PassRedSeal" }],
  creator: "PassRedSeal",
  publisher: "PassRedSeal",
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://passredseal.com",
    siteName: "PassRedSeal",
    title: "PassRedSeal - Pass Your Red Seal Exam on the First Try",
    description:
      "Master your trade with comprehensive practice questions, detailed explanations, and smart progress tracking. Join thousands of Canadian tradespeople who certified with confidence.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PassRedSeal - Red Seal Exam Preparation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PassRedSeal - Pass Your Red Seal Exam on the First Try",
    description:
      "Master your trade with comprehensive practice questions, detailed explanations, and smart progress tracking.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://passredseal.com",
  },
};

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden font-sans">
      <Navbar />

      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
