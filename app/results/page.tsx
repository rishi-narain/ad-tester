"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw } from "lucide-react";
import ScoreGauge from "@/components/ScoreGauge";
import ResultCard from "@/components/ResultCard";

interface EvaluationResult {
  resonanceScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestedFixes: string[];
  persona: string;
  personaId: string;
  reverseMode?: boolean;
  bestMatch?: EvaluationResult;
  allResults?: EvaluationResult[];
}

export default function ResultsPage() {
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedResult = sessionStorage.getItem("evaluationResult");
    if (storedResult) {
      try {
        setResult(JSON.parse(storedResult));
      } catch (error) {
        console.error("Error parsing stored result:", error);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  const handleTryAnother = () => {
    sessionStorage.removeItem("evaluationResult");
    router.push("/");
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {result.reverseMode ? "Reverse Audience Evaluation" : "Evaluation Results"}
            </h1>
            <p className="text-gray-600">
              {result.reverseMode ? (
                <>
                  Best match: <span className="font-semibold">{result.persona}</span> persona
                </>
              ) : (
                <>
                  Analysis for <span className="font-semibold">{result.persona}</span>{" "}
                  persona
                </>
              )}
            </p>
          </div>
        </motion.div>

        {/* Score Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-8 mb-8 border border-gray-200 flex justify-center"
        >
          <ScoreGauge score={result.resonanceScore} />
        </motion.div>

        {/* All Personas Comparison (Reverse Mode Only) */}
        {result.reverseMode && result.allResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-8 border border-gray-200"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              All Persona Scores
            </h2>
            <div className="space-y-3">
              {result.allResults
                .sort((a, b) => b.resonanceScore - a.resonanceScore)
                .map((personaResult, index) => (
                  <div
                    key={personaResult.personaId}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      personaResult.personaId === result.personaId
                        ? "border-cyan-500 bg-cyan-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {personaResult.personaId === result.personaId && (
                          <span className="text-cyan-600 font-bold">🏆</span>
                        )}
                        <span className="font-semibold text-gray-900">
                          {personaResult.persona}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              personaResult.personaId === result.personaId
                                ? "bg-gradient-to-r from-cyan-500 to-indigo-500"
                                : "bg-gray-400"
                            }`}
                            style={{ width: `${personaResult.resonanceScore}%` }}
                          />
                        </div>
                        <span
                          className={`font-bold text-lg min-w-[3rem] text-right ${
                            personaResult.personaId === result.personaId
                              ? "text-cyan-600"
                              : "text-gray-700"
                          }`}
                        >
                          {personaResult.resonanceScore}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Results Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <ResultCard
            title="Top Strengths"
            items={result.strengths}
            type="strengths"
          />
          <ResultCard
            title="Top Weaknesses"
            items={result.weaknesses}
            type="weaknesses"
          />
          <ResultCard
            title="Suggested Fixes"
            items={result.suggestedFixes}
            type="fixes"
          />
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <button
            onClick={handleTryAnother}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition-all hover:scale-105"
          >
            <RefreshCw size={20} />
            Try Another Ad
          </button>
        </motion.div>
      </div>
    </div>
  );
}

