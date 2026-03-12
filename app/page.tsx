'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [isDark, setIsDark] = useState(true);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
        {/* Header */}
        <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              VoiceBuild
            </motion.div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-blue-600 transition">Features</a>
              <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
              <a href="#testimonials" className="hover:text-blue-600 transition">Testimonials</a>
            </nav>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <Link href="/login" className="hover:text-blue-600">Sign In</Link>
              <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto max-w-4xl text-center space-y-8">
            <motion.h1
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="text-5xl md:text-7xl font-extrabold leading-tight"
            >
              The Operating System for{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Agents
              </span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 dark:text-gray-300"
            >
              Build, test, deploy, and monitor intelligent AI agents with a visual flow builder, multi-channel deployment, and powerful analytics.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105">
                Start Free Trial
              </Link>
              <Link href="#features" className="border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 px-8 py-4 rounded-lg text-lg font-semibold transition">
                Learn More
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto max-w-5xl">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Powerful Features
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: "🎨", title: "Visual Builder", desc: "Drag-and-drop workflow design with intuitive node system" },
                { icon: "🤖", title: "AI Integration", desc: "Powered by OpenRouter with support for multiple LLMs" },
                { icon: "📊", title: "Analytics", desc: "Real-time metrics and conversation tracking" },
                { icon: "🔗", title: "API Integrations", desc: "Connect to any external API and webhook" },
                { icon: "🚀", title: "Multi-Channel", desc: "Deploy as chat widget, REST API, and more" },
                { icon: "👥", title: "Team Collaboration", desc: "Build and manage teams with role-based access" },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Simple, Transparent Pricing
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Starter", price: "Free", credits: "1,000/mo", features: ["2 Agents", "Basic Builder", "Community Support"] },
                { name: "Pro", price: "$60", credits: "10,000/mo", features: ["20 Agents", "Advanced Builder", "Priority Support", "Team Members"], highlight: true },
                { name: "Business", price: "$150", credits: "30,000/mo", features: ["Unlimited Agents", "Everything in Pro", "Dedicated Support", "Custom Integrations"] },
              ].map((plan, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-8 rounded-xl border-2 transition ${
                    plan.highlight
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/30 scale-105"
                      : "border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold mb-1">{plan.price}<span className="text-lg text-gray-500">/mo</span></div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.credits} AI credits</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="text-green-600">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-lg font-semibold transition ${
                    plan.highlight
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                  }`}>
                    Get Started
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 px-4 bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto max-w-5xl">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-4xl font-bold text-center mb-16"
            >
              Loved by Teams
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Sarah Chen", company: "TechStartup Inc", text: "VoiceBuild transformed how we deploy AI. Built our support bot in hours." },
                { name: "Marcus Johnson", company: "Digital Agency", text: "The visual builder is intuitive. Our team can create agents without coding." },
                { name: "Elena Rodriguez", company: "Enterprise Corp", text: "Excellent support and powerful features. Worth every penny." },
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <div className="text-yellow-400 mb-3">⭐⭐⭐⭐⭐</div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-2xl text-center space-y-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-bold">Ready to Build AI Agents?</h2>
            <p className="text-lg opacity-90">Join thousands of teams building with VoiceBuild</p>
            <Link href="/signup" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition">
              Start Free Today
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 py-8 px-4">
          <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
            <p>© 2024 VoiceBuild. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
