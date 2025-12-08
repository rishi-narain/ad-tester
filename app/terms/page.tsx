"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-8">
            TESTBED.AI — TERMS OF SERVICE, PRIVACY POLICY & DATA PROCESSING ADDENDUM
          </h1>

          <p className="text-gray-600 mb-8">
            <strong>Effective Date:</strong> December 7, 2025
          </p>

          <p className="text-gray-700 mb-8">
            Welcome to Testbed.AI ("Company", "we", "our", or "us").
            <br />
            These Terms of Service (the "Terms") govern your access to and use of the Testbed.AI website, systems, and any related services (the "Service").
          </p>

          <p className="text-gray-700 mb-8">
            By using the Service, you accept all terms below, including the integrated:
          </p>

          <ol className="list-decimal list-inside text-gray-700 mb-8 space-y-2">
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Data Processing Addendum</li>
          </ol>

          <p className="text-gray-700 mb-12">
            If you do not agree, do not use the Service.
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">SECTION 1 - SERVICE USE</h2>
            <p className="text-gray-700 mb-2">
              You must be 18 years or older to use Testbed.AI.
            </p>
            <p className="text-gray-700 mb-2">
              You agree not to misuse the Service, interfere with operations, or violate applicable laws.
            </p>
            <p className="text-gray-700">
              We may suspend or terminate access for misconduct at our discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">SECTION 2 - USER CONTENT</h2>
            <p className="text-gray-700 mb-4">
              "User Content" includes any material you upload or submit, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
              <li>Images</li>
              <li>Advertisements</li>
              <li>Copy, text, headlines</li>
              <li>Scripts, notes, and metadata</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-6">2.1 Ownership</h3>
            <p className="text-gray-700 mb-4">
              You retain ownership of your User Content.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-6">2.2 License to Testbed.AI</h3>
            <p className="text-gray-700 mb-2">
              By using the Service, you grant Testbed.AI a perpetual, irrevocable, worldwide, royalty-free, sublicensable license to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
              <li>Use, process, reproduce, analyze, publish, modify, and create derivative works from your User Content</li>
              <li>Train, fine-tune, and improve machine learning models, personas, evaluation engines, and algorithms</li>
              <li>Store derived representations (embeddings, structured data, extracted features, textual summaries)</li>
              <li>Use your User Content for internal research, analytics, security, debugging, and product development</li>
            </ul>
            <p className="text-gray-700 mb-2">
              This license survives the termination of your account.
            </p>
            <p className="text-gray-700">
              You represent that you have all necessary rights to grant this license.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">SECTION 3 - HANDLING OF USER CONTENT (IMAGES, TEXT, ETC.)</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">3.1 Original Image Handling</h3>
            <p className="text-gray-700 mb-4">
              Testbed.AI does not permanently retain your original image files.
              Images may be temporarily cached for processing but are deleted once processed.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">3.2 Derived Data</h3>
            <p className="text-gray-700 mb-2">We do retain:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
              <li>Text descriptions</li>
              <li>Metadata</li>
              <li>Embeddings</li>
              <li>Model evaluation results</li>
              <li>Persona scoring</li>
              <li>Analytical features extracted from your content</li>
            </ul>
            <p className="text-gray-700">
              Derived data cannot be reverse-engineered into the original image and is used for model improvement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">SECTION 4 - OUTPUT OWNERSHIP</h2>
            <p className="text-gray-700 mb-4">
              You may use all generated outputs (evaluations, persona reactions, summaries) for any lawful purpose.
            </p>
            <p className="text-gray-700 mb-2">Testbed.AI retains all rights to:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
              <li>Models</li>
              <li>Personas</li>
              <li>Algorithms</li>
              <li>Analytical systems</li>
              <li>Synthetic outputs not containing your proprietary text verbatim</li>
            </ul>
            <p className="text-gray-700">
              We do not guarantee correctness or real-world performance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">SECTION 5 - RESTRICTED CONTENT</h2>
            <p className="text-gray-700">
              You agree not to upload unlawful, offensive, copyrighted, or otherwise restricted content. You agree not to upload content containing personal data of others without consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">SECTION 6 - PRIVACY POLICY (INTEGRATED)</h2>
            <p className="text-gray-700 mb-4">
              This Privacy Policy explains how we collect, use, and protect information about you.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">6.1 Information We Collect</h3>
            <p className="text-gray-700 mb-2">We collect:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
              <li>Account and contact information</li>
              <li>Uploaded User Content</li>
              <li>System usage data (clicks, actions, evaluations performed)</li>
              <li>Technical logs for debugging and security</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">6.2 How We Use Your Information</h3>
            <p className="text-gray-700 mb-2">We use information to:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
              <li>Operate the Service</li>
              <li>Process and evaluate User Content</li>
              <li>Train and improve machine learning models</li>
              <li>Enhance personas</li>
              <li>Prevent fraud</li>
              <li>Provide customer support</li>
              <li>Analyze usage and develop new features</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">6.3 Sharing of Information</h3>
            <p className="text-gray-700 mb-2">We may share derived data with:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
              <li>Trusted infrastructure providers</li>
              <li>AI processing vendors</li>
              <li>Security and analytics partners</li>
            </ul>
            <p className="text-gray-700">
              We do not sell User Content or derived data.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">6.4 Data Retention</h3>
            <p className="text-gray-700 mb-2">We:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
              <li>Delete original image uploads after processing</li>
              <li>Retain derived data indefinitely for model improvement and analytics</li>
              <li>Retain account and billing information as required by law</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">6.5 User Rights</h3>
            <p className="text-gray-700 mb-2">You may request:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
              <li>Access to your account data</li>
              <li>Deletion of your account</li>
              <li>Correction of inaccurate information</li>
            </ul>
            <p className="text-gray-700">
              Derived data, embeddings, and model improvements cannot be deleted, as they are inseparable from the machine learning systems.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">SECTION 7 - DATA PROCESSING ADDENDUM (INTEGRATED)</h2>
            <p className="text-gray-700 mb-4">
              Applies where you act as "data controller" under privacy regulations such as GDPR or CCPA.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">7.1 Roles</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
              <li>You are the "Data Controller."</li>
              <li>Testbed.AI is the "Data Processor."</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">7.2 Processing Instructions</h3>
            <p className="text-gray-700 mb-2">
              We will process personal data solely to provide and improve the Service, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
              <li>Feature extraction</li>
              <li>Scoring and evaluation</li>
              <li>Analytics</li>
              <li>Model training and refinement</li>
            </ul>
            <p className="text-gray-700">
              You authorize all processing described in these Terms.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">7.3 Subprocessors</h3>
            <p className="text-gray-700 mb-4">
              We may use subprocessors for hosting, AI infrastructure, analytics, and security.
              We maintain responsibility for their compliance.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">7.4 Security</h3>
            <p className="text-gray-700 mb-4">
              We implement reasonable technical and organizational measures to safeguard data.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">7.5 Data Subject Rights</h3>
            <p className="text-gray-700 mb-2">We support your ability to:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
              <li>Request deletion (except derived data)</li>
              <li>Request access</li>
              <li>Object to processing</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">7.6 International Transfers</h3>
            <p className="text-gray-700">
              Your data may be transferred outside your jurisdiction as necessary to operate the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">SECTION 8 - MODEL TRAINING NOTICE (CRITICAL CLAUSE)</h2>
            <p className="text-gray-700 mb-2">You acknowledge and agree that:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
              <li>All User Content and derived data may be used to train, improve, and refine Testbed.AI's machine learning models.</li>
              <li>This includes models for:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Persona behavior</li>
                  <li>Synthetic evaluations</li>
                  <li>Ad analysis</li>
                  <li>Image understanding</li>
                  <li>Embeddings</li>
                  <li>Predictive analytics</li>
                </ul>
              </li>
              <li>Model improvements are exclusively owned by Testbed.AI.</li>
              <li>These rights survive account termination.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">SECTION 9 - DISCLAIMERS</h2>
            <p className="text-gray-700 mb-2">The Service is provided as-is, with no warranties, including:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
              <li>Accuracy</li>
              <li>Reliability</li>
              <li>Non-infringement</li>
              <li>Fitness for a particular purpose</li>
            </ul>
            <p className="text-gray-700">
              You use the Service at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">SECTION 10 - LIMITATION OF LIABILITY</h2>
            <p className="text-gray-700 mb-2">To the extent permitted by law:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 ml-4">
              <li>We are not liable for indirect, incidental, special, consequential, or punitive damages</li>
              <li>Our total liability will not exceed the amount paid by you in the last 90 days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">SECTION 11 - TERMINATION</h2>
            <p className="text-gray-700 mb-2">
              We may suspend or terminate accounts at any time for violating these Terms.
            </p>
            <p className="text-gray-700">
              You may stop using the Service at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">SECTION 12 - UPDATES TO TERMS</h2>
            <p className="text-gray-700">
              We may update these Terms at any time.
              Continued use of the Service constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">SECTION 13 - GOVERNING LAW</h2>
            <p className="text-gray-700">
              These Terms are governed by the laws of the State of California.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">SECTION 14 - CONTACT</h2>
            <p className="text-gray-700">
              For legal questions:
              <br />
              <a href="mailto:info@climehigher.com" className="text-indigo-600 hover:text-indigo-700 underline">
                info@climehigher.com
              </a>
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

