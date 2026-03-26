import { Hero } from "@/components/landing/Hero";
import { ProblemCards } from "@/components/landing/ProblemCards";
import { RootCause } from "@/components/landing/RootCause";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { ReportPreview } from "@/components/landing/ReportPreview";
import { Credibility } from "@/components/landing/Credibility";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-4">
        <Hero />
        <ProblemCards />
        <RootCause />
        <FeatureGrid />
        <ReportPreview />
        <Credibility />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </div>
    </main>
  );
}
