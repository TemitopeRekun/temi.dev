import React from "react";

export type ServiceItem = {
  key: string;
  title: string;
  description: string;
  price: string;
  icon: React.ReactNode;
};

export const SERVICES: ServiceItem[] = [
  {
    key: "fullstack",
    title: "Full-Stack Development",
    description:
      "Production-grade web apps with Next.js, NestJS, PostgreSQL, and modern CI/CD.",
    price: "$4k–$20k+",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="w-6 h-6">
        <path
          d="M3 7l9-4 9 4-9 4-9-4Zm0 6l9-4 9 4-9 4-9-4Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
    ),
  },
  {
    key: "ai",
    title: "AI Automation",
    description:
      "Integrations, agents, and embeddings with robust monitoring and safety.",
    price: "$3k–$15k+",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="w-6 h-6">
        <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.2" />
        <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    key: "mobile",
    title: "Mobile Engineering",
    description:
      "React Native apps, shared design systems, and efficient release pipelines.",
    price: "$5k–$30k+",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="w-6 h-6">
        <rect x="7" y="2" width="10" height="20" rx="2" fill="currentColor" />
        <circle cx="12" cy="18" r="1.5" fill="var(--bg)" />
      </svg>
    ),
  },
  {
    key: "consult",
    title: "Freelance/Consulting",
    description:
      "Architecture reviews, performance tuning, and scoped feature delivery.",
    price: "$120–$180/hr",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="w-6 h-6">
        <path
          d="M4 4h16v4H4zM4 10h10v10H4zM16 14h4v6h-4z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];
