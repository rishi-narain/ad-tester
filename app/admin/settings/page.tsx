"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Save,
  Key,
  Server,
  Shield,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

interface SettingsData {
  openaiApiKey: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  enableAnalytics: boolean;
  maintenanceMode: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    openaiApiKey: "",
    maxFileSize: 4,
    allowedFileTypes: ["jpg", "png", "gif", "webp"],
    enableAnalytics: true,
    maintenanceMode: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
                  System Settings
                </h1>
                <p className="text-gray-600 mt-1">Configure platform settings</p>
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
              className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-medium text-center transition-all hover:shadow-lg"
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

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* API Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <Key className="text-indigo-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">API Configuration</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={settings.openaiApiKey}
                    onChange={(e) =>
                      setSettings({ ...settings, openaiApiKey: e.target.value })
                    }
                    placeholder="sk-..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Your API key is encrypted and stored securely
                  </p>
                </div>
              </div>
            </motion.div>

            {/* File Upload Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <Server className="text-cyan-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">File Upload Settings</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max File Size (MB)
                  </label>
                  <input
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maxFileSize: parseInt(e.target.value) || 4,
                      })
                    }
                    min="1"
                    max="20"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowed File Types
                  </label>
                  <input
                    type="text"
                    value={settings.allowedFileTypes.join(", ")}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        allowedFileTypes: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="jpg, png, gif, webp"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>

            {/* System Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <Shield className="text-purple-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">System Settings</h2>
              </div>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableAnalytics}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enableAnalytics: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Enable Analytics
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maintenanceMode: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Maintenance Mode
                  </span>
                </label>
                {settings.maintenanceMode && (
                  <div className="ml-8 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="text-amber-600 mt-0.5" size={16} />
                      <p className="text-sm text-amber-800">
                        When enabled, the platform will be unavailable to regular users.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex items-center gap-3">
                {saveStatus === "success" && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle size={20} />
                    <span className="text-sm font-medium">Settings saved successfully</span>
                  </div>
                )}
                {saveStatus === "error" && (
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle size={20} />
                    <span className="text-sm font-medium">Failed to save settings</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={18} />
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

