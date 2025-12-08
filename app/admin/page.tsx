"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  TrendingUp,
  Activity,
  UserCheck,
  Sparkles,
  ArrowRight,
  Calendar,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalEvaluations: number;
  totalUsers: number;
  averageScore: number;
  evaluationsToday: number;
  evaluationsThisWeek: number;
  topPersona: string;
  evaluationsByPersona: { persona: string; count: number }[];
  recentActivity: {
    id: string;
    type: string;
    timestamp: string;
    details: string;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvaluations: 0,
    totalUsers: 0,
    averageScore: 0,
    evaluationsToday: 0,
    evaluationsThisWeek: 0,
    topPersona: "N/A",
    evaluationsByPersona: [],
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Evaluations",
      value: stats.totalEvaluations.toLocaleString(),
      icon: FileText,
      color: "from-indigo-600 to-indigo-700",
      change: `+${stats.evaluationsToday} today`,
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "from-cyan-600 to-cyan-700",
      change: "Active users",
    },
    {
      title: "Average Score",
      value: stats.averageScore.toFixed(1),
      icon: TrendingUp,
      color: "from-emerald-600 to-emerald-700",
      change: "Resonance score",
    },
    {
      title: "This Week",
      value: stats.evaluationsThisWeek.toLocaleString(),
      icon: Activity,
      color: "from-purple-600 to-purple-700",
      change: "Evaluations",
    },
  ];

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
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Testbed.AI Administration</p>
              </div>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back to App
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
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-medium text-center transition-all hover:shadow-lg"
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
          </div>
        </motion.div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="text-white" size={24} />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </motion.div>
              ))}
            </div>

            {/* Charts and Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Persona Usage Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Persona Usage
                  </h2>
                  <BarChart3 className="text-indigo-600" size={24} />
                </div>
                <div className="space-y-4">
                  {stats.evaluationsByPersona.length > 0 ? (
                    stats.evaluationsByPersona.map((item, index) => {
                      const maxCount = Math.max(
                        ...stats.evaluationsByPersona.map((p) => p.count),
                        1
                      );
                      const percentage = (item.count / maxCount) * 100;
                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              {item.persona}
                            </span>
                            <span className="text-sm text-gray-600">
                              {item.count}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                              className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-2 rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No data available
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Activity
                  </h2>
                  <Activity className="text-cyan-600" size={24} />
                </div>
                <div className="space-y-4">
                  {stats.recentActivity.length > 0 ? (
                    stats.recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Clock className="text-indigo-600" size={16} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.details}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No recent activity
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/admin/users"
                  className="p-4 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-lg border border-indigo-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="text-indigo-600" size={24} />
                      <span className="font-medium text-gray-900">
                        Manage Users
                      </span>
                    </div>
                    <ArrowRight className="text-gray-400 group-hover:text-indigo-600 transition-colors" size={20} />
                  </div>
                </Link>
                <Link
                  href="/admin/personas"
                  className="p-4 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-lg border border-indigo-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserCheck className="text-cyan-600" size={24} />
                      <span className="font-medium text-gray-900">
                        Manage Personas
                      </span>
                    </div>
                    <ArrowRight className="text-gray-400 group-hover:text-cyan-600 transition-colors" size={20} />
                  </div>
                </Link>
                <Link
                  href="/admin/settings"
                  className="p-4 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-lg border border-indigo-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Settings className="text-purple-600" size={24} />
                      <span className="font-medium text-gray-900">
                        System Settings
                      </span>
                    </div>
                    <ArrowRight className="text-gray-400 group-hover:text-purple-600 transition-colors" size={20} />
                  </div>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

