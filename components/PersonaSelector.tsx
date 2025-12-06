"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { personas, Persona } from "@/lib/personas";
import { motion, AnimatePresence } from "framer-motion";

interface PersonaSelectorProps {
  selectedPersona: Persona | null;
  onSelect: (persona: Persona) => void;
}

export default function PersonaSelector({
  selectedPersona,
  onSelect,
}: PersonaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-left flex items-center justify-between"
      >
        <span className="text-gray-700 font-medium">
          {selectedPersona ? selectedPersona.name : "Select a persona..."}
        </span>
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
          >
            {personas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => {
                  onSelect(persona);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">
                      {persona.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {persona.description}
                    </div>
                  </div>
                  {selectedPersona?.id === persona.id && (
                    <Check size={20} className="text-cyan-500 ml-2 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

