import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, X, Coffee, Award, DollarSign, Briefcase,
  ChevronDown, Check, ArrowRight, Sparkles, Send,
  User, Target, BookOpen, Users, MessageCircle,
  GraduationCap, Zap, Home,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Screen = "landing" | "onboarding" | "app";
type Tab = "dashboard" | "milestones" | "match" | "profile";
type MilestoneStatus = "not_started" | "in_progress" | "completed";

interface Milestone {
  id: string;
  title: string;
  track: "career" | "money" | "life";
  description: string;
  status: MilestoneStatus;
  progress: number;
  starterQuestions: string[];
}

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  school: string;
  interests: string[];
  completedMilestone: string;
  matchReason: string;
  photoId: string;
  badges: string[];
  chats: number;
}

interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MILESTONES: Milestone[] = [
  {
    id: "first-job",
    title: "First Full-Time Job",
    track: "career",
    description: "Land your first full-time role and understand what comes next — offer letters, benefits, and day-one prep.",
    status: "completed",
    progress: 100,
    starterQuestions: ["How do I find entry-level jobs?", "What should I know before day one?", "How do I negotiate a start date?"],
  },
  {
    id: "negotiate-offer",
    title: "Negotiate Your Offer",
    track: "career",
    description: "Learn how to confidently negotiate salary, equity, and benefits without burning a bridge.",
    status: "in_progress",
    progress: 65,
    starterQuestions: ["How do I start the negotiation conversation?", "What if they say the offer is fixed?", "What besides salary can I negotiate?"],
  },
  {
    id: "linkedin",
    title: "LinkedIn Presence",
    track: "career",
    description: "Build a profile that gets recruiters and mentors reaching out — not the other way around.",
    status: "not_started",
    progress: 0,
    starterQuestions: ["What makes a strong headline?", "How often should I post?", "Should I connect with strangers?"],
  },
  {
    id: "portfolio",
    title: "Build Your Portfolio",
    track: "career",
    description: "Create a portfolio that showcases your work and opens doors.",
    status: "not_started",
    progress: 0,
    starterQuestions: ["What should go in a portfolio?", "Do I need a personal website?", "How do I present student projects?"],
  },
  {
    id: "first-paycheck",
    title: "First Paycheck Plan",
    track: "money",
    description: "Understand your paycheck, taxes, and where every dollar goes — before you spend a single cent.",
    status: "completed",
    progress: 100,
    starterQuestions: ["Why is my take-home less than my salary?", "What is FICA?", "How should I split my first paycheck?"],
  },
  {
    id: "first-budget",
    title: "First Budget",
    track: "money",
    description: "Build a budget that actually fits your life — not a spreadsheet you'll abandon by week three.",
    status: "in_progress",
    progress: 40,
    starterQuestions: ["What is the 50/30/20 rule?", "What budgeting apps should I use?", "How do I budget with irregular income?"],
  },
  {
    id: "emergency-fund",
    title: "Emergency Fund",
    track: "money",
    description: "Build a 3–6 month safety net so life's surprises don't derail your finances.",
    status: "not_started",
    progress: 0,
    starterQuestions: ["How much should I save?", "Where should I keep my emergency fund?", "What counts as an emergency?"],
  },
  {
    id: "roth-ira",
    title: "Open a Roth IRA",
    track: "money",
    description: "Start growing tax-free retirement wealth — even on an entry-level salary.",
    status: "not_started",
    progress: 0,
    starterQuestions: ["What is the difference between Roth and traditional?", "How much can I contribute?", "Where do I open one?"],
  },
  {
    id: "build-credit",
    title: "Build Credit",
    track: "money",
    description: "Establish and grow a credit score that works for you — safely.",
    status: "not_started",
    progress: 0,
    starterQuestions: ["How do I check my credit score?", "What credit card should I get first?", "How long does it take to build credit?"],
  },
  {
    id: "first-apartment",
    title: "First Apartment",
    track: "life",
    description: "Navigate your first lease, security deposits, and the real cost of adulting.",
    status: "not_started",
    progress: 0,
    starterQuestions: ["How much rent can I afford?", "What should I look for in a lease?", "Do I need renters insurance?"],
  },
  {
    id: "student-loans",
    title: "Student Loan Strategy",
    track: "life",
    description: "Get a clear repayment plan for student debt — without sacrificing your life.",
    status: "not_started",
    progress: 0,
    starterQuestions: ["What repayment plan should I choose?", "Should I refinance?", "Do I qualify for forgiveness programs?"],
  },
];

const MENTORS: Mentor[] = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "Senior Product Manager",
    company: "Google",
    school: "UC Berkeley",
    interests: ["Product", "Data"],
    completedMilestone: "Negotiate Offer",
    matchReason: "Both interested in Product · Completed 'Negotiate Offer' · Can help with Salary Negotiation",
    photoId: "1573497019236-61c7966fb394",
    badges: ["Negotiate Offer", "Roth IRA"],
    chats: 14,
  },
  {
    id: "2",
    name: "Aisha Johnson",
    role: "Engineering Manager",
    company: "Stripe",
    school: "Howard University",
    interests: ["SWE", "Finance"],
    completedMilestone: "First Full-Time Job",
    matchReason: "Both interested in SWE · Completed 'First Full-Time Job' · Can help with Tech Interviews",
    photoId: "1531746020798-e6953c6e8e04",
    badges: ["First Full-Time Job", "Emergency Fund"],
    chats: 22,
  },
  {
    id: "3",
    name: "Maya Chen",
    role: "VP of Finance",
    company: "Andreessen Horowitz",
    school: "NYU Stern",
    interests: ["Finance", "Consulting"],
    completedMilestone: "Roth IRA",
    matchReason: "Both interested in Finance · Completed 'Roth IRA' · Can help with Investing Basics",
    photoId: "1534528741775-53994a69daeb",
    badges: ["Roth IRA", "Build Credit", "First Budget"],
    chats: 31,
  },
  {
    id: "4",
    name: "Jordan Williams",
    role: "Data Scientist",
    company: "Netflix",
    school: "Stanford",
    interests: ["Data", "Product"],
    completedMilestone: "Build Credit",
    matchReason: "Both interested in Data · Completed 'Build Credit' · Can help with Financial Planning",
    photoId: "1517841905240-472988babdf9",
    badges: ["Build Credit", "Negotiate Offer"],
    chats: 9,
  },
  {
    id: "5",
    name: "Sofia Reyes",
    role: "Marketing Director",
    company: "Spotify",
    school: "USC",
    interests: ["Marketing", "Product"],
    completedMilestone: "First Budget",
    matchReason: "Both interested in Marketing · Completed 'First Budget' · Can help with Personal Branding",
    photoId: "1508214751196-bcfd4ca60f91",
    badges: ["First Budget", "First Full-Time Job"],
    chats: 17,
  },
];

const AI_RESPONSES: Record<string, string> = {
  "How do I start the negotiation conversation?":
    "Lead with enthusiasm, then pivot: 'I'm so excited about this offer! I'd love to discuss the compensation package.' Research shows that whoever anchors first sets the range. Prepare a number 15–20% above your target and name it confidently.",
  "What if they say the offer is fixed?":
    "Almost no offer is truly fixed — that's a negotiating tactic. Try: 'I understand base may be set, but could we explore a signing bonus, extra equity, or remote flexibility?' If they hold firm, ask for a 90-day performance review with a raise tied to specific goals.",
  "What besides salary can I negotiate?":
    "Great question! Signing bonus (one-time, often easy to grant), equity/RSUs, remote work days, title, professional development budget, equipment stipend, and vacation days. These have real dollar value and are frequently more flexible than base salary.",
  "default":
    "That is a great question. The most important thing is to go in prepared: research Glassdoor, Levels.fyi, and LinkedIn Salary for your role and location. Knowledge is your strongest negotiating asset. What specific part would you like to dig into?",
};

// ─── Shared Components ────────────────────────────────────────────────────────

function ProgressRing({
  percent,
  size = 120,
  strokeWidth = 10,
  ringId,
  children,
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
  ringId: string;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const gid = `rg-${ringId}`;

  return (
    <div
      className="relative inline-flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="55%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#C4B5FD" strokeWidth={strokeWidth} opacity={0.22}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={`url(#${gid})`} strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.55s ease" }}
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: MilestoneStatus }) {
  if (status === "completed")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
        style={{ background: "#D1FAE5", color: "#065F46" }}>
        <Check size={9} strokeWidth={3} /> Completed
      </span>
    );
  if (status === "in_progress")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
        style={{ background: "#FEF3C7", color: "#92400E" }}>
        <Zap size={9} /> In Progress
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: "#EDE9FE", color: "#6D28D9" }}>
      Not Started
    </span>
  );
}

// ─── Landing ─────────────────────────────────────────────────────────────────

function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FBF7F2" }}>
      <nav className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)" }}>
            <Heart size={14} fill="white" className="text-white" />
          </div>
          <span className="text-lg font-bold" style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>
            MoneyMoves
          </span>
        </div>
        <button
          onClick={onStart}
          className="text-sm font-semibold px-4 py-2 rounded-full transition-colors"
          style={{ border: "1.5px solid #C4B5FD", color: "#7C3AED" }}>
          Sign in
        </button>
      </nav>

      <div className="flex-1 flex flex-col items-center px-6 pt-6 pb-16 max-w-md mx-auto w-full">
        {/* Hero ring cluster */}
        <div className="relative mb-10 mt-2">
          <ProgressRing percent={73} size={196} strokeWidth={13} ringId="lp-hero">
            <div className="text-center">
              <div className="font-extrabold text-3xl" style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>73%</div>
              <div className="text-xs font-semibold mt-0.5" style={{ color: "#A78BFA" }}>to your milestone</div>
            </div>
          </ProgressRing>
          <div className="absolute -top-1 -right-5" style={{ opacity: 0.85 }}>
            <ProgressRing percent={100} size={54} strokeWidth={5} ringId="lp-f1">
              <Check size={14} style={{ color: "#10B981" }} />
            </ProgressRing>
          </div>
          <div className="absolute -bottom-3 -left-7" style={{ opacity: 0.7 }}>
            <ProgressRing percent={38} size={46} strokeWidth={4} ringId="lp-f2">
              <span className="text-[9px] font-bold" style={{ color: "#7C3AED" }}>38%</span>
            </ProgressRing>
          </div>
          <div className="absolute top-10 -left-10" style={{ opacity: 0.55 }}>
            <ProgressRing percent={100} size={36} strokeWidth={3} ringId="lp-f3">
              <Award size={10} style={{ color: "#EC4899" }} />
            </ProgressRing>
          </div>
        </div>

        <h1 className="text-[2.2rem] font-extrabold text-center leading-[1.15] mb-4"
          style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>
          Your next money move<br />
          <span style={{ background: "linear-gradient(90deg, #7C3AED, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            starts with her.
          </span>
        </h1>

        <p className="text-center text-[15px] leading-relaxed mb-8"
          style={{ color: "#6B6280", fontFamily: "Inter, sans-serif", maxWidth: 320 }}>
          Match with women who've already hit your milestone. Learn from them. Earn your guide badge. Pay it forward.
        </p>

        {/* Three pillars */}
        <div className="grid grid-cols-3 gap-3 w-full mb-8">
          {[
            { icon: <Users size={19} />, label: "Match", sub: "Swipe to find your mentor" },
            { icon: <Sparkles size={19} />, label: "Learn", sub: "AI + real guidance" },
            { icon: <Award size={19} />, label: "Guide", sub: "Earn your badge" },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center p-3.5 rounded-2xl text-center"
              style={{ background: "white", boxShadow: "0 2px 14px rgba(124,58,237,0.09)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                style={{ background: "#F3F0FF", color: "#7C3AED" }}>
                {icon}
              </div>
              <div className="text-sm font-bold" style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>{label}</div>
              <div className="text-[11px] mt-0.5 leading-tight" style={{ color: "#9B8FA8" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-5 mb-8">
          {[["2,400+", "Mentors"], ["8,100+", "Matches made"], ["94%", "felt more confident"]].map(([n, l]) => (
            <div key={l} className="text-center flex-1">
              <div className="text-[1.35rem] font-extrabold" style={{ fontFamily: "Sora, sans-serif", color: "#7C3AED" }}>{n}</div>
              <div className="text-[11px] leading-tight" style={{ color: "#9B8FA8" }}>{l}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl text-white font-bold text-[17px] flex items-center justify-center gap-2.5 transition-transform active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #EC4899)",
            fontFamily: "Sora, sans-serif",
            boxShadow: "0 8px 28px rgba(124,58,237,0.38)",
          }}>
          Get started — it&apos;s free
          <ArrowRight size={20} />
        </button>
        <p className="text-xs mt-3 text-center" style={{ color: "#C4B5FD" }}>
          Women only · No gatekeeping · Built to pay it forward
        </p>
      </div>
    </div>
  );
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

const CAREER_STAGES = ["Freshman", "Sophomore", "Junior", "Senior", "Grad Student", "Recent Grad", "Early Career", "Professional"];
const CAREER_INTERESTS = ["SWE", "Product", "Finance", "Data", "Consulting", "Marketing", "Design", "Operations"];

function OnboardingScreen({ onDone }: { onDone: (name: string, school: string, email: string) => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [picked, setPicked] = useState<string[]>([]);

  const titles = ["About you", "Career stage", "Your interests", "Target milestones"];
  const canNext = [name.trim() && school.trim() && email.includes("@"), !!stage, interests.length > 0, picked.length > 0][step];

  function toggleInterest(v: string) {
    setInterests(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);
  }
  function togglePick(id: string) {
    setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FBF7F2" }}>
      {/* Header */}
      <div className="px-6 pt-8 pb-3">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)" }}>
            <Heart size={12} fill="white" className="text-white" />
          </div>
          <span className="font-bold" style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>MoneyMoves</span>
        </div>

        {/* Step progress bar */}
        <div className="flex gap-1.5 mb-4">
          {titles.map((_, i) => (
            <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-400"
              style={{ background: i <= step ? "linear-gradient(90deg, #7C3AED, #EC4899)" : "#E5DEFF" }} />
          ))}
        </div>
        <p className="text-[11px] font-semibold mb-1" style={{ color: "#B0A5BE" }}>Step {step + 1} of {titles.length}</p>
        <h2 className="text-2xl font-extrabold" style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>
          {titles[step]}
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.18 }}>

            {step === 0 && (
              <div className="space-y-4 pt-4">
                {[
                  { label: "Your name", value: name, set: setName, placeholder: "First name", type: "text" },
                  { label: "School or workplace", value: school, set: setSchool, placeholder: "e.g. Michigan, Deloitte, Self-employed", type: "text" },
                  { label: "School or work email", value: email, set: setEmail, placeholder: "you@university.edu", type: "email" },
                ].map(({ label, value, set, placeholder, type }) => (
                  <div key={label}>
                    <label className="text-sm font-semibold block mb-1.5" style={{ color: "#241C34" }}>{label}</label>
                    <input
                      type={type}
                      value={value}
                      onChange={e => set(e.target.value)}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 rounded-2xl border-2 outline-none text-[15px]"
                      style={{
                        background: "white",
                        borderColor: value ? "#7C3AED" : "#E5DEFF",
                        fontFamily: "Inter, sans-serif",
                        color: "#241C34",
                        transition: "border-color 0.2s",
                      }}
                    />
                  </div>
                ))}
                <p className="text-xs px-1" style={{ color: "#B0A5BE", fontFamily: "Inter, sans-serif" }}>
                  We'll use this to verify you're a current student or employee.
                </p>
                <div className="p-4 rounded-2xl flex items-start gap-3 mt-1" style={{ background: "#F3F0FF" }}>
                  <Sparkles size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#7C3AED" }} />
                  <p className="text-sm leading-relaxed" style={{ color: "#6B4FA8", fontFamily: "Inter, sans-serif" }}>
                    Your info helps us find mentors who've walked a path similar to yours.
                  </p>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="pt-4">
                <p className="text-sm mb-4" style={{ color: "#9B8FA8", fontFamily: "Inter, sans-serif" }}>Where are you right now?</p>
                <div className="grid grid-cols-2 gap-2">
                  {CAREER_STAGES.map(s => (
                    <button key={s} onClick={() => setStage(s)}
                      className="py-3 px-4 rounded-2xl text-sm font-semibold border-2 text-left transition-all"
                      style={{
                        background: stage === s ? "linear-gradient(135deg,#7C3AED,#A855F7)" : "white",
                        borderColor: stage === s ? "transparent" : "#E5DEFF",
                        color: stage === s ? "white" : "#241C34",
                        fontFamily: "Inter, sans-serif",
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="pt-4">
                <p className="text-sm mb-4" style={{ color: "#9B8FA8", fontFamily: "Inter, sans-serif" }}>Pick up to 3 areas you are most excited about</p>
                <div className="grid grid-cols-2 gap-2">
                  {CAREER_INTERESTS.map(v => {
                    const sel = interests.includes(v);
                    return (
                      <button key={v} onClick={() => toggleInterest(v)}
                        disabled={!sel && interests.length >= 3}
                        className="py-3 px-4 rounded-2xl text-sm font-semibold border-2 transition-all"
                        style={{
                          background: sel ? "linear-gradient(135deg,#7C3AED,#A855F7)" : "white",
                          borderColor: sel ? "transparent" : "#E5DEFF",
                          color: sel ? "white" : "#241C34",
                          fontFamily: "Inter, sans-serif",
                          opacity: !sel && interests.length >= 3 ? 0.38 : 1,
                        }}>
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="pt-4">
                <p className="text-sm mb-4" style={{ color: "#9B8FA8", fontFamily: "Inter, sans-serif" }}>Which milestones are you working toward?</p>
                <div className="space-y-2">
                  {MILESTONES.map(m => {
                    const sel = picked.includes(m.id);
                    return (
                      <button key={m.id} onClick={() => togglePick(m.id)}
                        className="w-full py-3 px-4 rounded-2xl text-sm font-semibold border-2 flex items-center justify-between transition-all"
                        style={{
                          background: sel ? "#F3F0FF" : "white",
                          borderColor: sel ? "#7C3AED" : "#E5DEFF",
                          color: "#241C34",
                          fontFamily: "Inter, sans-serif",
                        }}>
                        {m.title}
                        {sel && <Check size={15} style={{ color: "#7C3AED", flexShrink: 0 }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-6 pb-10 pt-3">
        <button
          onClick={() => step < 3 ? setStep(s => s + 1) : onDone(name, school, email)}
          disabled={!canNext}
          className="w-full py-4 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 transition-all"
          style={{
            background: canNext ? "linear-gradient(135deg,#7C3AED,#EC4899)" : "#E5DEFF",
            color: canNext ? "white" : "#B0A5BE",
            fontFamily: "Sora, sans-serif",
            boxShadow: canNext ? "0 6px 22px rgba(124,58,237,0.32)" : "none",
          }}>
          {step === 3 ? "Let's go →" : <>Continue <ArrowRight size={17} /></>}
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function DashboardScreen({ name }: { name: string }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div>
        <p className="text-sm font-medium" style={{ color: "#9B8FA8", fontFamily: "Inter, sans-serif" }}>{greet} 👋</p>
        <h2 className="text-[1.65rem] font-extrabold mt-0.5" style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>
          {name || "Hey, you"}
        </h2>
      </div>

      {/* Current milestone hero card */}
      <div className="rounded-3xl p-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #7C3AED 0%, #9333EA 60%, #BE185D 100%)" }}>
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-[0.08]"
          style={{ background: "white" }} />
        <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: "#DDD6FE" }}>
          Current Milestone
        </p>
        <h3 className="text-white text-[1.2rem] font-extrabold mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
          Negotiate Your Offer
        </h3>
        <div className="flex items-center gap-4">
          <ProgressRing percent={65} size={86} strokeWidth={7} ringId="dash-hero">
            <span className="font-extrabold text-[1.3rem] text-white">65%</span>
          </ProgressRing>
          <div className="flex-1">
            <p className="text-sm leading-relaxed mb-3" style={{ color: "#DDD6FE", fontFamily: "Inter, sans-serif" }}>
              You are more than halfway there. 3 mentors can guide you through this.
            </p>
            <button className="px-3.5 py-1.5 rounded-full text-xs font-bold"
              style={{ background: "rgba(255,255,255,0.18)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>
              Find a guide →
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { v: "3", l: "Matches", color: "#7C3AED", bg: "#F3F0FF" },
          { v: "1", l: "Chat booked", color: "#EC4899", bg: "#FDF2F8" },
          { v: "2", l: "Badges earned", color: "#10B981", bg: "#ECFDF5" },
        ].map(({ v, l, color, bg }) => (
          <div key={l} className="rounded-2xl p-3.5 flex flex-col items-center text-center" style={{ background: bg }}>
            <div className="text-2xl font-extrabold" style={{ fontFamily: "Sora, sans-serif", color }}>{v}</div>
            <div className="text-[11px] font-medium mt-0.5" style={{ color: "#9B8FA8" }}>{l}</div>
          </div>
        ))}
      </div>

      {/* AI tip */}
      <div className="rounded-3xl p-5" style={{ background: "white", boxShadow: "0 2px 18px rgba(124,58,237,0.09)" }}>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)" }}>
            <Sparkles size={15} className="text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#B0A5BE" }}>AI Tip of the Day</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "#241C34", fontFamily: "Inter, sans-serif" }}>
          <span className="font-semibold" style={{ color: "#7C3AED" }}>Whoever anchors first wins the range.</span> When negotiating, name your number before they do. Research your market rate on Glassdoor and Levels.fyi, then open 15–20% above your target.
        </p>
        <div className="flex items-center gap-2.5 mt-3.5 pt-3.5" style={{ borderTop: "1px solid #F0ECFF" }}>
          <ProgressRing percent={28} size={30} strokeWidth={3} ringId="streak">
            <span style={{ fontSize: 8, fontWeight: 700, color: "#7C3AED" }}>7</span>
          </ProgressRing>
          <span className="text-xs font-medium" style={{ color: "#9B8FA8" }}>7-day learning streak 🔥</span>
        </div>
      </div>

      {/* Overall progress */}
      <div className="rounded-3xl p-5" style={{ background: "white", boxShadow: "0 2px 18px rgba(124,58,237,0.09)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold" style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>Your progress</h3>
          <span className="text-xs font-semibold" style={{ color: "#7C3AED" }}>2 of 11 done</span>
        </div>
        <div className="flex gap-4 items-center justify-around">
          {[
            { label: "Career", done: 1, total: 4, id: "db-c" },
            { label: "Money", done: 1, total: 5, id: "db-m" },
            { label: "Life", done: 0, total: 2, id: "db-l" },
          ].map(({ label, done, total, id }) => (
            <div key={label} className="flex flex-col items-center">
              <ProgressRing percent={Math.round((done / total) * 100)} size={66} strokeWidth={6} ringId={id}>
                <span className="text-xs font-bold" style={{ color: "#241C34" }}>{done}/{total}</span>
              </ProgressRing>
              <span className="text-[11px] font-semibold mt-2" style={{ color: "#9B8FA8" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Milestones ───────────────────────────────────────────────────────────────

function MilestonesScreen() {
  const [expanded, setExpanded] = useState<string | null>("negotiate-offer");
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const tracks: { key: "career" | "money" | "life"; label: string; icon: React.ReactNode }[] = [
    { key: "career", label: "Career", icon: <Briefcase size={15} /> },
    { key: "money", label: "Money", icon: <DollarSign size={15} /> },
    { key: "life", label: "Life", icon: <Target size={15} /> },
  ];

  function send(mid: string, text: string) {
    const aiText = AI_RESPONSES[text] ?? AI_RESPONSES["default"];
    setChats(p => ({
      ...p,
      [mid]: [...(p[mid] ?? []), { role: "user", text }, { role: "ai", text: aiText }],
    }));
    setInputs(p => ({ ...p, [mid]: "" }));
  }

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div>
        <h2 className="text-[1.65rem] font-extrabold" style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>Milestones</h2>
        <p className="text-sm mt-0.5" style={{ color: "#9B8FA8", fontFamily: "Inter, sans-serif" }}>
          Track your journey · Coach chat · Match with guides
        </p>
      </div>

      {/* Track summary rings */}
      <div className="flex gap-3">
        {tracks.map(({ key, label, icon }) => {
          const track = MILESTONES.filter(m => m.track === key);
          const done = track.filter(m => m.status === "completed").length;
          return (
            <div key={key} className="flex-1 rounded-2xl p-3 flex flex-col items-center"
              style={{ background: "white", boxShadow: "0 2px 12px rgba(124,58,237,0.07)" }}>
              <ProgressRing percent={Math.round((done / track.length) * 100)} size={56} strokeWidth={5} ringId={`ms-${key}`}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#7C3AED" }}>{done}/{track.length}</span>
              </ProgressRing>
              <div className="flex items-center gap-1 mt-2">
                <span style={{ color: "#7C3AED" }}>{icon}</span>
                <span className="text-xs font-semibold" style={{ color: "#241C34" }}>{label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Track sections */}
      {tracks.map(({ key, label, icon }) => (
        <div key={key}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "#F3F0FF", color: "#7C3AED" }}>
              {icon}
            </div>
            <h3 className="font-bold" style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>{label} Track</h3>
          </div>

          <div className="space-y-2">
            {MILESTONES.filter(m => m.track === key).map(m => (
              <div key={m.id} className="rounded-2xl overflow-hidden"
                style={{ background: "white", boxShadow: "0 2px 12px rgba(124,58,237,0.07)" }}>
                <button
                  className="w-full px-4 py-3.5 flex items-center gap-3"
                  onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                  <ProgressRing percent={m.progress} size={44} strokeWidth={4} ringId={`mc-${m.id}`}>
                    {m.status === "completed"
                      ? <Check size={12} style={{ color: "#10B981" }} />
                      : <span style={{ fontSize: 9, fontWeight: 700, color: "#7C3AED" }}>{m.progress}%</span>}
                  </ProgressRing>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-bold mb-0.5" style={{ color: "#241C34", fontFamily: "Sora, sans-serif" }}>
                      {m.title}
                    </div>
                    <StatusPill status={m.status} />
                  </div>
                  <ChevronDown size={16} style={{ color: "#C4B5FD", flexShrink: 0, transition: "transform 0.25s", transform: expanded === m.id ? "rotate(180deg)" : "none" }} />
                </button>

                <AnimatePresence>
                  {expanded === m.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                      style={{ overflow: "hidden" }}>
                      <div className="px-4 pb-4" style={{ borderTop: "1px solid #F0ECFF" }}>
                        <p className="text-sm mt-3 mb-4 leading-relaxed"
                          style={{ color: "#6B6280", fontFamily: "Inter, sans-serif" }}>
                          {m.description}
                        </p>

                        {/* AI coach chat */}
                        <div className="rounded-2xl overflow-hidden"
                          style={{ background: "#FAFAFE", border: "1px solid #E5DEFF" }}>
                          <div className="px-3 py-2 flex items-center gap-2" style={{ borderBottom: "1px solid #E5DEFF" }}>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)" }}>
                              <Sparkles size={11} className="text-white" />
                            </div>
                            <span className="text-xs font-bold" style={{ color: "#7C3AED" }}>AI Coach</span>
                          </div>

                          <div className="p-3 max-h-44 overflow-y-auto flex flex-col gap-2">
                            {!(chats[m.id]?.length) && (
                              <p className="text-xs text-center py-2" style={{ color: "#C4B5FD" }}>
                                Ask me anything about this milestone →
                              </p>
                            )}
                            {(chats[m.id] ?? []).map((msg, i) => (
                              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className="max-w-[88%] px-3 py-2 rounded-2xl text-xs leading-relaxed"
                                  style={{
                                    background: msg.role === "user" ? "linear-gradient(135deg,#7C3AED,#A855F7)" : "white",
                                    color: msg.role === "user" ? "white" : "#241C34",
                                    border: msg.role === "ai" ? "1px solid #E5DEFF" : "none",
                                    fontFamily: "Inter, sans-serif",
                                  }}>
                                  {msg.text}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Starter chips */}
                          {!(chats[m.id]?.length) && (
                            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                              {m.starterQuestions.map(q => (
                                <button key={q} onClick={() => send(m.id, q)}
                                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors hover:bg-purple-50"
                                  style={{ border: "1px solid #C4B5FD", color: "#7C3AED", fontFamily: "Inter, sans-serif" }}>
                                  {q}
                                </button>
                              ))}
                            </div>
                          )}

                          <div className="px-3 pb-3 pt-2 flex gap-2" style={{ borderTop: "1px solid #E5DEFF" }}>
                            <input
                              value={inputs[m.id] ?? ""}
                              onChange={e => setInputs(p => ({ ...p, [m.id]: e.target.value }))}
                              onKeyDown={e => { if (e.key === "Enter" && inputs[m.id]?.trim()) send(m.id, inputs[m.id]); }}
                              placeholder="Ask your AI coach..."
                              className="flex-1 text-xs px-3 py-2 rounded-full outline-none"
                              style={{ background: "white", border: "1px solid #E5DEFF", fontFamily: "Inter, sans-serif", color: "#241C34" }}
                            />
                            <button
                              onClick={() => { if (inputs[m.id]?.trim()) send(m.id, inputs[m.id]); }}
                              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)" }}>
                              <Send size={13} className="text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Match ────────────────────────────────────────────────────────────────────

function MatchScreen() {
  const [queue, setQueue] = useState(MENTORS);
  const [exitDir, setExitDir] = useState<"left" | "right" | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [modal, setModal] = useState(false);

  const current = queue[0];

  function swipe(dir: "left" | "right") {
    setExitDir(dir);
    if (dir === "right" && current) setMatched(p => [...p, current.id]);
    setTimeout(() => { setQueue(p => p.slice(1)); setExitDir(null); }, 340);
  }

  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-5">
        <ProgressRing percent={100} size={100} strokeWidth={8} ringId="empty">
          <Heart size={28} fill="#EC4899" style={{ color: "#EC4899" }} />
        </ProgressRing>
        <div>
          <h3 className="text-xl font-extrabold" style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>
            You have seen everyone!
          </h3>
          <p className="text-sm mt-1" style={{ color: "#9B8FA8" }}>
            {matched.length} mentor{matched.length !== 1 ? "s" : ""} matched · check your messages
          </p>
        </div>
        <button onClick={() => { setQueue(MENTORS); setMatched([]); }}
          className="px-6 py-3 rounded-2xl text-white font-semibold text-sm"
          style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)" }}>
          See them again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[1.65rem] font-extrabold" style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>Find a Guide</h2>
          <p className="text-xs mt-0.5" style={{ color: "#9B8FA8" }}>{queue.length} mentors waiting to meet you</p>
        </div>
        {matched.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "#FDF2F8", border: "1px solid #FBCFE8" }}>
            <Heart size={12} fill="#EC4899" style={{ color: "#EC4899" }} />
            <span className="text-xs font-bold" style={{ color: "#BE185D" }}>{matched.length} matched</span>
          </div>
        )}
      </div>

      {/* Card stack */}
      <div className="relative" style={{ height: 478 }}>
        {/* Background depth cards */}
        {queue.slice(1, 3).map((_, i) => (
          <div key={i} className="absolute inset-0 rounded-3xl"
            style={{
              background: "white",
              transform: `scale(${0.93 - i * 0.03}) translateY(${(i + 1) * 13}px)`,
              zIndex: 10 - i,
              boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
            }} />
        ))}

        {/* Active swipe card */}
        <AnimatePresence>
          <motion.div
            key={current.id}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.65}
            onDragEnd={(_, info) => {
              if (info.offset.x > 80) swipe("right");
              else if (info.offset.x < -80) swipe("left");
            }}
            animate={exitDir
              ? { x: exitDir === "right" ? 420 : -420, opacity: 0, rotate: exitDir === "right" ? 16 : -16 }
              : { x: 0, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="absolute inset-0 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
            style={{ zIndex: 20, boxShadow: "0 10px 40px rgba(0,0,0,0.13)", background: "white" }}>

            {/* Photo */}
            <div className="relative overflow-hidden" style={{ height: 240 }}>
              <img
                src={`https://images.unsplash.com/photo-${current.photoId}?w=420&h=280&fit=crop&auto=format`}
                alt={current.name}
                className="w-full h-full object-cover"
                style={{ background: "#E5DEFF" }}
              />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(36,28,52,0.75) 100%)" }} />
              <div className="absolute bottom-3 left-4 right-14">
                <h3 className="text-white text-xl font-extrabold" style={{ fontFamily: "Sora, sans-serif" }}>
                  {current.name}
                </h3>
                <p className="text-purple-200 text-sm font-medium">{current.role} · {current.company}</p>
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-sm"
                style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.25)" }}>
                <GraduationCap size={11} className="text-white" />
                <span className="text-white text-xs font-semibold">{current.school}</span>
              </div>

              {/* Swipe direction labels */}
              <AnimatePresence>
                {exitDir === "right" && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-5 left-5 px-3 py-1 rounded-xl border-2 border-emerald-400"
                    style={{ transform: "rotate(-12deg)" }}>
                    <span className="font-extrabold text-lg text-emerald-400" style={{ fontFamily: "Sora, sans-serif" }}>CONNECT</span>
                  </motion.div>
                )}
                {exitDir === "left" && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-5 right-5 px-3 py-1 rounded-xl border-2 border-red-300"
                    style={{ transform: "rotate(12deg)" }}>
                    <span className="font-extrabold text-lg text-red-400" style={{ fontFamily: "Sora, sans-serif" }}>PASS</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Card body */}
            <div className="p-4 flex flex-col gap-3">
              {/* Match reason */}
              <div className="p-3 rounded-2xl" style={{ background: "#F3F0FF" }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles size={12} style={{ color: "#7C3AED" }} />
                  <span className="text-[11px] font-bold" style={{ color: "#6D28D9" }}>Why you match</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#6B4FA8", fontFamily: "Inter, sans-serif" }}>
                  {current.matchReason}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {current.interests.map(tag => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: "#FDF2F8", color: "#BE185D" }}>
                    {tag}
                  </span>
                ))}
                {current.badges.map(b => (
                  <span key={b} className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: "#ECFDF5", color: "#065F46" }}>
                    ✓ {b}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3">
                <ProgressRing percent={Math.round((current.badges.length / 11) * 100)} size={40} strokeWidth={4} ringId={`mn-${current.id}`}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#7C3AED" }}>{current.badges.length}</span>
                </ProgressRing>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "#241C34" }}>
                    {current.badges.length} guide badges earned
                  </p>
                  <p className="text-xs" style={{ color: "#9B8FA8" }}>
                    {current.chats} coffee chats completed
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-5">
        <button onClick={() => swipe("left")}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-90"
          style={{ background: "white", border: "2px solid #FEE2E2", boxShadow: "0 4px 14px rgba(0,0,0,0.09)" }}>
          <X size={24} style={{ color: "#F87171" }} />
        </button>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-5 py-3.5 rounded-2xl text-white font-bold text-sm transition-transform active:scale-95"
          style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)", fontFamily: "Sora, sans-serif",
            boxShadow: "0 6px 22px rgba(124,58,237,0.38)" }}>
          <Coffee size={17} />
          Book chat
        </button>
        <button onClick={() => swipe("right")}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-90"
          style={{ background: "linear-gradient(135deg,#10B981,#059669)", boxShadow: "0 4px 14px rgba(16,185,129,0.4)" }}>
          <Heart size={24} fill="white" className="text-white" />
        </button>
      </div>
      <p className="text-center text-xs" style={{ color: "#C4B5FD" }}>← swipe to pass · swipe to connect →</p>

      {/* Coffee chat modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-4"
            style={{ background: "rgba(36,28,52,0.55)" }}
            onClick={() => setModal(false)}>
            <motion.div
              initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }} transition={{ type: "spring", damping: 26, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl p-6"
              style={{ background: "#FBF7F2" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0" style={{ background: "#E5DEFF" }}>
                  <img src={`https://images.unsplash.com/photo-${current.photoId}?w=96&h=96&fit=crop&auto=format`}
                    alt={current.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base" style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>
                    Book with {current.name}
                  </h3>
                  <p className="text-xs" style={{ color: "#9B8FA8" }}>30-min coffee chat · Free</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#6B6280", fontFamily: "Inter, sans-serif" }}>
                {current.name} has completed{" "}
                <strong style={{ color: "#7C3AED" }}>{current.completedMilestone}</strong>{" "}
                and loves helping others navigate it. She will confirm within 24 hours.
              </p>
              <p className="text-xs font-semibold mb-2" style={{ color: "#241C34" }}>What do you want to cover?</p>
              <div className="space-y-1.5 mb-5">
                {["Salary negotiation tips", "How to research your market rate", "Negotiating non-salary perks"].map(t => (
                  <label key={t} className="flex items-center gap-2.5 py-2 px-3 rounded-xl cursor-pointer"
                    style={{ background: "white", border: "1.5px solid #E5DEFF" }}>
                    <input type="checkbox" className="accent-purple-600" defaultChecked={t.includes("Salary")} />
                    <span className="text-sm" style={{ color: "#241C34", fontFamily: "Inter, sans-serif" }}>{t}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={() => { swipe("right"); setModal(false); }}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-sm"
                style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)", fontFamily: "Sora, sans-serif",
                  boxShadow: "0 6px 20px rgba(124,58,237,0.32)" }}>
                Send coffee chat request ☕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────

function ProfileScreen({ name, school }: { name: string; school: string }) {
  const done = MILESTONES.filter(m => m.status === "completed");

  return (
    <div className="flex flex-col gap-5 pb-4">
      {/* Avatar + identity */}
      <div className="flex flex-col items-center pt-2">
        <div className="relative mb-3">
          <ProgressRing percent={18} size={100} strokeWidth={6} ringId="prof-ring">
            <div className="w-[68px] h-[68px] rounded-full overflow-hidden flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)", border: "3px solid white",
                boxShadow: "0 0 0 3px #C4B5FD" }}>
              <span className="text-2xl font-extrabold text-white" style={{ fontFamily: "Sora, sans-serif" }}>
                {(name || "Y")[0].toUpperCase()}
              </span>
            </div>
          </ProgressRing>
        </div>
        <h2 className="text-xl font-extrabold" style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>
          {name || "Your name"}
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "#9B8FA8", fontFamily: "Inter, sans-serif" }}>
          {school || "Your school"}
        </p>
        <span className="mt-2 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: "#F3F0FF", color: "#7C3AED" }}>
          Early Career · Product & Finance
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Done", value: "2", icon: <Check size={15} />, color: "#10B981", bg: "#ECFDF5" },
          { label: "Badges", value: "2", icon: <Award size={15} />, color: "#EC4899", bg: "#FDF2F8" },
          { label: "Chats", value: "1", icon: <Coffee size={15} />, color: "#7C3AED", bg: "#F3F0FF" },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} className="rounded-2xl p-3.5 flex flex-col items-center text-center" style={{ background: bg }}>
            <div style={{ color }}>{icon}</div>
            <div className="text-[1.4rem] font-extrabold mt-0.5" style={{ color, fontFamily: "Sora, sans-serif" }}>{value}</div>
            <div className="text-[11px] font-medium" style={{ color: "#9B8FA8" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Guide badges */}
      <div className="rounded-3xl p-5" style={{ background: "white", boxShadow: "0 2px 18px rgba(124,58,237,0.09)" }}>
        <h3 className="font-bold mb-3" style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>Guide badges earned</h3>
        <div className="flex flex-col gap-2">
          {done.map(m => (
            <div key={m.id} className="flex items-center gap-3 p-3 rounded-2xl"
              style={{ background: "#FDF2F8", border: "1px solid #FBCFE8" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#EC4899,#F472B6)" }}>
                <Award size={17} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#241C34", fontFamily: "Sora, sans-serif" }}>
                  Guide: {m.title}
                </p>
                <p className="text-xs" style={{ color: "#BE185D" }}>Discoverable as mentor for this milestone</p>
              </div>
            </div>
          ))}
          {done.length === 0 && (
            <p className="text-sm text-center py-2" style={{ color: "#C4B5FD" }}>
              Complete a milestone to earn your first badge
            </p>
          )}
        </div>
      </div>

      {/* Completed milestones */}
      <div className="rounded-3xl p-5" style={{ background: "white", boxShadow: "0 2px 18px rgba(124,58,237,0.09)" }}>
        <h3 className="font-bold mb-3" style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>Milestones completed</h3>
        <div className="flex flex-col gap-2.5">
          {done.map(m => (
            <div key={m.id} className="flex items-center gap-3">
              <ProgressRing percent={100} size={36} strokeWidth={3} ringId={`pf-${m.id}`}>
                <Check size={11} style={{ color: "#10B981" }} />
              </ProgressRing>
              <span className="text-sm font-medium" style={{ color: "#241C34", fontFamily: "Inter, sans-serif" }}>
                {m.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ask me about */}
      <div className="rounded-3xl p-5" style={{ background: "white", boxShadow: "0 2px 18px rgba(124,58,237,0.09)" }}>
        <h3 className="font-bold mb-3" style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>Ask me about</h3>
        <div className="flex flex-wrap gap-2">
          {["Salary negotiation", "Entry-level job search", "First paycheck basics", "Breaking into tech"].map(tag => (
            <span key={tag} className="px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ background: "#F3F0FF", color: "#7C3AED", border: "1px solid #DDD6FE" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────

function AppShell({ name, school }: { name: string; school: string }) {
  const [tab, setTab] = useState<Tab>("dashboard");

  const tabs: { id: Tab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
    { id: "match", label: "Match", icon: (a) => <Heart size={21} fill={a ? "#7C3AED" : "none"} style={{ color: a ? "#7C3AED" : "#C4B5FD" }} /> },
    { id: "dashboard", label: "Home", icon: (a) => <Home size={21} style={{ color: a ? "#7C3AED" : "#C4B5FD" }} /> },
    { id: "milestones", label: "Milestones", icon: (a) => <BookOpen size={21} style={{ color: a ? "#7C3AED" : "#C4B5FD" }} /> },
    { id: "profile", label: "Profile", icon: (a) => <User size={21} style={{ color: a ? "#7C3AED" : "#C4B5FD" }} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FBF7F2" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)" }}>
            <Heart size={12} fill="white" className="text-white" />
          </div>
          <span className="font-bold" style={{ fontFamily: "Sora, sans-serif", color: "#241C34" }}>MoneyMoves</span>
        </div>
        <button className="relative w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "white", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
          <MessageCircle size={16} style={{ color: "#A78BFA" }} />
          <div className="absolute top-1 right-1 w-2 h-2 rounded-full border border-white"
            style={{ background: "#EC4899" }} />
        </button>
      </div>

      {/* Screen content */}
      <div className="flex-1 overflow-y-auto px-5 pb-24">
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.17 }}>
            {tab === "dashboard" && <DashboardScreen name={name} />}
            {tab === "milestones" && <MilestonesScreen />}
            {tab === "match" && <MatchScreen />}
            {tab === "profile" && <ProfileScreen name={name} school={school} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-around px-2 pt-2 pb-5"
        style={{
          background: "rgba(251,247,242,0.96)",
          backdropFilter: "blur(18px)",
          borderTop: "1px solid rgba(196,181,253,0.28)",
        }}>
        {tabs.map(({ id, label, icon }) => {
          const active = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)}
              className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all"
              style={{ background: active ? "#F3F0FF" : "transparent" }}>
              {icon(active)}
              <span className="text-[10px] font-semibold"
                style={{ color: active ? "#7C3AED" : "#C4B5FD", fontFamily: "Inter, sans-serif" }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [user, setUser] = useState({ name: "", school: "", email: "" });

  return (
    <>
      {screen === "landing" && <LandingScreen onStart={() => setScreen("onboarding")} />}
      {screen === "onboarding" && (
        <OnboardingScreen
          onDone={(n, s, e) => { setUser({ name: n, school: s, email: e }); setScreen("app"); }}
        />
      )}
      {screen === "app" && <AppShell name={user.name} school={user.school} />}
    </>
  );
}
