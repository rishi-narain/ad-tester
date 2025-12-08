"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  UserCheck,
  Plus,
  Edit,
  Trash2,
  Search,
  Sparkles,
  ArrowLeft,
  FileText,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Persona } from "@/lib/personas";

export default function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      const response = await fetch("/api/admin/personas");
      if (response.ok) {
        const data = await response.json();
        setPersonas(data.personas || []);
      }
    } catch (error) {
      console.error("Error fetching personas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPersonas = personas.filter((persona) =>
    persona.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    persona.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this persona?")) return;
    
    try {
      const response = await fetch(`/api/admin/personas/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchPersonas();
      }
    } catch (error) {
      console.error("Error deleting persona:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="text-cyan-500" size={32} />
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  Persona Management
                </h1>
                <p className="text-gray-600 mt-1">Manage audience personas</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                <ArrowLeft className="inline mr-2" size={18} />
                Back
              </Link>
              <button
                onClick={() => {
                  setEditingPersona(null);
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus size={18} />
                Add Persona
              </button>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-2 flex gap-2">
            <Link
              href="/admin"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium text-center transition-all hover:bg-gray-200"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium text-center transition-all hover:bg-gray-200"
            >
              Users
            </Link>
            <Link
              href="/admin/personas"
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-medium text-center transition-all hover:shadow-lg"
            >
              Personas
            </Link>
            <Link
              href="/admin/settings"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium text-center transition-all hover:bg-gray-200"
            >
              Settings
            </Link>
            <Link
              href="/admin/feedback"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium text-center transition-all hover:bg-gray-200"
            >
              Feedback
            </Link>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200 mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search personas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Personas Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPersonas.map((persona, index) => (
              <motion.div
                key={persona.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {persona.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {persona.description}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingPersona(persona);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(persona.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FileText size={14} />
                    <span>ID: {persona.id}</span>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredPersonas.length === 0 && (
              <div className="col-span-full text-center py-12">
                <UserCheck className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No personas found</p>
              </div>
            )}
          </div>
        )}

        {/* Edit/Create Modal */}
        {isModalOpen && (
          <PersonaModal
            persona={editingPersona}
            onClose={() => {
              setIsModalOpen(false);
              setEditingPersona(null);
            }}
            onSave={() => {
              fetchPersonas();
              setIsModalOpen(false);
              setEditingPersona(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

function PersonaModal({
  persona,
  onClose,
  onSave,
}: {
  persona: Persona | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    id: persona?.id || "",
    title: persona?.title || "",
    description: persona?.description || "",
    systemPrompt: persona?.systemPrompt || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = persona
        ? `/api/admin/personas/${persona.id}`
        : "/api/admin/personas";
      const method = persona ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
      } else {
        alert("Failed to save persona");
      }
    } catch (error) {
      console.error("Error saving persona:", error);
      alert("Error saving persona");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {persona ? "Edit Persona" : "Create Persona"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) =>
                setFormData({ ...formData, id: e.target.value })
              }
              required
              disabled={!!persona}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Prompt
            </label>
            <textarea
              value={formData.systemPrompt}
              onChange={(e) =>
                setFormData({ ...formData, systemPrompt: e.target.value })
              }
              required
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSaving ? "Saving..." : persona ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

