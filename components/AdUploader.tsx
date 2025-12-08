"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, X, FileText, Image as ImageIcon, Info } from "lucide-react";
import { motion } from "framer-motion";

interface AdUploaderProps {
  onImageUpload: (base64: string) => void;
  onTextUpload: (text: string) => void;
  mode: "image" | "text";
  onModeChange: (mode: "image" | "text") => void;
}

export default function AdUploader({
  onImageUpload,
  onTextUpload,
  mode,
  onModeChange,
}: AdUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [textContent, setTextContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (mode === "image") {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (mode === "image" && e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Validate file size (4MB max for OpenAI vision)
    if (file.size > 4 * 1024 * 1024) {
      alert("File size must be less than 4MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPreview(base64String);
      onImageUpload(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setTextContent(text);
    onTextUpload(text);
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => onModeChange("image")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all relative ${
            mode === "image"
              ? "bg-cyan-500 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <ImageIcon size={18} />
            Upload Your Concept
            <div 
              className="relative group"
              onClick={(e) => e.stopPropagation()}
            >
              <Info size={16} className="text-current opacity-70 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                Max file size: 4MB. Supports JPG, PNG, GIF, WebP.
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </button>
        <button
          onClick={() => onModeChange("text")}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            mode === "text"
              ? "bg-cyan-500 text-white shadow-lg"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FileText size={18} />
            Text
          </div>
        </button>
      </div>

      {/* Image Upload Mode */}
      {mode === "image" && (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
            isDragging
              ? "border-cyan-500 bg-cyan-50"
              : "border-gray-300 bg-white hover:border-gray-400"
          }`}
        >
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="max-h-96 mx-auto rounded-lg shadow-lg"
              />
              <button
                onClick={clearImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <Upload
                size={48}
                className={`mx-auto mb-4 ${
                  isDragging ? "text-cyan-500" : "text-gray-400"
                }`}
              />
              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="text-lg font-medium text-gray-700">
                  Drag & drop image here
                </p>
                <div className="relative group">
                  <Info size={14} className="text-gray-500 cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    Max file size: 4MB. Supports JPG, PNG, GIF, WebP.
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Browse Files
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Text Upload Mode */}
      {mode === "text" && (
        <div className="border-2 border-gray-300 rounded-xl p-6 bg-white">
          <textarea
            value={textContent}
            onChange={handleTextChange}
            placeholder="Paste or type your ad copy here..."
            className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none font-body text-gray-700"
          />
          <p className="text-xs text-gray-400 mt-2">
            {textContent.length} characters
          </p>
        </div>
      )}
    </div>
  );
}

