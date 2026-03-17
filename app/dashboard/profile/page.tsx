"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FadeInSection, GlassCard, GradientText } from "@/components/premium/PremiumUI";
import { User, Mail, Shield, Save, CheckCircle2, Phone, Building2, Globe } from "lucide-react";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setEmail(session.user.email || "");
        setName(session.user.user_metadata?.name || "");
        setPhone(session.user.user_metadata?.phone || "");
        setCountryCode(session.user.user_metadata?.country_code || "");
        setCompany(session.user.user_metadata?.company || "");
      }
      setLoading(false);
    }
    getUser();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ 
          name, 
          phone, 
          country_code: countryCode, 
          company 
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized. Please try logging in again.");
        }
        const errorText = await res.text();
        let errorData;
        try { errorData = JSON.parse(errorText); } catch(e) {}
        throw new Error(errorData?.error || errorText || "Failed to update profile");
      }

      const data = await res.json();
      setMessage({ type: 'success', text: "Profile updated successfully!" });
      // Refresh session metadata locally
      await supabase.auth.refreshSession();
      
      // Delay slightly for session persistence then reload to update dashboard greeting
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error("Profile update error:", err);
      setMessage({ type: 'error', text: err.message || "Network error" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-10 text-white/20 animate-pulse">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12 p-6 pb-20">
      <FadeInSection>
        <div className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">
              User <GradientText className="text-gradient">Profile</GradientText>
            </h1>
            <p className="text-white/40 text-lg">Manage your personal information and account settings.</p>
        </div>
      </FadeInSection>

      <div className="grid md:grid-cols-3 gap-8">
        <FadeInSection delay={0.1} className="md:col-span-1">
          <GlassCard className="p-8 text-center bg-accent-purple/5 border-accent-purple/20">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan mx-auto mb-6 flex items-center justify-center text-3xl font-bold border-4 border-white/5 shadow-2xl">
              {name ? name.slice(0, 2).toUpperCase() : email.slice(0, 2).toUpperCase()}
            </div>
            <h3 className="text-xl font-bold mb-1 truncate">{name || 'User'}</h3>
            <p className="text-white/40 text-xs truncate mb-6">{email}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-bold uppercase text-blue-400">
              <Shield size={10} />
              Owner Access
            </div>
          </GlassCard>
        </FadeInSection>

        <FadeInSection delay={0.2} className="md:col-span-2">
          <GlassCard variant="medium" className="p-8">
            <form onSubmit={handleUpdate} className="space-y-6">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                 <span className="w-2 h-6 bg-accent-purple rounded-full" />
                 Account Details
              </h3>

              {message && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${
                  message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {message.type === 'success' && <CheckCircle2 size={16} />}
                  {message.text}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-12 py-3.5 text-sm focus:border-accent-purple outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                <div className="relative opacity-50">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-12 py-3.5 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Country Code</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                      type="text"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-12 py-3.5 text-sm focus:border-accent-purple outline-none transition-all"
                      placeholder="+1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-12 py-3.5 text-sm focus:border-accent-purple outline-none transition-all"
                      placeholder="1234567890"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-12 py-3.5 text-sm focus:border-accent-purple outline-none transition-all"
                    placeholder="Enter your company"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full md:w-auto px-8 py-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 disabled:opacity-50"
                >
                  <Save size={18} />
                  {updating ? "Saving Changes..." : "Save Profile"}
                </button>
              </div>
            </form>
          </GlassCard>
        </FadeInSection>
      </div>
    </div>
  );
}
