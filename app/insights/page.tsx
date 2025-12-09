"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Unlock, Info, Link2, FileDown, RefreshCw, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
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

const INSIGHT_CATEGORIES = [
  "Predicted Ad Performance & ROI",
  "Audience Segment Breakdown",
  "Message Clarity & Resonance Map",
  "Creative Element Impact Analysis",
  "Emotional & Sentiment Analysis",
  "Attention & First-Impression Pathway",
  "Top Predicted Objections & Risks",
  "Actionable Improvement Recommendations",
  "Learning Loop / Multi-Ad Patterns",
];

export default function InsightsPage() {
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [insightVotes, setInsightVotes] = useState<{ [key: string]: "up" | "down" | null }>({});
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const router = useRouter();
  const insightsRef = useRef<HTMLDivElement>(null);

  const handleInsightVote = async (category: string, voteType: "up" | "down") => {
    const newVote = insightVotes[category] === voteType ? null : voteType;
    
    setInsightVotes((prev) => {
      if (newVote === null) {
        const newVotes = { ...prev };
        delete newVotes[category];
        return newVotes;
      }
      return { ...prev, [category]: voteType };
    });

    // Send feedback to API
    if (newVote !== null && result) {
      try {
        await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "thumbs",
            page: "insights",
            data: {
              category,
              vote: voteType,
            },
            evaluationId: `eval_${result.personaId}_${result.resonanceScore}`,
            personaId: result.personaId,
          }),
        });
      } catch (error) {
        console.error("Error sending feedback:", error);
      }
    }
  };

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
        
        // Check if insights are unlocked
        const unlockKey = `insights_unlocked_${decodedResult.personaId}_${decodedResult.resonanceScore}`;
        const unlocked = localStorage.getItem(unlockKey) === "true";
        setIsUnlocked(unlocked);
        return;
      } catch (error) {
        console.error("Error parsing shared data:", error);
      }
    }

    // Fallback to sessionStorage
    const storedResult = sessionStorage.getItem("evaluationResult");
    if (storedResult) {
      try {
        const parsedResult = JSON.parse(storedResult);
        setResult(parsedResult);
        
        // Check if insights are unlocked (using localStorage for persistence)
        const unlockKey = `insights_unlocked_${parsedResult.personaId}_${parsedResult.resonanceScore}`;
        const unlocked = localStorage.getItem(unlockKey) === "true";
        setIsUnlocked(unlocked);
      } catch (error) {
        console.error("Error parsing stored result:", error);
        router.push("/results");
      }
    } else {
      router.push("/results");
    }
  }, [router]);

  const handleUnlockOneTime = async () => {
    router.push("/payment?type=purchase");
  };

  const handleSubscribe = async () => {
    router.push("/payment?type=subscribe");
  };

  const handleShareLink = async () => {
    if (!result) return;

    try {
      setIsSharing(true);
      // Encode the result data in the URL
      const encodedData = encodeURIComponent(JSON.stringify(result));
      const shareUrl = `${window.location.origin}/insights?data=${encodedData}`;

      // Try using Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: `Advanced Insights - ${result.persona}`,
          text: `Check out these advanced insights for ${result.persona} persona. Resonance Score: ${result.resonanceScore}/100`,
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
        const shareUrl = `${window.location.origin}/insights?data=${encodedData}`;
        await navigator.clipboard.writeText(shareUrl);
        alert("Share link copied to clipboard!");
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!result || !insightsRef.current) return;

    try {
      setIsGeneratingPDF(true);
      const element = insightsRef.current;
      
      // Create a canvas from the insights content
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
      const filename = `advanced-insights-${personaSlug}-${result.resonanceScore}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleTryAnother = () => {
    sessionStorage.removeItem("evaluationResult");
    router.push("/");
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div ref={insightsRef} className="container mx-auto px-4 py-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => router.push("/results")}
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              <span>Back to Results</span>
            </button>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-lg shadow-md p-3 border border-gray-200 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Advanced Insights {isUnlocked ? "" : "(Preview)"}
                </h1>
                <p className="text-xs text-gray-600 mt-0.5">
                  {result.persona} persona
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShareLink}
                    disabled={!isUnlocked || isSharing}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      isUnlocked
                        ? "bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                        : "bg-white border border-gray-300 text-gray-400 cursor-not-allowed"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                    disabled={!isUnlocked || isGeneratingPDF}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      isUnlocked
                        ? "bg-white border border-cyan-600 text-cyan-600 hover:bg-cyan-50"
                        : "bg-white border border-gray-300 text-gray-400 cursor-not-allowed"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
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
                {isUnlocked ? (
                  <div className="flex items-center gap-1.5 text-green-600 text-xs">
                    <Unlock size={14} />
                    <span className="font-medium">Unlocked</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleUnlockOneTime}
                      className="text-xs text-gray-700 hover:text-gray-900 px-3 py-1.5 border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
                    >
                      Purchase $1.99
                    </button>
                    <div className="relative flex items-center gap-1">
                      <button
                        onClick={handleSubscribe}
                        className="text-xs text-white bg-gray-900 hover:bg-gray-800 px-3 py-1.5 rounded-md transition-colors"
                      >
                        Subscribe $19.99/mo
                      </button>
                      <div
                        className="relative"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        <Info size={14} className="text-gray-400 hover:text-gray-600 cursor-help" />
                        {showTooltip && (
                          <div className="absolute right-0 top-6 w-48 bg-gray-900 text-white text-xs rounded-md p-2 shadow-lg z-10">
                            Unlimited testing and reports
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Insights Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {INSIGHT_CATEGORIES.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/80 backdrop-blur-lg rounded-lg shadow-md border border-gray-200 p-4 h-full flex flex-col group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {category}
                  </h3>
                  {isUnlocked && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleInsightVote(category, "up")}
                        className={`p-1 rounded transition-colors ${
                          insightVotes[category] === "up"
                            ? "bg-green-100 text-green-600"
                            : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                        }`}
                        title="Agree"
                      >
                        <ThumbsUp size={14} />
                      </button>
                      <button
                        onClick={() => handleInsightVote(category, "down")}
                        className={`p-1 rounded transition-colors ${
                          insightVotes[category] === "down"
                            ? "bg-red-100 text-red-600"
                            : "text-gray-400 hover:text-red-600 hover:bg-red-50"
                        }`}
                        title="Disagree"
                      >
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="relative flex-1 min-h-[140px]">
                  {!isUnlocked ? (
                    <>
                      <div className="blur-[3px] select-none pointer-events-none opacity-50">
                        {/* Chart/Graph Visualizations */}
                        {category === "Predicted Ad Performance & ROI" && (
                          <div className="space-y-2">
                            <div className="relative w-full h-16">
                              <svg viewBox="0 0 100 60" className="w-full h-full">
                                <rect x="10" y="40" width="15" height="20" fill="#10b981" opacity="0.6" />
                                <rect x="30" y="30" width="15" height="30" fill="#10b981" opacity="0.7" />
                                <rect x="50" y="20" width="15" height="40" fill="#10b981" opacity="0.8" />
                                <rect x="70" y="15" width="15" height="45" fill="#10b981" opacity="0.9" />
                                <text x="50" y="55" textAnchor="middle" fontSize="10" fill="#059669" fontWeight="bold">ROI</text>
                              </svg>
                            </div>
                            <div className="space-y-1">
                              <div className="h-2 bg-gray-300 rounded w-full"></div>
                              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                            </div>
                          </div>
                        )}
                        {category === "Audience Segment Breakdown" && (
                          <div className="space-y-2">
                            <svg viewBox="0 0 100 100" className="w-full h-20">
                              <circle cx="50" cy="50" r="35" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray="110 220" transform="rotate(-90 50 50)" />
                              <circle cx="50" cy="50" r="35" fill="none" stroke="#8b5cf6" strokeWidth="8" strokeDasharray="70 220" transform="rotate(20 50 50)" />
                              <circle cx="50" cy="50" r="35" fill="none" stroke="#ec4899" strokeWidth="8" strokeDasharray="40 220" transform="rotate(90 50 50)" />
                            </svg>
                            <div className="space-y-1">
                              <div className="h-2 bg-gray-300 rounded w-full"></div>
                              <div className="h-2 bg-gray-300 rounded w-2/3"></div>
                            </div>
                          </div>
                        )}
                        {category === "Message Clarity & Resonance Map" && (
                          <div className="space-y-2">
                            <div className="grid grid-cols-4 gap-1 h-16">
                              {[...Array(12)].map((_, i) => (
                                <div key={i} className={`rounded ${
                                  i % 4 === 0 ? 'bg-green-500' : 
                                  i % 4 === 1 ? 'bg-green-400' : 
                                  i % 4 === 2 ? 'bg-green-300' : 'bg-green-200'
                                }`} style={{ opacity: 0.6 + (i % 4) * 0.1 }}></div>
                              ))}
                            </div>
                            <div className="space-y-1">
                              <div className="h-2 bg-gray-300 rounded w-full"></div>
                              <div className="h-2 bg-gray-300 rounded w-4/5"></div>
                            </div>
                          </div>
                        )}
                        {category === "Creative Element Impact Analysis" && (
                          <div className="space-y-2">
                            <div className="flex items-end gap-1.5 h-16">
                              <div className="flex-1 bg-purple-500 rounded-t" style={{ height: '35%' }}></div>
                              <div className="flex-1 bg-purple-600 rounded-t" style={{ height: '55%' }}></div>
                              <div className="flex-1 bg-purple-700 rounded-t" style={{ height: '75%' }}></div>
                              <div className="flex-1 bg-purple-600 rounded-t" style={{ height: '60%' }}></div>
                              <div className="flex-1 bg-purple-500 rounded-t" style={{ height: '45%' }}></div>
                            </div>
                            <div className="space-y-1">
                              <div className="h-2 bg-gray-300 rounded w-full"></div>
                              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                            </div>
                          </div>
                        )}
                        {category === "Emotional & Sentiment Analysis" && (
                          <div className="space-y-2">
                            <svg viewBox="0 0 100 100" className="w-full h-20">
                              <circle cx="50" cy="50" r="30" fill="none" stroke="#f59e0b" strokeWidth="3" />
                              <circle cx="35" cy="40" r="8" fill="#f59e0b" opacity="0.6" />
                              <circle cx="50" cy="35" r="10" fill="#f59e0b" opacity="0.7" />
                              <circle cx="65" cy="40" r="8" fill="#f59e0b" opacity="0.6" />
                              <path d="M 40 55 Q 50 60 60 55" stroke="#f59e0b" strokeWidth="2" fill="none" />
                            </svg>
                            <div className="space-y-1">
                              <div className="h-2 bg-gray-300 rounded w-full"></div>
                              <div className="h-2 bg-gray-300 rounded w-2/3"></div>
                            </div>
                          </div>
                        )}
                        {category === "Attention & First-Impression Pathway" && (
                          <div className="space-y-2">
                            <svg viewBox="0 0 100 60" className="w-full h-16">
                              <circle cx="15" cy="30" r="4" fill="#3b82f6" />
                              <path d="M 15 30 Q 30 15, 45 20 T 75 25" stroke="#3b82f6" strokeWidth="2" fill="none" />
                              <circle cx="45" cy="20" r="3" fill="#3b82f6" />
                              <circle cx="75" cy="25" r="3" fill="#3b82f6" />
                              <path d="M 75 25 L 85 30 L 75 35" stroke="#3b82f6" strokeWidth="2" fill="none" />
                            </svg>
                            <div className="space-y-1">
                              <div className="h-2 bg-gray-300 rounded w-full"></div>
                              <div className="h-2 bg-gray-300 rounded w-4/5"></div>
                            </div>
                          </div>
                        )}
                        {category === "Top Predicted Objections & Risks" && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              </div>
                              <div className="h-3 bg-gray-300 rounded flex-1"></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              </div>
                              <div className="h-3 bg-gray-300 rounded flex-1"></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              </div>
                              <div className="h-3 bg-gray-300 rounded flex-1"></div>
                            </div>
                          </div>
                        )}
                        {category === "Actionable Improvement Recommendations" && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">1</div>
                              <div className="h-3 bg-gray-300 rounded flex-1"></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">2</div>
                              <div className="h-3 bg-gray-300 rounded flex-1"></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">3</div>
                              <div className="h-3 bg-gray-300 rounded flex-1"></div>
                            </div>
                            <div className="h-10 bg-gray-200 rounded mt-2"></div>
                          </div>
                        )}
                        {category === "Learning Loop / Multi-Ad Patterns" && (
                          <div className="space-y-2">
                            <svg viewBox="0 0 100 60" className="w-full h-16">
                              <polyline
                                points="10,50 25,45 40,35 55,30 70,25 85,20 90,15"
                                fill="none"
                                stroke="#8b5cf6"
                                strokeWidth="2"
                              />
                              <circle cx="10" cy="50" r="2" fill="#8b5cf6" />
                              <circle cx="25" cy="45" r="2" fill="#8b5cf6" />
                              <circle cx="40" cy="35" r="2" fill="#8b5cf6" />
                              <circle cx="55" cy="30" r="2" fill="#8b5cf6" />
                              <circle cx="70" cy="25" r="2" fill="#8b5cf6" />
                              <circle cx="85" cy="20" r="2" fill="#8b5cf6" />
                              <circle cx="90" cy="15" r="2" fill="#8b5cf6" />
                            </svg>
                            <div className="space-y-1">
                              <div className="h-2 bg-gray-300 rounded w-full"></div>
                              <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      {category === "Predicted Ad Performance & ROI" && (
                        <div className="space-y-2">
                          <div className="text-xs text-gray-700 mb-1">
                            <div className="font-semibold">ROI Projection</div>
                            <div className="text-gray-600 text-[10px]">Estimated return on investment</div>
                          </div>
                          <div className="relative w-full h-16">
                            <svg viewBox="0 0 100 60" className="w-full h-full">
                              <rect x="10" y={40 - (result.resonanceScore * 0.3)} width="15" height={result.resonanceScore * 0.3} fill="#10b981" opacity="0.8" />
                              <rect x="30" y={30 - (result.resonanceScore * 0.35)} width="15" height={result.resonanceScore * 0.35} fill="#10b981" opacity="0.85" />
                              <rect x="50" y={20 - (result.resonanceScore * 0.4)} width="15" height={result.resonanceScore * 0.4} fill="#10b981" opacity="0.9" />
                              <rect x="70" y={15 - (result.resonanceScore * 0.45)} width="15" height={result.resonanceScore * 0.45} fill="#10b981" opacity="0.95" />
                              <text x="50" y="55" textAnchor="middle" fontSize="10" fill="#059669" fontWeight="bold">
                                {Math.round(result.resonanceScore * 1.2)}% ROI
                              </text>
                            </svg>
                          </div>
                          <div className="text-[10px] text-gray-600 pt-1 border-t border-gray-200">
                            Projected performance: <span className="font-semibold text-gray-900">{result.resonanceScore >= 70 ? "High" : result.resonanceScore >= 50 ? "Moderate" : "Low"}</span>
                          </div>
                        </div>
                      )}
                      {category === "Audience Segment Breakdown" && (
                        <div className="space-y-2">
                          <div className="text-xs text-gray-700 mb-1">
                            <div className="font-semibold">Segment Distribution</div>
                            <div className="text-gray-600 text-[10px]">{result.persona} persona</div>
                          </div>
                          <svg viewBox="0 0 100 100" className="w-full h-20">
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#6366f1" strokeWidth="8" 
                              strokeDasharray={`${(result.resonanceScore / 100) * 220} 220`} transform="rotate(-90 50 50)" />
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#8b5cf6" strokeWidth="8" 
                              strokeDasharray={`${((100 - result.resonanceScore) * 0.6 / 100) * 220} 220`} transform={`rotate(${-90 + (result.resonanceScore / 100) * 360} 50 50)`} />
                            <circle cx="50" cy="50" r="35" fill="none" stroke="#ec4899" strokeWidth="8" 
                              strokeDasharray={`${((100 - result.resonanceScore) * 0.4 / 100) * 220} 220`} transform={`rotate(${-90 + (result.resonanceScore / 100) * 360 + ((100 - result.resonanceScore) * 0.6 / 100) * 360} 50 50)`} />
                          </svg>
                          <div className="flex justify-between text-[10px] text-gray-600 pt-1 border-t border-gray-200">
                            <div>Primary: <span className="font-semibold text-gray-900">{result.resonanceScore}%</span></div>
                            <div>Secondary: <span className="font-semibold text-gray-900">{Math.round((100 - result.resonanceScore) * 0.6)}%</span></div>
                            <div>Tertiary: <span className="font-semibold text-gray-900">{Math.round((100 - result.resonanceScore) * 0.4)}%</span></div>
                          </div>
                        </div>
                      )}
                      {category === "Message Clarity & Resonance Map" && (
                        <div className="space-y-2">
                          <div className="text-xs text-gray-700 mb-1">
                            <div className="font-semibold">Clarity Heatmap</div>
                            <div className="text-gray-600 text-[10px]">Message effectiveness by section</div>
                          </div>
                          <div className="grid grid-cols-4 gap-1 h-16">
                            {[...Array(12)].map((_, i) => {
                              const intensity = result.resonanceScore - (i % 4) * 10;
                              return (
                                <div key={i} className={`rounded ${
                                  intensity >= 70 ? 'bg-green-500' : 
                                  intensity >= 50 ? 'bg-green-400' : 
                                  intensity >= 30 ? 'bg-green-300' : 'bg-green-200'
                                }`} style={{ opacity: Math.max(0.4, intensity / 100) }}>
                                  <div className="text-[8px] text-white text-center pt-1 font-semibold">{Math.max(0, intensity)}%</div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="text-[10px] text-gray-600 pt-1 border-t border-gray-200">
                            Average clarity: <span className="font-semibold text-gray-900">{result.resonanceScore}%</span>
                          </div>
                        </div>
                      )}
                      {category === "Creative Element Impact Analysis" && (
                        <div className="space-y-2">
                          <div className="text-xs text-gray-700 mb-1">
                            <div className="font-semibold">Element Impact</div>
                            <div className="text-gray-600 text-[10px]">Waterfall analysis</div>
                          </div>
                          <div className="flex items-end gap-1.5 h-16">
                            {['Headline', 'Visual', 'CTA', 'Copy', 'Design'].map((el, i) => {
                              const heights = [
                                result.resonanceScore,
                                Math.max(60, result.resonanceScore - 10),
                                Math.max(50, result.resonanceScore - 20),
                                Math.max(40, result.resonanceScore - 30),
                                Math.max(30, result.resonanceScore - 40)
                              ];
                              return (
                                <div key={i} className="flex-1 flex flex-col items-center">
                                  <div className={`w-full rounded-t mb-1 ${
                                    heights[i] >= 70 ? 'bg-purple-700' : heights[i] >= 50 ? 'bg-purple-600' : 'bg-purple-500'
                                  }`} style={{ height: `${heights[i]}%` }}></div>
                                  <div className="text-[9px] text-gray-600 text-center">{el}</div>
                                  <div className="text-[9px] font-semibold text-gray-900">{heights[i]}%</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {category === "Emotional & Sentiment Analysis" && (
                        <div className="space-y-2">
                          <div className="text-xs text-gray-700 mb-1">
                            <div className="font-semibold">Emotion Wheel</div>
                            <div className="text-gray-600 text-[10px]">Sentiment distribution</div>
                          </div>
                          <svg viewBox="0 0 100 100" className="w-full h-20">
                            <circle cx="50" cy="50" r="30" fill="none" stroke="#f59e0b" strokeWidth="3" />
                            <circle cx="35" cy="40" r="8" fill="#f59e0b" opacity={result.resonanceScore / 100} />
                            <circle cx="50" cy="35" r="10" fill="#f59e0b" opacity={Math.min(1, (result.resonanceScore + 10) / 100)} />
                            <circle cx="65" cy="40" r="8" fill="#f59e0b" opacity={result.resonanceScore / 100} />
                            <path d="M 40 55 Q 50 60 60 55" stroke="#f59e0b" strokeWidth="2" fill="none" opacity={result.resonanceScore / 100} />
                            <text x="50" y="75" textAnchor="middle" fontSize="10" fill="#d97706" fontWeight="bold">
                              {result.resonanceScore >= 70 ? "Positive" : result.resonanceScore >= 50 ? "Neutral" : "Mixed"}
                            </text>
                          </svg>
                          <div className="text-[10px] text-gray-600 pt-1 border-t border-gray-200">
                            Sentiment score: <span className="font-semibold text-gray-900">{result.resonanceScore}%</span>
                          </div>
                        </div>
                      )}
                      {category === "Attention & First-Impression Pathway" && (
                        <div className="space-y-2">
                          <div className="text-xs text-gray-700 mb-1">
                            <div className="font-semibold">Gaze Pathway</div>
                            <div className="text-gray-600 text-[10px]">First-impression flow</div>
                          </div>
                          <svg viewBox="0 0 100 60" className="w-full h-16">
                            <circle cx="15" cy="30" r="4" fill="#3b82f6" />
                            <path d={`M 15 30 Q 30 ${15 + (100 - result.resonanceScore) * 0.15}, 45 ${20 + (100 - result.resonanceScore) * 0.1} T 75 ${25 + (100 - result.resonanceScore) * 0.05}`} 
                              stroke="#3b82f6" strokeWidth="2" fill="none" />
                            <circle cx="45" cy={20 + (100 - result.resonanceScore) * 0.1} r="3" fill="#3b82f6" />
                            <circle cx="75" cy={25 + (100 - result.resonanceScore) * 0.05} r="3" fill="#3b82f6" />
                            <path d={`M 75 ${25 + (100 - result.resonanceScore) * 0.05} L 85 30 L 75 ${35 - (100 - result.resonanceScore) * 0.05}`} 
                              stroke="#3b82f6" strokeWidth="2" fill="none" />
                          </svg>
                          <div className="text-[10px] text-gray-600 pt-1 border-t border-gray-200">
                            Attention retention: <span className="font-semibold text-gray-900">{result.resonanceScore}%</span>
                          </div>
                        </div>
                      )}
                      {category === "Top Predicted Objections & Risks" && (
                        <div className="space-y-2">
                          <div className="text-xs text-gray-700 mb-1">
                            <div className="font-semibold">Risk Assessment</div>
                            <div className="text-gray-600 text-[10px]">{result.weaknesses.length} objections identified</div>
                          </div>
                          <div className="space-y-1.5">
                            {result.weaknesses.map((w, i) => {
                              const riskLevels = ['High', 'Medium', 'Low'];
                              const riskColors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400'];
                              return (
                                <div key={i} className="flex items-start gap-2">
                                  <div className={`w-6 h-6 ${riskColors[i] || 'bg-red-300'} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-[10px] text-gray-700 leading-tight block">{w}</span>
                                    <span className="text-[9px] text-gray-500">{riskLevels[i] || 'Medium'} risk</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {category === "Actionable Improvement Recommendations" && (
                        <div className="space-y-2">
                          <div className="text-xs text-gray-700">
                            <div className="font-semibold mb-2">Priority Actions</div>
                            <div className="space-y-1.5">
                              {result.suggestedFixes.map((f, i) => {
                                const impactScores = [85, 75, 65];
                                return (
                                  <div key={i} className="flex items-start gap-2">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 ${
                                      i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-amber-400' : 'bg-amber-300'
                                    }`}>
                                      {i + 1}
                                    </div>
                                    <div className="flex-1">
                                      <span className="text-[10px] text-gray-700 leading-tight block mb-0.5">{f}</span>
                                      <div className="flex items-center gap-1">
                                        <div className="h-1 bg-gray-200 rounded-full flex-1 overflow-hidden">
                                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${impactScores[i]}%` }}></div>
                                        </div>
                                        <span className="text-[9px] text-gray-500">{impactScores[i]}% impact</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                      {category === "Learning Loop / Multi-Ad Patterns" && (
                        <div className="space-y-2">
                          <div className="text-xs text-gray-700 mb-1">
                            <div className="font-semibold">Performance Trend</div>
                            <div className="text-gray-600 text-[10px]">Historical comparison</div>
                          </div>
                          <svg viewBox="0 0 100 60" className="w-full h-16">
                            <polyline
                              points={`10,${50 - (result.resonanceScore * 0.3)} 25,${45 - (result.resonanceScore * 0.25)} 40,${35 - (result.resonanceScore * 0.2)} 55,${30 - (result.resonanceScore * 0.15)} 70,${25 - (result.resonanceScore * 0.1)} 85,${20 - (result.resonanceScore * 0.05)} 90,${15 - (result.resonanceScore * 0.02)}`}
                              fill="none"
                              stroke="#8b5cf6"
                              strokeWidth="2"
                            />
                            <circle cx="10" cy={50 - (result.resonanceScore * 0.3)} r="2" fill="#8b5cf6" />
                            <circle cx="25" cy={45 - (result.resonanceScore * 0.25)} r="2" fill="#8b5cf6" />
                            <circle cx="40" cy={35 - (result.resonanceScore * 0.2)} r="2" fill="#8b5cf6" />
                            <circle cx="55" cy={30 - (result.resonanceScore * 0.15)} r="2" fill="#8b5cf6" />
                            <circle cx="70" cy={25 - (result.resonanceScore * 0.1)} r="2" fill="#8b5cf6" />
                            <circle cx="85" cy={20 - (result.resonanceScore * 0.05)} r="2" fill="#8b5cf6" />
                            <circle cx="90" cy={15 - (result.resonanceScore * 0.02)} r="2" fill="#8b5cf6" />
                          </svg>
                          <div className="text-[10px] text-gray-600 pt-1 border-t border-gray-200">
                            Current score: <span className="font-semibold text-gray-900">{result.resonanceScore}%</span> | 
                            Trend: <span className="font-semibold text-gray-900">{result.resonanceScore >= 70 ? "↑ Improving" : result.resonanceScore >= 50 ? "→ Stable" : "↓ Declining"}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-3"
        >
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleTryAnother}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105"
            >
              <RefreshCw size={16} />
              Test Another Concept
            </button>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="inline-flex items-center gap-2 px-6 py-2 bg-white border border-gray-600 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-all hover:scale-105"
            >
              <MessageSquare size={16} />
              Feedback
            </button>
          </div>
        </motion.div>

        {/* Feedback Modal */}
        {showFeedbackModal && result && (
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
                    page: "insights",
                    data: {
                      feedback,
                      email,
                    },
                    evaluationId: `eval_${result.personaId}_${result.resonanceScore}`,
                    personaId: result.personaId,
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

