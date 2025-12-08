"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  Sparkles,
  ArrowLeft,
  Mail,
  Calendar,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface Feedback {
  id: string;
  type: "thumbs" | "written";
  timestamp: string;
  page: "results" | "insights";
  data: {
    category?: string;
    item?: string;
    vote?: "up" | "down";
    feedback?: string;
    email?: string;
  };
  evaluationId?: string;
  personaId?: string;
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "thumbs" | "written">("all");
  const [filterPage, setFilterPage] = useState<"all" | "results" | "insights">("all");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch("/api/feedback");
      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback || []);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFeedback = feedback.filter((item) => {
    const matchesSearch =
      item.data.feedback?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.data.item?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.data.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.data.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesPage = filterPage === "all" || item.page === filterPage;
    return matchesSearch && matchesType && matchesPage;
  });

  const thumbsUpCount = feedback.filter(
    (f) => f.type === "thumbs" && f.data.vote === "up"
  ).length;
  const thumbsDownCount = feedback.filter(
    (f) => f.type === "thumbs" && f.data.vote === "down"
  ).length;
  const writtenCount = feedback.filter((f) => f.type === "written").length;

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
                  User Feedback
                </h1>
                <p className="text-gray-600 mt-1">View and manage user feedback</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="inline mr-2" size={18} />
              Back
            </Link>
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
              className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium text-center transition-all hover:bg-gray-200"
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
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-medium text-center transition-all hover:shadow-lg"
            >
              Feedback
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-2">
              <ThumbsUp className="text-green-600" size={24} />
              <h3 className="text-sm font-medium text-gray-600">Thumbs Up</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{thumbsUpCount}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-2">
              <ThumbsDown className="text-red-600" size={24} />
              <h3 className="text-sm font-medium text-gray-600">Thumbs Down</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{thumbsDownCount}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="text-indigo-600" size={24} />
              <h3 className="text-sm font-medium text-gray-600">Written Feedback</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{writtenCount}</p>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400" size={20} />
              <select
                value={filterType}
                onChange={(e) =>
                  setFilterType(e.target.value as "all" | "thumbs" | "written")
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="thumbs">Thumbs Votes</option>
                <option value="written">Written Feedback</option>
              </select>
              <select
                value={filterPage}
                onChange={(e) =>
                  setFilterPage(e.target.value as "all" | "results" | "insights")
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Pages</option>
                <option value="results">Results</option>
                <option value="insights">Insights</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Feedback List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            {filteredFeedback.length > 0 ? (
              filteredFeedback.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {item.type === "thumbs" ? (
                        item.data.vote === "up" ? (
                          <ThumbsUp className="text-green-600" size={24} />
                        ) : (
                          <ThumbsDown className="text-red-600" size={24} />
                        )
                      ) : (
                        <MessageSquare className="text-indigo-600" size={24} />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {item.type === "thumbs" ? "Thumbs Vote" : "Written Feedback"}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.page === "results"
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-purple-100 text-purple-700"
                          }`}>
                            {item.page}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <Calendar size={14} />
                          {new Date(item.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {item.type === "thumbs" ? (
                    <div className="space-y-2">
                      {item.data.category && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Category: </span>
                          <span className="text-sm text-gray-900">{item.data.category}</span>
                        </div>
                      )}
                      {item.data.item && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Item: </span>
                          <span className="text-sm text-gray-900">{item.data.item}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-gray-700">Vote: </span>
                        <span className={`text-sm font-semibold ${
                          item.data.vote === "up" ? "text-green-600" : "text-red-600"
                        }`}>
                          {item.data.vote === "up" ? "👍 Agree" : "👎 Disagree"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {item.data.feedback && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {item.data.feedback}
                          </p>
                        </div>
                      )}
                      {item.data.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} />
                          {item.data.email}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {item.personaId && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        Persona ID: {item.personaId}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200">
                <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No feedback found</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

