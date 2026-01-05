import {
  BookOpen,
  TrendingUp,
  Clock,
  Award,
  ShieldCheck,
  Hammer,
  Zap,
  Wrench,
  Flame,
  HardHat,
  type LucideIcon,
} from "lucide-react";

export interface Trade {
  icon: LucideIcon;
  name: string;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  img: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export const trades: Trade[] = [
  { icon: Zap, name: "Electrician" },
  { icon: Wrench, name: "Plumber" },
  { icon: Hammer, name: "Carpenter" },
  { icon: Flame, name: "Welder" },
  { icon: HardHat, name: "Heavy Duty" },
];

export const features: Feature[] = [
  {
    icon: BookOpen,
    title: "Comprehensive Question Bank",
    desc: "Access thousands of practice questions modeled after real Red Seal exams for your specific trade.",
  },
  {
    icon: TrendingUp,
    title: "Smart Progress Tracking",
    desc: "Visualize your strengths and weaknesses. Our algorithm adapts to focus on areas where you need improvement.",
  },
  {
    icon: Clock,
    title: "Timed Exam Simulations",
    desc: "Practice under real exam conditions with timed tests to build your stamina and time management skills.",
  },
  {
    icon: ShieldCheck,
    title: "Detailed Explanations",
    desc: "Don't just guess. Understand why an answer is correct with detailed references to code and theory.",
  },
  {
    icon: Hammer,
    title: "Trade-Specific Content",
    desc: "Content tailored for Electricians, Plumbers, Carpenters, Welders, HVAC, and 50+ other trades.",
  },
  {
    icon: Award,
    title: "Completion Certificate",
    desc: "Earn a certificate of readiness when you consistently score above passing grade in our simulations.",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "The practice exams were harder than the real thing, which made the actual exam feel like a breeze. Passed with 88%!",
    author: "Sarah J.",
    role: "Red Seal Electrician",
    img: "https://i.pravatar.cc/100?img=5",
  },
  {
    quote:
      "I failed my first attempt using just textbooks. After 3 weeks with RedSealPrep, I passed. The explanations are gold.",
    author: "Michael T.",
    role: "Red Seal Plumber",
    img: "https://i.pravatar.cc/100?img=11",
  },
  {
    quote:
      "Worth every penny. Being able to study on my phone during lunch breaks was a game changer for me.",
    author: "David R.",
    role: "Red Seal Carpenter",
    img: "https://i.pravatar.cc/100?img=3",
  },
  {
    quote:
      "The timed simulation mode really helped me with my anxiety. I walked into the exam room feeling completely prepared.",
    author: "Jessica M.",
    role: "Red Seal Welder",
    img: "https://i.pravatar.cc/100?img=9",
  },
  {
    quote:
      "Finally a platform that actually explains WHY an answer is wrong. This helped me understand the code book so much better.",
    author: "Robert K.",
    role: "HVAC Technician",
    img: "https://i.pravatar.cc/100?img=12",
  },
];

export const faqItems: FAQItem[] = [
  {
    q: "Is the content updated for the latest 2025 code requirements?",
    a: "Yes! We update our question bank weekly to reflect the latest National Building Code, Canadian Electrical Code, and other relevant trade standards.",
  },
  {
    q: "How close are the questions to the actual Red Seal exam?",
    a: "Our questions are designed by Red Seal certified instructors who have taken the exams. While exact questions are never identical (that would be illegal), the format, difficulty, and topics are carefully matched to the official exam blueprint.",
  },
  {
    q: "Can I use this on my phone?",
    a: "Absolutely. Our platform is fully responsive and works great on iPhone, Android, tablets, and desktop computers.",
  },
  {
    q: "Do you offer a guarantee if I don't pass?",
    a: "Yes. If you purchase the 'Exam Guarantee' package, complete 90% of the course material, and don't pass your exam, we will refund your money in full.",
  },
  {
    q: "Is there a limit to how many practice exams I can take?",
    a: "On paid plans, there is no limit. You can generate unlimited unique practice exams to test your knowledge.",
  },
];

export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
