"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import AdUploader from "@/components/AdUploader";
import PersonaSelector from "@/components/PersonaSelector";
import { Persona } from "@/lib/personas";

export default function Home() {
  const [uploadMode, setUploadMode] = useState<"image" | "text">("image");
  const [imageData, setImageData] = useState<string | null>(null);
  const [textData, setTextData] = useState<string>("");
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [isReverseMode, setIsReverseMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleImageUpload = (base64: string) => {
    setImageData(base64);
  };

  const handleTextUpload = (text: string) => {
    setTextData(text);
  };

  const handleEvaluate = async () => {
    if (!isReverseMode && !selectedPersona) {
      alert("Please select a persona");
      return;
    }

    if (uploadMode === "image" && !imageData) {
      alert("Please upload an image");
      return;
    }

    if (uploadMode === "text" && !textData.trim()) {
      alert("Please enter ad text");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          persona: isReverseMode ? null : selectedPersona?.id,
          content: uploadMode === "image" ? imageData : textData,
          contentType: uploadMode,
          reverseMode: isReverseMode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || "Evaluation failed");
      }

      const result = await response.json();

      // Check for error in response
      if (result.error) {
        throw new Error(result.message || result.error);
      }

      // Store results in sessionStorage and navigate
      sessionStorage.setItem("evaluationResult", JSON.stringify(result));
      router.push("/results");
    } catch (error: any) {
      console.error("Error evaluating ad:", error);
      const errorMessage = error.message || "Failed to evaluate ad. Please check your OpenAI API key and try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const canEvaluate =
    (isReverseMode || selectedPersona) &&
    ((uploadMode === "image" && imageData) ||
      (uploadMode === "text" && textData.trim()));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-cyan-500" size={32} />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Testbed.AI
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Instant AI Concept Testing
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-200 max-w-2xl mx-auto"
        >
          {/* Upload Section */}
          <div className="mb-6">
            <AdUploader
              mode={uploadMode}
              onModeChange={setUploadMode}
              onImageUpload={handleImageUpload}
              onTextUpload={handleTextUpload}
            />
          </div>

          {/* Reverse Mode Toggle */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isReverseMode}
                onChange={(e) => {
                  setIsReverseMode(e.target.checked);
                  if (e.target.checked) {
                    setSelectedPersona(null);
                  }
                }}
                className="w-5 h-5 text-cyan-500 rounded focus:ring-cyan-500 focus:ring-2"
              />
              <span className="text-base font-medium text-gray-900">
                Find Your Audience - Test All
              </span>
            </label>
          </div>

          {/* Persona Selector */}
          {!isReverseMode && (
            <div className="mb-6">
              <PersonaSelector
                selectedPersona={selectedPersona}
                onSelect={setSelectedPersona}
              />
            </div>
          )}

          {/* Evaluate Button */}
          <motion.button
            onClick={handleEvaluate}
            disabled={!canEvaluate || isLoading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-base transition-all shadow-md ${
              canEvaluate && !isLoading
                ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:shadow-xl hover:scale-[1.02]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            whileHover={canEvaluate && !isLoading ? { scale: 1.02 } : {}}
            whileTap={canEvaluate && !isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                {isReverseMode ? "Evaluating against all personas..." : "Evaluating..."}
              </span>
            ) : (
              isReverseMode ? "Find Best Match" : "Evaluate"
            )}
          </motion.button>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>
            <a href="/terms" className="text-indigo-600 hover:text-indigo-700 underline">
              Terms of Service
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
