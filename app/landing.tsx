'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  GlassCard,
  Button,
  GradientText,
  FadeInSection,
  ScaleReveal,
  FloatingOrb,
  ParallaxSection,
} from '@/components/premium/PremiumUI';

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white selection:bg-accent-purple/30">
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
            className="text-2xl font-bold"
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
                className="text-white/70 hover:text-white transition-colors"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
          <Link href="/login">
            <Button variant="outline" size="sm">
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
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-sm font-medium tracking-wide text-white/70 uppercase">Next-Gen AI Voice Agents</span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Build The Future of
            <br />
            <GradientText className="text-gradient">Conversational AI</GradientText>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/60 mb-12 max-w-3xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            A powerful, visual building experience designed for products that demand visual excellence and high performance.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link href="/dashboard">
              <Button size="lg" className="rounded-2xl group">
                Deploy Your Agent
                <motion.span 
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </Button>
            </Link>
            <Button variant="secondary" size="lg" className="rounded-2xl">
              Watch Demo Video
            </Button>
          </motion.div>
        </div>
        {/* Hero Section Content Ends */}
      </section>

      {/* Hero Preview Section (Separate or properly nested) */}
      <section className="relative h-[600px] overflow-hidden -mt-20">
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-5xl pointer-events-none"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <ParallaxSection offset={80}>
            <GlassCard variant="medium" className="p-8 aspect-video bg-gradient-to-br from-white/10 to-white/5 relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('/dashboard-preview.png')] bg-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-transparent" />
            </GlassCard>
          </ParallaxSection>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <FadeInSection className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Built for <GradientText className="text-gradient">Performance</GradientText>
            </h2>
            <p className="text-white/60 text-xl max-w-2xl mx-auto">
              A suite of tools designed to help you build, deploy, and scale intelligent voice agents with ease.
            </p>
          </FadeInSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <ScaleReveal key={i} delay={i * 0.1}>
                <GlassCard
                  variant="medium"
                  className="p-10 h-full group transition-all duration-500 hover:border-accent-purple/50"
                  hover
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent-purple/10 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-white/50 leading-relaxed text-lg">{feature.description}</p>
                </GlassCard>
              </ScaleReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Builder Preview Section */}
      <section id="builder" className="relative py-32 px-6 overflow-hidden bg-[#0F0F1A]/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <FadeInSection>
              <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight leading-tight">
                Visual Logic.
                <br />
                <GradientText className="text-gradient">Zero Friction.</GradientText>
              </h2>
              <p className="text-white/60 mb-10 text-xl leading-relaxed">
                Our node-based builder gives you total control over the conversation flow. Connect your data, define your logic, and deploy in seconds.
              </p>
              <div className="space-y-6">
                {[
                  { title: 'Infinite Canvas', desc: 'Build complex flows without limits.' },
                  { title: 'AI Orchestration', desc: 'Seamlessly integrate LLMs and tools.' },
                  { title: 'Real-time Debugging', desc: 'Watch your agent work as you build.' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-5"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="mt-1 w-6 h-6 rounded-full bg-accent-cyan/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-accent-cyan" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{item.title}</h4>
                      <p className="text-white/40">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeInSection>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, type: 'spring' }}
              className="perspective-1000"
            >
              <GlassCard variant="strong" className="aspect-video p-1 bg-gradient-to-br from-white/10 to-transparent relative overflow-hidden ring-1 ring-white/20">
                <div className="w-full h-full bg-[#0B0B0F] rounded-[14px] flex items-center justify-center group">
                  <div className="absolute inset-0 bg-gradient-to-t from-accent-purple/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="text-center relative z-10">
                    <motion.div 
                      className="w-20 h-20 rounded-3xl bg-accent-purple/20 flex items-center justify-center text-4xl mb-4 mx-auto"
                      animate={{ 
                        boxShadow: ['0 0 0px rgba(108,99,255,0)', '0 0 40px rgba(108,99,255,0.4)', '0 0 0px rgba(108,99,255,0)'] 
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      🎨
                    </motion.div>
                    <p className="text-white font-bold tracking-widest uppercase text-sm">Interactive Builder Preview</p>
                    <div className="mt-8 flex justify-center gap-3">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-12 h-1 bg-white/10 rounded-full" />
                       ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeInSection className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Scale Your <GradientText className="text-gradient">Operations</GradientText>
            </h2>
            <p className="text-white/60 text-xl max-w-2xl mx-auto">
              Simple, high-scale pricing tailored for modern AI teams.
            </p>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <ScaleReveal key={i} delay={i * 0.1}>
                <GlassCard
                  variant={plan.featured ? 'strong' : 'medium'}
                  className={`p-10 relative overflow-hidden group ${plan.featured ? 'ring-2 ring-accent-purple/50' : ''}`}
                  hover
                >
                  {plan.featured && (
                    <div className="absolute top-0 right-0 bg-accent-purple text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-5xl font-extrabold text-white">${plan.price}</span>
                    <span className="text-white/40 font-medium">/month</span>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="text-white/70 flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent-purple/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-accent-purple text-xs">✓</span>
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.featured ? 'primary' : 'secondary'} className="w-full py-4 text-sm font-bold uppercase tracking-widest">
                    Start Building Now
                  </Button>
                </GlassCard>
              </ScaleReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-20 mb-20">
            <div className="col-span-2">
              <h3 className="text-3xl font-extrabold mb-8"><GradientText className="text-gradient">VoiceBuild</GradientText></h3>
              <p className="text-white/40 text-lg max-w-sm">
                The most advanced platform for building next-generation conversational AI experiences.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Product</h4>
              <ul className="space-y-4 text-white/40 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Builder</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Company</h4>
              <ul className="space-y-4 text-white/40 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-white/20 text-xs tracking-widest uppercase font-medium">© 2026 VoiceBuild OS. Built for visual excellence.</p>
             <div className="flex gap-8">
                {['Twitter', 'GitHub', 'Discord'].map(social => (
                  <a key={social} href="#" className="text-white/20 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">{social}</a>
                ))}
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  { icon: '🎤', title: 'Voice Intelligence', description: 'Natural language understanding powered by advanced AI' },
  { icon: '⚡', title: 'Lightning Fast', description: 'Deploy agents in seconds, scale instantly' },
  { icon: '🔗', title: 'Integrations', description: 'Connect to your favorite tools and platforms' },
  { icon: '📊', title: 'Analytics', description: 'Real-time insights into agent performance' },
  { icon: '🛡️', title: 'Enterprise Ready', description: 'Security, compliance, and reliability' },
  { icon: '🤝', title: 'Team Collaboration', description: 'Build together with your team' },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '29',
    featured: false,
    features: ['Up to 3 agents', '1,000 calls/month', 'Basic analytics', 'Email support'],
  },
  {
    name: 'Pro',
    price: '99',
    featured: true,
    features: ['Unlimited agents', '100,000 calls/month', 'Advanced analytics', 'Priority support', 'API access'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    featured: false,
    features: ['Custom limits', 'Dedicated support', 'SLA guarantee', 'Custom integrations'],
  },
];
