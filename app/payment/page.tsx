"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CreditCard } from "lucide-react";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentType, setPaymentType] = useState<"purchase" | "subscribe">("purchase");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "subscribe") {
      setPaymentType("subscribe");
    }
  }, [searchParams]);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store payment success
    const resultData = sessionStorage.getItem("evaluationResult");
    if (resultData) {
      try {
        const result = JSON.parse(resultData);
        const unlockKey = `insights_unlocked_${result.personaId}_${result.resonanceScore}`;
        localStorage.setItem(unlockKey, "true");
        
        if (paymentType === "subscribe") {
          localStorage.setItem("subscription_active", "true");
        }
      } catch (error) {
        console.error("Error processing payment:", error);
      }
    }
    
    setIsProcessing(false);
    router.push("/insights");
  };

  const price = paymentType === "purchase" ? "$1.99" : "$19.99/mo";
  const title = paymentType === "purchase" ? "Unlock Insights" : "Subscribe for Unlimited Reports";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl border border-gray-200 p-8 max-w-md w-full"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors text-sm mb-6"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600 text-sm">
            {paymentType === "purchase" 
              ? "Get full access to all premium insights for this report"
              : "Unlimited testing and reports. Cancel anytime."}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-medium">Amount</span>
            <span className="text-2xl font-bold text-gray-900">{price}</span>
          </div>
          {paymentType === "subscribe" && (
            <p className="text-xs text-gray-500 text-right">Billed monthly</p>
          )}
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer">
            <CreditCard size={20} className="text-gray-400" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">Card ending in •••• 4242</div>
              <div className="text-xs text-gray-500">Test card</div>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay {price}
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Secure payment powered by Stripe
        </p>
      </motion.div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}

