"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [score]);

  const getScoreColor = () => {
    if (score < 40) return "text-red-500";
    if (score < 70) return "text-amber-500";
    return "text-green-500";
  };

  const getScoreBgColor = () => {
    if (score < 40) return "bg-red-500";
    if (score < 70) return "bg-amber-500";
    return "bg-green-500";
  };

  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r="50"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            className="text-gray-200"
          />
          {/* Animated score circle */}
          <motion.circle
            cx="64"
            cy="64"
            r="50"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={getScoreColor()}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className={`text-3xl font-bold ${getScoreColor()}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            {displayScore}
          </motion.div>
          <div className="text-xs text-gray-500 mt-0.5">Score</div>
        </div>
      </div>
    </div>
  );
}

