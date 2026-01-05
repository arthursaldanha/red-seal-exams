"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ChevronRight, Clock, Trophy, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  trades,
  fadeIn,
  staggerContainer,
} from "@/app/(root)/constants/landing";
import {
  heroQuestions,
  tradeDisplayNames,
  type TradeKey,
  type HeroQuestion,
} from "@/app/(root)/constants/hero-questions";

// Map trade names to keys
const tradeNameToKey: Record<string, TradeKey> = {
  Electrician: "electrician",
  Plumber: "plumber",
  Carpenter: "carpenter",
  Welder: "welder",
  "Heavy Duty": "heavyDuty",
};

// Generate random time in seconds between 45:00 and 02:30:00
function generateRandomSeconds(): number {
  const minSeconds = 45 * 60; // 45 minutes
  const maxSeconds = 2 * 60 * 60 + 30 * 60; // 2 hours 30 minutes
  return Math.floor(Math.random() * (maxSeconds - minSeconds)) + minSeconds;
}

// Format seconds to HH:MM:SS
function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function Hero() {
  const [selectedTrade, setSelectedTrade] = useState<TradeKey>("electrician");

  const handleTradeSelect = (tradeName: string) => {
    const key = tradeNameToKey[tradeName];
    if (key) {
      setSelectedTrade(key);
    }
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-14 md:pt-40">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:14px_24px]" />
      <div className="from-primary/5 absolute top-0 right-0 left-0 -z-10 h-[500px] bg-linear-to-b to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left"
          >
            <motion.div
              variants={fadeIn}
              className="border-primary/20 bg-primary/5 text-primary mb-6 inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium"
            >
              <span className="bg-primary mr-2 flex h-2 w-2 animate-pulse rounded-full" />
              Updated for 2026 Exam Standards
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="mb-6 text-4xl leading-[1.15] font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-6xl dark:text-white"
            >
              Pass Your{" "}
              <span className="text-primary relative inline-block">
                Red Seal
                <svg
                  className="text-primary/20 absolute -bottom-1 left-0 h-3 w-full"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                  />
                </svg>
              </span>{" "}
              Exam <br /> on the First Try
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg leading-relaxed md:text-xl lg:mx-0"
            >
              Master your trade with comprehensive practice questions, detailed
              explanations, and smart progress tracking. Join thousands of
              tradespeople who certified with confidence.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
            >
              <Button
                asChild
                size="lg"
                className="shadow-primary/20 hover:shadow-primary/30 h-12 px-8 text-base font-semibold shadow-xl transition-all"
              >
                <Link href="/sign-up">
                  Start Free Trial
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base font-medium"
              >
                <Link href="#pricing">View Plans</Link>
              </Button>
            </motion.div>

            <motion.p
              variants={fadeIn}
              className="text-muted-foreground mt-4 flex items-center justify-center gap-2 text-sm lg:justify-start"
            >
              <CheckCircle className="text-accent h-4 w-4" /> No credit card
              required for trial
            </motion.p>
          </motion.div>

          <HeroVisual
            key={selectedTrade}
            selectedTrade={selectedTrade}
            questions={heroQuestions[selectedTrade]}
          />
        </div>

        <TradesSection
          selectedTrade={selectedTrade}
          onTradeSelect={handleTradeSelect}
        />
      </div>
    </section>
  );
}

interface HeroVisualProps {
  selectedTrade: TradeKey;
  questions: HeroQuestion[];
}

function HeroVisual({ selectedTrade, questions }: HeroVisualProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<
    "correct" | "incorrect" | null
  >(null);
  const [streak, setStreak] = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(7200); // Default 2h for SSR
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and run countdown timer (client-side only to avoid hydration mismatch)
  useEffect(() => {
    // Set initial random time on client - this is intentional to avoid SSR mismatch
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeRemaining(generateRandomSeconds());

    // Start countdown
    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Reset to new random time when reaching 0
          return generateRandomSeconds();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const displayTime = formatTime(timeRemaining);

  const currentQuestion = questions[currentQuestionIndex];
  const tradeName = tradeDisplayNames[selectedTrade];

  const handleAnswerClick = useCallback(
    (option: string) => {
      if (selectedAnswer || isTransitioning) return;

      setSelectedAnswer(option);
      const isCorrect = option === currentQuestion.correctAnswer;
      setAnswerState(isCorrect ? "correct" : "incorrect");

      const newStreak = isCorrect ? streak + 1 : 0;
      setStreak(newStreak);

      // Show streak badge if 5 correct answers
      if (newStreak === 5) {
        setShowStreak(true);
      }

      // Transition to next question after 1 second
      setIsTransitioning(true);
      setTimeout(() => {
        const nextIndex = (currentQuestionIndex + 1) % questions.length;

        // Reset streak display when starting over
        if (nextIndex === 0) {
          setShowStreak(false);
          setStreak(0);
        }

        setCurrentQuestionIndex(nextIndex);
        setSelectedAnswer(null);
        setAnswerState(null);
        setIsTransitioning(false);
      }, 1000);
    },
    [
      selectedAnswer,
      isTransitioning,
      currentQuestion.correctAnswer,
      streak,
      currentQuestionIndex,
      questions.length,
    ]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative mx-auto w-full max-w-[600px] lg:mr-0 lg:max-w-full"
    >
      <div className="border-border bg-background relative overflow-hidden rounded-2xl border p-1 shadow-2xl">
        {/* Browser Header */}
        <div className="border-border flex items-center justify-between rounded-t-xl border-b bg-slate-50 p-3 dark:bg-slate-900/50">
          <div className="flex space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-400/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
            <div className="h-3 w-3 rounded-full bg-green-400/80" />
          </div>
          <div className="border-border/50 bg-background text-muted-foreground flex items-center space-x-2 rounded-full border px-3 py-1 text-xs font-medium shadow-sm">
            <Clock className="h-3 w-3" />
            <span suppressHydrationWarning>Time Remaining: {displayTime}</span>
          </div>
          <div className="w-4" />
        </div>

        {/* Question Interface */}
        <div className="bg-background p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-primary text-xs font-bold tracking-wider uppercase">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <motion.div
              key={tradeName}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-muted-foreground text-xs font-bold"
            >
              {tradeName}
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.h3
              key={`question-${selectedTrade}-${currentQuestionIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-foreground mb-6 text-lg leading-snug font-bold md:text-xl"
            >
              {currentQuestion.question}
            </motion.h3>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`options-${selectedTrade}-${currentQuestionIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {(["A", "B", "C", "D"] as const).map((option) => (
                <QuestionOption
                  key={option}
                  label={option}
                  text={currentQuestion.options[option]}
                  isSelected={selectedAnswer === option}
                  isCorrect={
                    selectedAnswer === option ? answerState === "correct" : null
                  }
                  isDisabled={!!selectedAnswer}
                  onClick={() => handleAnswerClick(option)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="mt-8 flex items-center justify-between">
            <div className="mr-4 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <motion.div
                className="bg-primary h-full rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <Button size="sm" disabled>
              Next Question
            </Button>
          </div>
        </div>

        {/* Streak Badge */}
        <AnimatePresence>
          {showStreak && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring" }}
              className="absolute top-1/2 right-8 z-10 flex -translate-y-full items-center gap-3 rounded-xl border border-green-100 bg-white p-4 shadow-xl dark:border-green-900/30 dark:bg-slate-800"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-wider text-green-600 uppercase dark:text-green-400">
                  Perfect!
                </p>
                <p className="text-foreground text-sm font-bold">5 in a row!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative background */}
      <div className="absolute -inset-4 -z-10 rounded-4xl bg-linear-to-tr from-blue-500/20 to-purple-500/20 opacity-70 blur-3xl" />
    </motion.div>
  );
}

interface QuestionOptionProps {
  label: string;
  text: string;
  isSelected: boolean;
  isCorrect: boolean | null;
  isDisabled: boolean;
  onClick: () => void;
}

function QuestionOption({
  label,
  text,
  isSelected,
  isCorrect,
  isDisabled,
  onClick,
}: QuestionOptionProps) {
  const getBorderClass = () => {
    if (!isSelected)
      return "border-border hover:bg-slate-50 dark:hover:bg-slate-800/50";
    if (isCorrect === true)
      return "border-green-500 bg-green-50 dark:bg-green-900/20";
    if (isCorrect === false)
      return "border-red-500 bg-red-50 dark:bg-red-900/20";
    return "border-primary bg-primary/5";
  };

  const getLabelClass = () => {
    if (!isSelected) return "border-muted-foreground/30 text-muted-foreground";
    if (isCorrect === true) return "bg-green-500 text-white border-green-500";
    if (isCorrect === false) return "bg-red-500 text-white border-red-500";
    return "bg-primary text-primary-foreground";
  };

  const getIcon = () => {
    if (!isSelected) return null;
    if (isCorrect === true)
      return <CheckCircle className="ml-auto h-5 w-5 text-green-500" />;
    if (isCorrect === false)
      return <X className="ml-auto h-5 w-5 text-red-500" />;
    return null;
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.01 } : undefined}
      whileTap={!isDisabled ? { scale: 0.99 } : undefined}
      className={cn(
        "flex w-full cursor-pointer items-center rounded-lg border-2 p-4 text-left transition-all",
        getBorderClass(),
        isDisabled && !isSelected && "cursor-not-allowed opacity-50"
      )}
    >
      <div
        className={cn(
          "mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors",
          getLabelClass()
        )}
      >
        {label}
      </div>
      <span
        className={cn(
          "font-medium",
          isSelected ? "text-foreground" : "text-foreground/80"
        )}
      >
        {text}
      </span>
      {getIcon()}
    </motion.button>
  );
}

interface TradesSectionProps {
  selectedTrade: TradeKey;
  onTradeSelect: (tradeName: string) => void;
}

function TradesSection({ selectedTrade, onTradeSelect }: TradesSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
      className="border-border mt-20 border-t pt-10 text-center"
    >
      <p className="text-muted-foreground mb-8 text-sm font-bold tracking-wider uppercase">
        Perfect for Apprentices in
      </p>
      <div className="flex flex-wrap justify-center gap-8 md:gap-12">
        {trades.map((trade, i) => {
          const tradeKey = tradeNameToKey[trade.name];
          const isActive = tradeKey === selectedTrade;

          return (
            <button
              key={i}
              onClick={() => onTradeSelect(trade.name)}
              className="group flex cursor-pointer flex-col items-center"
            >
              <div
                className={cn(
                  "mb-3 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:-translate-y-1",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-primary/30 shadow-lg"
                    : "text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary bg-slate-50 dark:bg-slate-800"
                )}
              >
                <trade.icon className="h-6 w-6" />
              </div>
              <span
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {trade.name}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
