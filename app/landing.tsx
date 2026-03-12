'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Mic,
  Zap,
  Link as LinkIcon,
  BarChart3,
  ShieldCheck,
  Users,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

import {
  GlassCard,
  Button,
  GradientText,
  FadeInSection,
  ScaleReveal,
  FloatingOrb,
} from '@/components/premium/PremiumUI';

import SystemExecutionPreview from '@/components/landing/SystemExecutionPreview';
import BuilderUIPreview from '@/components/landing/BuilderUIPreview';
import WorkflowExecutionDemo from '@/components/landing/WorkflowExecutionDemo';
import AnalyticsPreview from '@/components/landing/AnalyticsPreview';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white selection:bg-accent-purple/30 font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingOrb size={600} color="#6C63FF" className="-top-40 -left-40 opacity-20" delay={0} />
        <FloatingOrb size={400} color="#00D4FF" className="bottom-0 right-0 opacity-10" delay={2} />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] bg-repeat" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 premium-blur bg-black/20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <motion.div
            className="text-2xl font-bold font-display"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <GradientText>VoiceBuild</GradientText>
          </motion.div>
          <div className="hidden md:flex gap-8">
            {['Product', 'Features', 'Pricing'].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors tracking-wide uppercase"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
          <Link href="/login">
            <Button variant="outline" size="sm" className="px-5 font-bold uppercase tracking-widest text-[10px]">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-10"
          >
            <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.2em] text-white/50 uppercase">The AI Operating System</span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-display font-extrabold tracking-tight mb-8 leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Conversational AI
            <br />
            <GradientText className="text-gradient">Engineered to Perfection.</GradientText>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/60 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Deploy high-performance, intelligent voice agents with a world-class visual builder. Built for scalability, styled for excellence.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link href="/dashboard">
              <Button size="lg" className="rounded-2xl group px-10 h-16 text-lg tracking-wide shadow-glow-purple">
                Start Building Now
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="rounded-2xl px-10 h-16 text-lg tracking-wide border-white/5 hover:border-white/20">
              Watch Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="relative py-40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <FadeInSection className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-display font-extrabold mb-6 tracking-tight">
              Built for <GradientText className="text-gradient">Performance</GradientText>
            </h2>
            <p className="text-white/50 text-xl max-w-2xl mx-auto font-light">
              A comprehensive suite of tools designed to help you deploy intelligent voice agents at scale.
            </p>
          </FadeInSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <ScaleReveal key={i} delay={i * 0.1}>
                <GlassCard
                  variant="medium"
                  className="p-10 h-full group transition-all duration-500 hover:border-accent-purple/50 border-white/5"
                  hover
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-accent-purple/10 transition-all duration-500">
                    <feature.icon className="w-6 h-6 text-white group-hover:text-accent-purple transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-white/40 leading-relaxed text-lg font-light">{feature.description}</p>
                </GlassCard>
              </ScaleReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Execution Demo (Replaces abstract scenario) */}
      <WorkflowExecutionDemo />

      {/* Builder UI Preview (Replaces diagram-style builder) */}
      <BuilderUIPreview />

      {/* System Execution Preview (Replaces pipeline diagram) */}
      <SystemExecutionPreview />

      {/* Analytics Preview (Replaces static loading block) */}
      <AnalyticsPreview />

      {/* Pricing Section */}
      <section id="pricing" className="relative py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeInSection className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-display font-extrabold mb-6 tracking-tight">
              Engineered for <GradientText className="text-gradient">Scale.</GradientText>
            </h2>
            <p className="text-white/50 text-xl max-w-2xl mx-auto font-light">
              Simple, high-scale pricing tailored for professional AI teams.
            </p>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <ScaleReveal key={i} delay={i * 0.1}>
                <GlassCard
                  variant={plan.featured ? 'strong' : 'medium'}
                  className={`p-10 relative overflow-hidden group border-white/5 ${plan.featured ? 'ring-1 ring-accent-purple/50' : ''}`}
                  hover
                >
                  {plan.featured && (
                    <div className="absolute top-0 right-0 bg-accent-purple text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2 uppercase tracking-widest text-white/60">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-10">
                    <span className="text-6xl font-display font-extrabold text-white">${plan.price}</span>
                    <span className="text-white/40 font-medium">/mo</span>
                  </div>
                  <ul className="space-y-6 mb-12">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="text-white/60 flex items-center gap-4">
                        <div className="w-5 h-5 rounded-full bg-accent-purple/10 flex items-center justify-center flex-shrink-0">
                          <Zap className="text-accent-purple w-3 h-3 fill-accent-purple" />
                        </div>
                        <span className="text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={plan.featured ? 'primary' : 'secondary'} 
                    className={`w-full h-14 font-bold uppercase tracking-widest text-[11px] ${!plan.featured ? 'border-white/5 hover:bg-white/5' : ''}`}
                  >
                    Select Plan
                  </Button>
                </GlassCard>
              </ScaleReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Centered CTA Section */}
      <section className="py-40 px-6">
         <div className="max-w-5xl mx-auto">
            <GlassCard className="p-24 text-center relative overflow-hidden border-accent-purple/20 bg-accent-purple/[0.03]">
               <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 to-transparent opacity-50" />
               <div className="relative z-10 space-y-10 max-w-2xl mx-auto items-center flex flex-col">
                  <h2 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight leading-tight">Ready to build?</h2>
                  <p className="text-white/40 text-xl font-light leading-relaxed">
                     Join the future of conversational AI and start shipping production-grade agents in minutes.
                  </p>
                  <div className="flex flex-col items-center gap-6">
                    <Link href="/signup">
                      <Button size="lg" className="h-16 px-12 text-lg font-bold rounded-2xl group shadow-glow-purple relative overflow-hidden">
                         <span className="relative z-10 flex items-center">
                            Get Started for Free
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                         </span>
                         <motion.div 
                           className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" 
                         />
                      </Button>
                    </Link>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">No credit card required • 14-day free trial</p>
                  </div>
               </div>
            </GlassCard>
         </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-20 mb-24">
            <div className="col-span-2">
              <h3 className="text-3xl font-display font-extrabold mb-8"><GradientText>VoiceBuild</GradientText></h3>
              <p className="text-white/40 text-lg max-w-sm font-light">
                The most advanced platform for building next-generation conversational AI experiences.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-[10px]">Product</h4>
              <ul className="space-y-4 text-white/40 text-[13px] font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Builder</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-[10px]">Company</h4>
              <ul className="space-y-4 text-white/40 text-[13px] font-medium">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
             <p className="text-white/20 text-[10px] tracking-[0.3em] uppercase font-bold">© 2026 VoiceBuild OS. Visual Excellence Guaranteed.</p>
             <div className="flex gap-10">
                {['Twitter', 'GitHub', 'LinkedIn'].map(social => (
                  <a key={social} href="#" className="text-white/20 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-[0.2em]">{social}</a>
                ))}
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  { icon: Mic, title: 'Voice Intelligence', description: 'Advanced speech processing powered by world-class AI models.' },
  { icon: Zap, title: 'Lightning Fast', description: 'Real-time inference and deployment at the edge for zero latency.' },
  { icon: LinkIcon, title: 'Deep Integrations', description: 'Connect seamlessly with your existing enterprise stack and data.' },
  { icon: BarChart3, title: 'Rich Analytics', description: 'Comprehensive insights into every interaction and performance metric.' },
  { icon: ShieldCheck, title: 'Enterprise Ready', description: 'Military-grade security and SOC2 compliance built-in.' },
  { icon: Users, title: 'Team Scale', description: 'Collaborative workspaces designed for high-velocity development.' },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '49',
    featured: false,
    features: ['3 Intelligent Agents', '5,000 monthly minutes', 'Core API access', 'Community support'],
  },
  {
    name: 'Business',
    price: '199',
    featured: true,
    features: ['Unlimited Agents', '50,000 monthly minutes', 'Priority GPU nodes', 'Dedicated support', 'Custom knowledge bases'],
  },
  {
    name: 'Enterprise',
    price: '999',
    featured: false,
    features: ['Infinite scalability', 'Unlimited everything', 'On-premise deployment', '24/7 dedicated engineering team'],
  },
];
