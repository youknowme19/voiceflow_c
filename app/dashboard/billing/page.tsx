"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FadeInSection, GlassCard, GradientText } from "@/components/premium/PremiumUI";

const plans = [
  { id: "starter", name: "Starter", price: "Free", credits: 1000, agents: 2, features: ["Basic builder", "Limited API calls", "Community support"], color: "from-blue-500/20" },
  { id: "pro", name: "Pro", price: "$60", credits: 10000, agents: 20, features: ["Advanced builder", "Priority support", "Analytics", "Team members"], color: "from-accent-purple/20" },
  { id: "business", name: "Business", price: "$150", credits: 30000, agents: "Unlimited", features: ["Everything in Pro", "Dedicated support", "Custom integrations", "Advanced analytics"], color: "from-accent-cyan/20" },
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadUserInfo();
    fetchStats();
  }, []);

  const loadUserInfo = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (user.user) {
      setUserEmail(user.user.email || "");
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("plan_id")
        .eq("user_id", user.user.id)
        .single();
      setCurrentPlan(subscription?.plan_id || "starter");
    }
  };

  const fetchStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubscribe = async (planId: string) => {
    if (planId === "starter") {
      setMessage({ type: "success", text: "You are already on the Starter plan" });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch("/api/billing/create-checkout-session", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ planId, userEmail }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage({ type: "error", text: data.error || "Failed to create checkout" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 p-6 pb-20">
      <FadeInSection>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              Billing & <GradientText className="text-gradient">Plans</GradientText>
            </h1>
            <p className="text-white/40 text-lg">Scale your AI operations with the right plan.</p>
          </div>
          <GlassCard className="px-6 py-3 border-accent-purple/30 bg-accent-purple/5">
             <span className="text-xs font-bold uppercase tracking-widest text-accent-purple">Current: {currentPlan?.toUpperCase()}</span>
          </GlassCard>
        </div>
      </FadeInSection>

      {message && (
        <FadeInSection>
          <div className={`p-4 rounded-xl border ${message.type === "success" ? "bg-green-500/10 border-green-500/50 text-green-400" : "bg-red-500/10 border-red-500/50 text-red-400"}`}>
            {message.text}
          </div>
        </FadeInSection>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <FadeInSection key={plan.id} delay={i * 0.1}>
            <GlassCard 
              variant="medium" 
              className={`p-8 h-full border-white/5 bg-gradient-to-b ${plan.color} to-transparent relative overflow-hidden group hover:border-white/20 transition-all`}
            >
              {currentPlan === plan.id && (
                <div className="absolute top-0 right-0 bg-accent-purple text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Active</div>
              )}
              
              <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                {plan.id !== 'starter' && <span className="text-white/40 text-sm">/month</span>}
              </div>
              
              <p className="text-white/60 text-sm mb-8">
                {plan.credits.toLocaleString()} AI Credits included
              </p>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm text-white/80">
                    <span className="text-accent-cyan flex-shrink-0 mt-1">✦</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading || currentPlan === plan.id}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${
                  currentPlan === plan.id 
                    ? "bg-white/5 text-white/40 cursor-default" 
                    : "bg-white text-black hover:bg-gray-100 shadow-lg active:scale-95"
                }`}
              >
                {loading ? "..." : currentPlan === plan.id ? "Current Plan" : "Upgrade Now"}
              </button>
            </GlassCard>
          </FadeInSection>
        ))}
      </div>

      <FadeInSection delay={0.4}>
        <GlassCard variant="medium" className="p-8 border-white/5 bg-white/[0.02]">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <span className="w-2 h-6 bg-accent-purple rounded-full" />
            Live Usage Dashboard
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-2">Agents Created</p>
              <p className="text-4xl font-extrabold">{stats?.activeAgents ?? '0'}</p>
              <div className="mt-2 text-[10px] text-white/20">AGENT LIMIT REACHED: 0%</div>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-2">Total API Requests</p>
              <p className="text-4xl font-extrabold">{stats?.totalCalls ?? '0'}</p>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-2">Credits Remaining</p>
              <p className="text-4xl font-extrabold text-accent-cyan">{stats?.credits?.toLocaleString() ?? '1,000'}</p>
            </div>
          </div>
        </GlassCard>
      </FadeInSection>
    </div>
  );
}
