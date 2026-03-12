"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const plans = [
  { id: "starter", name: "Starter", price: "Free", credits: 1000, agents: 2, features: ["Basic builder", "Limited API calls", "Community support"] },
  { id: "pro", name: "Pro", price: "$60/month", credits: 10000, agents: 20, features: ["Advanced builder", "Priority support", "Analytics", "Team members"] },
  { id: "business", name: "Business", price: "$150/month", credits: 30000, agents: "Unlimited", features: ["Everything in Pro", "Dedicated support", "Custom integrations", "Advanced analytics"] },
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (user.user) {
      setUserEmail(user.user.email || "");

      // Load current subscription
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("plan_id")
        .eq("user_id", user.user.id)
        .single();

      setCurrentPlan(subscription?.plan_id || "starter");
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (planId === "starter") {
      setMessage({ type: "success", text: "You are already on the Starter plan (free)" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/billing/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, userEmail }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage({ type: "error", text: data.error || "Failed to create checkout session" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Billing & Plans</h1>
        <p className="text-gray-400">Manage your subscription and usage</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Current Plan: {currentPlan?.toUpperCase()}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-lg p-6 transition-all ${
              currentPlan === plan.id
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-700 hover:border-gray-600"
            }`}
          >
            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
            <p className="text-3xl font-bold mb-1">{plan.price}</p>
            <p className="text-gray-400 mb-4">
              {plan.credits.toLocaleString()} credits/month
            </p>

            <div className="mb-6 space-y-2">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center text-sm">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {currentPlan === plan.id ? (
              <button
                disabled
                className="w-full bg-gray-700 text-gray-400 py-2 rounded-lg cursor-default"
              >
                Current Plan
              </button>
            ) : (
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading || plan.id === "starter"}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Upgrade"}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Usage This Month</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Agents Created</p>
            <p className="text-2xl font-bold">Loading...</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">API Calls</p>
            <p className="text-2xl font-bold">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
