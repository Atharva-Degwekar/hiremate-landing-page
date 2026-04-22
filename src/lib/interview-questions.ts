export type Role = "PM" | "SWE" | "Analyst";

export const ROLES: { value: Role; label: string; desc: string }[] = [
  { value: "PM", label: "Product Manager", desc: "Strategy, prioritization, metrics" },
  { value: "SWE", label: "Software Engineer", desc: "DSA, system design, behavioral" },
  { value: "Analyst", label: "Data / Business Analyst", desc: "SQL, case studies, metrics" },
];

export const QUESTIONS: Record<Role, string[]> = {
  PM: [
    "Tell me about a product you launched. What problem did it solve and what was the impact?",
    "How would you improve Swiggy's home screen for tier-2 cities?",
    "A feature you shipped saw 30% drop in DAU after week 2. How do you debug it?",
    "How do you decide between two competing roadmap items with the same effort?",
  ],
  SWE: [
    "Walk me through a technical project where you owned the design end-to-end.",
    "Design a URL shortener that handles 10K writes/sec. What are the bottlenecks?",
    "Tell me about a time you disagreed with a teammate on a technical decision.",
    "How would you debug a production incident where p99 latency suddenly doubled?",
  ],
  Analyst: [
    "Walk me through an analysis you ran end-to-end and the business decision it drove.",
    "DAU dropped 8% week-over-week. How would you investigate?",
    "How do you decide which metric to optimize for a new feature?",
    "Tell me about a stakeholder you struggled to align with and how you handled it.",
  ],
};
