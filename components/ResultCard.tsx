"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, ThumbsUp, ThumbsDown } from "lucide-react";

interface ResultCardProps {
  title: string;
  items: string[];
  type: "strengths" | "weaknesses" | "fixes";
  evaluationId?: string;
  personaId?: string;
}

interface VoteState {
  [key: number]: "up" | "down" | null;
}

export default function ResultCard({ title, items, type, evaluationId, personaId }: ResultCardProps) {
  const [votes, setVotes] = useState<VoteState>({});

  const handleVote = async (index: number, voteType: "up" | "down") => {
    const newVote = votes[index] === voteType ? null : voteType;
    
    setVotes((prev) => {
      if (newVote === null) {
        const newVotes = { ...prev };
        delete newVotes[index];
        return newVotes;
      }
      return { ...prev, [index]: voteType };
    });

    // Send feedback to API
    if (newVote !== null) {
      try {
        await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "thumbs",
            page: "results",
            data: {
              category: type,
              item: items[index],
              vote: voteType,
            },
            evaluationId,
            personaId,
          }),
        });
      } catch (error) {
        console.error("Error sending feedback:", error);
      }
    }
  };

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
            className="flex items-start gap-1.5 text-sm text-gray-700 group"
          >
            <span className="text-gray-400 mt-0.5 text-xs">•</span>
            <div className="flex-1">
              <span className="leading-tight">{item}</span>
              <div className="flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleVote(index, "up")}
                  className={`p-1 rounded transition-colors ${
                    votes[index] === "up"
                      ? "bg-green-100 text-green-600"
                      : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                  }`}
                  title="Agree"
                >
                  <ThumbsUp size={14} />
                </button>
                <button
                  onClick={() => handleVote(index, "down")}
                  className={`p-1 rounded transition-colors ${
                    votes[index] === "down"
                      ? "bg-red-100 text-red-600"
                      : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                  }`}
                  title="Disagree"
                >
                  <ThumbsDown size={14} />
                </button>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

