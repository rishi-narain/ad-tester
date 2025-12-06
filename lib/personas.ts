export interface Persona {
  id: string;
  name: string;
  description: string;
  motivations: string[];
  painPoints: string[];
  emotionalTriggers: string[];
  buyingBehavior: string;
}

export const personas: Persona[] = [
  {
    id: "busy-professional",
    name: "Busy Professional",
    description: "Time-strapped executive or manager juggling multiple priorities",
    motivations: [
      "Efficiency and time-saving solutions",
      "Professional growth and advancement",
      "Work-life balance",
      "Status and recognition",
    ],
    painPoints: [
      "Lack of time for research and decision-making",
      "Information overload",
      "Inefficient processes",
      "Missing opportunities due to time constraints",
    ],
    emotionalTriggers: [
      "Fear of missing out (FOMO)",
      "Desire for respect and status",
      "Anxiety about falling behind",
      "Pride in making smart, quick decisions",
    ],
    buyingBehavior:
      "Makes quick decisions based on clear value propositions. Prefers premium options that save time. Values convenience over price. Responds to urgency and exclusivity.",
  },
  {
    id: "adhd-achiever",
    name: "ADHD Achiever",
    description: "High-achieving individual with ADHD who seeks systems and tools to manage focus and productivity",
    motivations: [
      "Overcoming executive function challenges",
      "Achieving goals despite obstacles",
      "Finding systems that work",
      "Proving capability and competence",
    ],
    painPoints: [
      "Difficulty maintaining focus",
      "Procrastination and time blindness",
      "Overwhelm from too many options",
      "Feeling misunderstood or judged",
    ],
    emotionalTriggers: [
      "Hope for solutions that actually work",
      "Validation and understanding",
      "Fear of failure",
      "Excitement about new possibilities",
    ],
    buyingBehavior:
      "Drawn to clear, simple solutions. Needs immediate clarity on benefits. Responds to understanding and empathy. May impulse buy when emotionally triggered. Values authenticity over polish.",
  },
  {
    id: "budget-conscious-shopper",
    name: "Budget-Conscious Shopper",
    description: "Price-sensitive consumer who carefully evaluates value and seeks deals",
    motivations: [
      "Maximizing value for money",
      "Finding the best deals",
      "Financial security",
      "Smart spending decisions",
    ],
    painPoints: [
      "Limited budget",
      "Fear of overpaying",
      "Difficulty comparing options",
      "Missing out on deals",
    ],
    emotionalTriggers: [
      "Fear of wasting money",
      "Pride in finding deals",
      "Anxiety about financial security",
      "Satisfaction from smart purchases",
    ],
    buyingBehavior:
      "Extensive research before purchasing. Compares prices across multiple sources. Responds to discounts, sales, and value propositions. Needs clear ROI justification. Price-sensitive but values quality.",
  },
  {
    id: "trend-chasing-teen",
    name: "Trend-Chasing Teen",
    description: "Social media-native teenager who follows trends and seeks peer validation",
    motivations: [
      "Fitting in with peers",
      "Staying current with trends",
      "Social media presence",
      "Self-expression and identity",
    ],
    painPoints: [
      "Fear of being left out",
      "Pressure to keep up",
      "Limited budget",
      "Navigating social dynamics",
    ],
    emotionalTriggers: [
      "FOMO (Fear of Missing Out)",
      "Desire for social validation",
      "Excitement about new trends",
      "Anxiety about social status",
    ],
    buyingBehavior:
      "Impulse-driven purchases. Influenced by social media and peer recommendations. Values aesthetics and trendiness over durability. Responds to limited-time offers and exclusivity. Price-sensitive but willing to spend on status items.",
  },
  {
    id: "fitness-focused-millennial",
    name: "Fitness-Focused Millennial",
    description: "Health-conscious millennial prioritizing wellness and active lifestyle",
    motivations: [
      "Physical health and wellness",
      "Achieving fitness goals",
      "Mental health and stress relief",
      "Community and belonging",
    ],
    painPoints: [
      "Lack of motivation",
      "Time constraints",
      "Conflicting information",
      "Plateauing progress",
    ],
    emotionalTriggers: [
      "Desire for transformation",
      "Fear of health decline",
      "Pride in achievements",
      "Connection with like-minded people",
    ],
    buyingBehavior:
      "Invests in health and wellness products. Values quality and proven results. Responds to before/after stories and social proof. Willing to pay premium for effectiveness. Seeks community and accountability.",
  },
  {
    id: "new-parent",
    name: "New Parent",
    description: "First-time or new parent navigating parenthood with high emotional investment",
    motivations: [
      "Child's safety and wellbeing",
      "Being a good parent",
      "Convenience and time-saving",
      "Peace of mind",
    ],
    painPoints: [
      "Overwhelm and exhaustion",
      "Information overload",
      "Decision fatigue",
      "Financial pressure",
    ],
    emotionalTriggers: [
      "Love and protectiveness for child",
      "Fear of making wrong choices",
      "Desire to do everything right",
      "Guilt and self-doubt",
    ],
    buyingBehavior:
      "Emotionally-driven purchases. Prioritizes safety and quality over price. Responds to recommendations from trusted sources. Values convenience highly. May overspend due to emotional triggers. Needs clear, simple information.",
  },
  {
    id: "early-tech-adopter",
    name: "Early Tech Adopter",
    description: "Tech enthusiast who loves cutting-edge technology and being first to try new innovations",
    motivations: [
      "Being on the cutting edge",
      "Exploring new possibilities",
      "Optimizing life with technology",
      "Status from owning latest tech",
    ],
    painPoints: [
      "Waiting for new releases",
      "Compatibility issues",
      "Learning curves",
      "Cost of staying current",
    ],
    emotionalTriggers: [
      "Excitement about innovation",
      "Fear of being left behind",
      "Pride in tech-savviness",
      "Curiosity and exploration",
    ],
    buyingBehavior:
      "Early adopter willing to pay premium. Values innovation and features over price. Responds to exclusivity and early access. Needs detailed technical information. Impulse buys when excited about new tech.",
  },
];

export function getPersonaById(id: string): Persona | undefined {
  return personas.find((p) => p.id === id);
}

