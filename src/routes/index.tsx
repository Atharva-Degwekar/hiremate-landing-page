import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { Waitlist } from "@/components/Waitlist";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "HireMate — AI-Powered Mock Interview Preparation" },
      {
        name: "description",
        content: "Practice with AI that gives real, role-specific feedback for PM, SWE, and Analyst interviews. Walk in confident, not guessing.",
      },
      { property: "og:title", content: "HireMate — AI-Powered Mock Interview Preparation" },
      { property: "og:description", content: "Role-specific AI mock interviews, benchmark scoring, and a personalized growth roadmap." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}
