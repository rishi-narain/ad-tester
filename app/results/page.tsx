"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Link2, FileDown, TrendingUp, MessageSquare } from "lucide-react";
import ScoreGauge from "@/components/ScoreGauge";
import ResultCard from "@/components/ResultCard";
import FeedbackModal from "@/components/FeedbackModal";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface EvaluationResult {
  resonanceScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestedFixes: string[];
  quote: string;
  persona: string;
  personaId: string;
  reverseMode?: boolean;
  bestMatch?: EvaluationResult;
  allResults?: EvaluationResult[];
}

export default function ResultsPage() {
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const router = useRouter();
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for shared data in URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get("data");
    
    if (sharedData) {
      try {
        const decodedResult = JSON.parse(decodeURIComponent(sharedData));
        setResult(decodedResult);
        // Also store in sessionStorage for consistency
        sessionStorage.setItem("evaluationResult", JSON.stringify(decodedResult));
        // Clean up URL
        window.history.replaceState({}, "", window.location.pathname);
        return;
      } catch (error) {
        console.error("Error parsing shared data:", error);
      }
    }

    // Fallback to sessionStorage
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

  const handleShareLink = async () => {
    if (!result) return;

    try {
      setIsSharing(true);
      // Encode the result data in the URL
      const encodedData = encodeURIComponent(JSON.stringify(result));
      const shareUrl = `${window.location.origin}/results?data=${encodedData}`;

      // Try using Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: `Ad Evaluation Results - ${result.persona}`,
          text: `Check out these ad evaluation results for ${result.persona} persona. Resonance Score: ${result.resonanceScore}/100`,
          url: shareUrl,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert("Share link copied to clipboard!");
      }
    } catch (error: any) {
      // User cancelled share or clipboard failed, try fallback
      if (error.name !== "AbortError") {
        const encodedData = encodeURIComponent(JSON.stringify(result));
        const shareUrl = `${window.location.origin}/results?data=${encodedData}`;
        await navigator.clipboard.writeText(shareUrl);
        alert("Share link copied to clipboard!");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!result || !resultsRef.current) return;

    try {
      setIsGeneratingPDF(true);
      const element = resultsRef.current;
      
      // Create a canvas from the results content
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions to fit the page
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const imgScaledWidth = imgWidth * ratio;
      const imgScaledHeight = imgHeight * ratio;
      
      let heightLeft = imgScaledHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgScaledWidth, imgScaledHeight);
      heightLeft -= pdfHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgScaledHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgScaledWidth, imgScaledHeight);
        heightLeft -= pdfHeight;
      }

      // Generate filename
      const personaSlug = result.persona.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const filename = `ad-evaluation-${personaSlug}-${result.resonanceScore}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
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
      <div ref={resultsRef} className="container mx-auto px-4 py-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-lg shadow-md p-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  {result.reverseMode ? "Reverse Audience Evaluation" : "Evaluation Results"}
                </h1>
                <p className="text-sm text-gray-600">
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
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareLink}
                  disabled={isSharing}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-indigo-600 text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSharing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Link2 size={14} />
                      Share Link
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-cyan-600 text-cyan-600 rounded-md text-sm font-medium hover:bg-cyan-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingPDF ? (
                    <>
                      <div className="w-4 h-4 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileDown size={14} />
                      PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Score Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-lg rounded-lg shadow-md p-4 mb-3 border border-gray-200"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <ScoreGauge score={result.resonanceScore} />
            <div className="flex-1 max-w-md">
              <p className="text-base text-gray-700 italic leading-relaxed mb-2">
                "{result.quote}"
              </p>
              <p className="text-sm text-gray-500 text-right">
                -- Synthetic Respondent
              </p>
            </div>
          </div>
        </motion.div>

        {/* All Personas Comparison (Reverse Mode Only) */}
        {result.reverseMode && result.allResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-lg rounded-lg shadow-md p-3 mb-3 border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              All Persona Scores
            </h2>
            <div className="space-y-1.5">
              {result.allResults
                .sort((a, b) => b.resonanceScore - a.resonanceScore)
                .map((personaResult, index) => (
                  <div
                    key={personaResult.personaId}
                    className={`p-2 rounded-md border transition-all ${
                      personaResult.personaId === result.personaId
                        ? "border-cyan-500 bg-cyan-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {personaResult.personaId === result.personaId && (
                          <span className="text-cyan-600 font-bold text-sm">🏆</span>
                        )}
                        <span className="font-medium text-sm text-gray-900">
                          {personaResult.persona}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
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
                          className={`font-bold text-sm min-w-[2.5rem] text-right ${
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
        <div className="grid md:grid-cols-3 gap-3 mb-3">
          <ResultCard
            title="Top Strengths"
            items={result.strengths}
            type="strengths"
            evaluationId={`eval_${result.personaId}_${result.resonanceScore}`}
            personaId={result.personaId}
          />
          <ResultCard
            title="Top Weaknesses"
            items={result.weaknesses}
            type="weaknesses"
            evaluationId={`eval_${result.personaId}_${result.resonanceScore}`}
            personaId={result.personaId}
          />
          <ResultCard
            title="Suggested Fixes"
            items={result.suggestedFixes}
            type="fixes"
            evaluationId={`eval_${result.personaId}_${result.resonanceScore}`}
            personaId={result.personaId}
          />
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleTryAnother}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-md text-sm font-medium hover:shadow-md transition-all hover:scale-105"
            >
              <RefreshCw size={14} />
              Test Another Concept
            </button>
            <button
              onClick={() => router.push("/insights")}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white border border-indigo-600 text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-50 transition-all hover:scale-105"
            >
              <TrendingUp size={14} />
              Dive Deeper
            </button>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white border border-gray-600 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-50 transition-all hover:scale-105"
            >
              <MessageSquare size={14} />
              Feedback
            </button>
          </div>
        </motion.div>

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <FeedbackModal
            onClose={() => {
              setShowFeedbackModal(false);
              setFeedbackText("");
              setFeedbackEmail("");
            }}
            onSubmit={async (feedback: string, email: string) => {
              setIsSubmittingFeedback(true);
              try {
                await fetch("/api/feedback", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    type: "written",
                    page: "results",
                    data: {
                      feedback,
                      email,
                    },
                    evaluationId: `eval_${result?.personaId}_${result?.resonanceScore}`,
                    personaId: result?.personaId,
                  }),
                });
                setShowFeedbackModal(false);
                setFeedbackText("");
                setFeedbackEmail("");
                alert("Thank you for your feedback!");
              } catch (error) {
                console.error("Error submitting feedback:", error);
                alert("Failed to submit feedback. Please try again.");
              } finally {
                setIsSubmittingFeedback(false);
              }
            }}
            isSubmitting={isSubmittingFeedback}
          />
        )}
      </div>
    </div>
  );
}

