"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FlaskConical, ChevronRight, Sparkles } from "lucide-react";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (answers: any[]) => void;
}

interface Question {
  id: string;
  question: string;
  options: { id: string; text: string }[];
}

const defaultQuestions: Question[] = [
  {
    id: "energy",
    question: "When are you most productive?",
    options: [
      { id: "a", text: "Late night - code runs better when the world sleeps" },
      { id: "b", text: "Early morning - 5 AM is my peak time" },
      { id: "c", text: "Whenever inspiration hits - I'm flexible" },
    ],
  },
  {
    id: "social",
    question: "Your ideal social setup?",
    options: [
      { id: "a", text: "House party with 50+ people - more the merrier" },
      { id: "b", text: "One-on-one deep conversation" },
      { id: "c", text: "Small group of 4-5 close friends" },
    ],
  },
  {
    id: "decision",
    question: "How do you make decisions?",
    options: [
      { id: "a", text: "Go with the flow - plans are suggestions" },
      { id: "b", text: "Research everything - informed decisions only" },
      { id: "c", text: "Trust my gut and decide fast" },
    ],
  },
  {
    id: "depth",
    question: "Conversation style?",
    options: [
      { id: "a", text: "Keep it light - surface level is fine" },
      { id: "b", text: "I love deep talks about anything and everything" },
      { id: "c", text: "Depends on the person and mood" },
    ],
  },
  {
    id: "risk",
    question: "Your approach to new experiences?",
    options: [
      { id: "a", text: "Adventurous - try everything once" },
      { id: "b", text: "Calculated risks only - need to plan" },
      { id: "c", text: "Depends on my mood and the stakes" },
    ],
  },
];

export default function VibeQuizModal({ isOpen, onClose, onComplete }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ question_id: string; answer: string }[]>([]);
  const [showIntro, setShowIntro] = useState(true);

  const handleAnswer = (answerId: string) => {
    const newAnswers = [
      ...answers,
      { question_id: defaultQuestions[currentQuestion].id, answer: answerId },
    ];
    setAnswers(newAnswers);

    if (currentQuestion < defaultQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(newAnswers);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-white dark:bg-[#1C1C1E] rounded-[40px] p-6 sm:p-8 shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-6 h-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
        </button>

        <AnimatePresence mode="wait">
          {showIntro ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
                <FlaskConical className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">Vibe Check Quiz</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg sm:text-xl">
                Discover your inner archetype. Your answers will refine your matches using ML.
              </p>

              <div className="bg-blue-500/10 rounded-2xl p-5 mb-8">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Takes ~30 seconds • Changes how we match you
                </p>
              </div>

              <button
                onClick={() => setShowIntro(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 sm:py-5 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-blue-500/40"
              >
                Start Quiz <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                Question {currentQuestion + 1} of {defaultQuestions.length}
              </div>

              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-8">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / defaultQuestions.length) * 100}%` }}
                />
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold mb-8">
                {defaultQuestions[currentQuestion].question}
              </h3>

              <div className="space-y-3">
                {defaultQuestions[currentQuestion].options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAnswer(option.id)}
                    className="w-full text-left p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#2C2C2E] border border-black/10 dark:border-white/20 hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 hover:scale-[1.01]"
                  >
                    <span className="text-base">{option.text}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
