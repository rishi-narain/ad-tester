"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";

interface ResultCardProps {
  title: string;
  items: string[];
  type: "strengths" | "weaknesses" | "fixes";
}

export default function ResultCard({ title, items, type }: ResultCardProps) {
  const getIcon = () => {
    switch (type) {
      case "strengths":
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "weaknesses":
        return <XCircle size={16} className="text-red-500" />;
      case "fixes":
        return <Lightbulb size={16} className="text-amber-500" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "strengths":
        return "border-green-200";
      case "weaknesses":
        return "border-red-200";
      case "fixes":
        return "border-amber-200";
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "strengths":
        return "bg-green-50";
      case "weaknesses":
        return "bg-red-50";
      case "fixes":
        return "bg-amber-50";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`border-2 ${getBorderColor()} ${getBgColor()} rounded-lg p-3`}
    >
      <div className="flex items-center gap-2 mb-2">
        {getIcon()}
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-1.5 text-sm text-gray-700"
          >
            <span className="text-gray-400 mt-0.5 text-xs">•</span>
            <span className="leading-tight">{item}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

