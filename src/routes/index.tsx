import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { Features } from "@/components/Features";
import { LiveDemo } from "@/components/LiveDemo";
import { HowItWorks } from "@/components/HowItWorks";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Pricing } from "@/components/Pricing";
import { UrgencyCTA } from "@/components/UrgencyCTA";
import { Waitlist } from "@/components/Waitlist";
import { Footer } from "@/components/Footer";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { LiveCounter } from "@/components/LiveCounter";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "HireMate — AI Mock Interviews for PM, SWE & Analyst Roles" },
      {
        name: "description",
        content: "Stop guessing. Start cracking interviews. Practice real questions, get AI feedback, and benchmark your readiness — built for Indian job seekers.",
      },
      { property: "og:title", content: "HireMate — AI Mock Interviews That Actually Help You Crack Interviews" },
      { property: "og:description", content: "Real interview simulation, AI feedback, benchmark scoring, and a personalized growth roadmap for PM, SWE, and Analyst roles." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <LiveDemo />
        <HowItWorks />
        <DashboardPreview />
        <Pricing />
        <UrgencyCTA />
        <Waitlist />
      </main>
      <Footer />
      <StickyMobileCTA />
      <LiveCounter />
      <ExitIntentPopup />
    </div>
  );
}
