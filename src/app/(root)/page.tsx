import { Hero } from "./components/landing/Hero";
import { Features } from "./components/landing/Features";
import { SocialProof } from "./components/landing/SocialProof";
import { Pricing } from "./components/landing/Pricing";
import { FAQ } from "./components/landing/FAQ";
import { Footer } from "./components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      <SocialProof />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}
