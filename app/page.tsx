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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleImageUpload = (base64: string) => {
    setImageData(base64);
  };

  const handleTextUpload = (text: string) => {
    setTextData(text);
  };

  const handleEvaluate = async () => {
    if (!selectedPersona) {
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
          persona: selectedPersona.id,
          content: uploadMode === "image" ? imageData : textData,
          contentType: uploadMode,
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
    selectedPersona &&
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
              Ad Tester
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how well your ad will resonate with specific audience personas
            before spending money on distribution
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200"
        >
          {/* Upload Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Upload Your Ad
            </h2>
            <AdUploader
              mode={uploadMode}
              onModeChange={setUploadMode}
              onImageUpload={handleImageUpload}
              onTextUpload={handleTextUpload}
            />
          </div>

          {/* Persona Selector */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Select Target Persona
            </h2>
            <PersonaSelector
              selectedPersona={selectedPersona}
              onSelect={setSelectedPersona}
            />
          </div>

          {/* Evaluate Button */}
          <motion.button
            onClick={handleEvaluate}
            disabled={!canEvaluate || isLoading}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
              canEvaluate && !isLoading
                ? "bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:shadow-lg hover:scale-[1.02]"
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
                Evaluating...
              </span>
            ) : (
              "Evaluate Ad"
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
            Get instant feedback on ad resonance, strengths, weaknesses, and
            actionable improvement suggestions
          </p>
        </motion.div>
      </div>
    </div>
  );
}
