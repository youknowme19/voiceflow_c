'use client';

import React from 'react';
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion';
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
  Activity,
  Bot,
  Database,
  Globe,
  CheckCircle2,
  MousePointer2,
  Play,
} from 'lucide-react';

import {
  GlassCard,
  Button,
  GradientText,
  Reveal,
  FadeInSection,
  ScaleReveal,
  FloatingOrb,
  Waveform,
} from '@/components/premium/PremiumUI';


import SystemExecutionPreview from '@/components/landing/SystemExecutionPreview';
import BuilderUIPreview from '@/components/landing/BuilderUIPreview';
import WorkflowExecutionDemo from '@/components/landing/WorkflowExecutionDemo';
import AnalyticsPreview from '@/components/landing/AnalyticsPreview';

const LiveWorkflowDemo = ({ showBackground = true }: { showBackground?: boolean }) => {
  const containerRef = React.useRef(null);
  const isInView = useInView(containerRef, { amount: 0.3 });
  const [stage, setStage] = React.useState(0);

  React.useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    if (isInView) {
      setStage(0);
      timers = [
        setTimeout(() => setStage(1), 500),  // Phone Slide Up
        setTimeout(() => setStage(2), 1500), // Touch Indicator Tap
        setTimeout(() => setStage(3), 2000), // Recording Starts (Waveform)
        setTimeout(() => setStage(4), 4000), // Signal Flow Starts (Pulse Out)
        setTimeout(() => setStage(5), 5000), // Voice Note Appears
        setTimeout(() => setStage(6), 5800), // Transcription Typing
        setTimeout(() => setStage(7), 7500), // AI Processing (Pipeline Glows)
        setTimeout(() => setStage(8), 9000), // Final AI Response
      ];
    }
    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <div ref={containerRef} className="relative w-full max-w-[540px] min-h-[750px] flex items-center justify-center pt-20">
      
      {/* Subtle Background Pipeline */}
      {showBackground && (
        <div className="absolute inset-0 flex flex-col justify-center gap-12 pointer-events-none opacity-40">
        {[
          { label: 'AI Reasoning', stage: 7, color: '#6C63FF', icon: Bot },
          { label: 'Knowledge Lookup', stage: 7, color: '#00D4FF', icon: Database },
          { label: 'API Sync', stage: 7, color: '#FF6B9D', icon: Globe }
        ].map((node) => (
          <motion.div
            key={node.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: stage >= node.stage ? 1 : 0.05,
              x: stage === node.stage ? -40 : 20,
              borderColor: stage === node.stage ? node.color : 'rgba(255,255,255,0.05)',
              boxShadow: stage === node.stage ? `0 0 40px ${node.color}33` : 'none'
            }}
            className="w-40 bg-white/[0.01] border border-white/5 rounded-xl p-3 flex items-center gap-3 ml-auto mr-10 relative z-0 backdrop-blur-sm"
          >
            <node.icon className="w-4 h-4" style={{ color: node.color }} />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{node.label}</span>
          </motion.div>
        ))}
      </div>
      )}

      {/* Signal Flow Pulse */}
      {stage >= 4 && stage < 6 && (
        <motion.div
           initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
           animate={{ 
             x: [0, 200, 0],
             y: [0, -100, 0],
             opacity: [0, 1, 0.5, 0],
             scale: [0.5, 1.2, 0.8]
           }}
           transition={{ duration: 2, ease: "easeInOut" }}
           className="absolute z-20 w-4 h-4 rounded-full bg-accent-cyan shadow-[0_0_30px_#00D4FF] blur-sm"
        />
      )}

      {/* Phone Container */}
      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-[300px] h-[580px]"
      >
        {/* Phone Frame */}
        <div className="relative w-full h-full bg-[#070709] rounded-[54px] border-[12px] border-[#1A1A24] shadow-[0_50px_120px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="h-16 px-6 border-b border-white/5 flex items-center gap-3 bg-white/[0.02] pt-4">
             <div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-accent-purple" />
             </div>
             <div>
                <p className="text-[11px] font-bold text-white tracking-tight">VoiceBuild Assistant</p>
                <div className="flex items-center gap-1">
                   <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Online</p>
                </div>
             </div>
          </div>

          {/* Chat Canvas */}
          <div className="flex-1 p-5 flex flex-col gap-4 overflow-hidden">
             <AnimatePresence mode="popLayout">
               {stage === 3 && (
                 <motion.div 
                   key="recording-state"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-2xl border border-white/10"
                 >
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                     <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Recording...</span>
                   </div>
                   <div className="flex items-end gap-1 h-8">
                     {[0.4, 0.8, 0.5, 0.9, 0.6, 0.8, 0.4].map((h, i) => (
                       <motion.div
                         key={i}
                         animate={{ height: ['20%', (h * 100) + '%', '20%'] }}
                         transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                         className="w-1 bg-accent-cyan rounded-full"
                       />
                     ))}
                   </div>
                 </motion.div>
               )}

               {stage >= 5 && (
                 <motion.div 
                   key="chat-voice-msg"
                   initial={{ opacity: 0, x: 20, scale: 0.9 }}
                   animate={{ opacity: 1, x: 0, scale: 1 }}
                   className="self-end bg-white text-black p-3 pr-6 rounded-2xl rounded-tr-none flex items-center gap-3 shadow-xl"
                 >
                    <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                       <Play className="w-3 h-3 fill-black text-black ml-0.5" />
                    </div>
                    <div className="flex-1">
                       <div className="h-1 w-20 bg-black/10 rounded-full overflow-hidden">
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: '100%' }}
                             transition={{ duration: 2 }}
                             className="h-full bg-black/40"
                          />
                       </div>
                       <p className="text-[9px] font-bold mt-1 opacity-40 uppercase">Voice Message 0:05</p>
                    </div>
                 </motion.div>
               )}

               {stage >= 6 && (
                 <motion.div 
                   key="chat-transcript"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="self-end flex flex-col items-end gap-1"
                 >
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest pr-1">Transcript</span>
                    <div className="bg-white/5 border border-white/10 p-3 rounded-xl rounded-tr-none text-[11px] text-white/80 font-medium">
                       <motion.span
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         transition={{ duration: 0.05, staggerChildren: 0.05 }}
                       >
                         {"Where is my order?".split("").map((char, i) => (
                           <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                             {char}
                           </motion.span>
                         ))}
                       </motion.span>
                    </div>
                 </motion.div>
               )}

               {stage >= 8 && (
                 <motion.div 
                   key="chat-ai-res"
                   initial={{ opacity: 0, y: 15, scale: 0.95 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   className="self-start max-w-[90%] glass-card p-4 rounded-2xl rounded-tl-none text-[12px] text-white/80 leading-relaxed shadow-lg border-accent-purple/20"
                 >
                   Your order is in transit.
                   <span className="block mt-2 text-accent-cyan font-bold">Estimated arrival: Tuesday.</span>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          {/* Input Bar */}
          <div className="p-4 flex items-center gap-2">
             <div className="flex-1 h-11 bg-white/[0.03] border border-white/5 rounded-full px-4 flex items-center">
                <span className="text-[11px] text-white/20 font-medium tracking-tight">Type a message...</span>
             </div>
             <div className="relative">
                <AnimatePresence>
                   {stage === 2 && (
                     <motion.div
                       key="touch-indicator"
                       initial={{ scale: 0, opacity: 0 }}
                       animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
                       transition={{ duration: 0.6 }}
                       className="absolute -top-1 -left-1 w-13 h-13 bg-white/40 rounded-full blur-sm z-30"
                     />
                   )}
                </AnimatePresence>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${stage === 3 ? 'bg-accent-cyan shadow-[0_0_20px_#00D4FF] scale-95' : 'bg-white/5 border border-white/10'}`}>
                   <Mic className={`w-5 h-5 ${stage === 3 ? 'text-black' : 'text-white/30'}`} />
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

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
      <section className="relative min-h-[90vh] flex items-center px-6 pt-32 pb-20 overflow-hidden">
        {/* Waveform Background */}
        <Waveform className="opacity-40" />
        
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left: Content */}
          <div className="text-left space-y-8 max-w-2xl">
            <Reveal delay={0.1} direction="up" className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10">
              <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_10px_rgba(0,212,255,0.5)] animate-pulse" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-white/50 uppercase">The Future of AI Architecture</span>
            </Reveal>

            <Reveal delay={0.3} direction="up">
              <h1 className="text-5xl md:text-[56px] font-display font-extrabold tracking-tight leading-[1.05] text-white">
                The AI Operating System
                <br />
                <span className="text-gradient">for Enterprise.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.5} direction="up">
              <p className="text-base md:text-lg text-white/40 font-light leading-relaxed max-w-lg">
                Deploy high-performance, intelligent voice agents with a world-class visual builder. Built for scalability, styled for excellence.
              </p>
            </Reveal>

            <Reveal delay={0.7} direction="up" className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/dashboard">
                <Button size="md" className="h-14 px-8 group relative overflow-hidden">
                  <span className="relative z-10">Start Building</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="md" className="h-14 px-8">
                Book a Demo
              </Button>
            </Reveal>
          </div>

          {/* Right: Interactive Phone Demo */}
          <div className="hidden lg:flex justify-end items-center relative translate-y-16">
            <LiveWorkflowDemo showBackground={false} />
          </div>
        </div>
      </section>


      {/* Feature Grid */}
      <section id="features" className="relative py-40 px-6">
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

      {/* Live Workflow Demo - Dedicated Section */}
      <section className="relative py-40 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <FadeInSection className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-display font-extrabold mb-6 tracking-tight">
              A New Era of <GradientText className="text-gradient">Interaction.</GradientText>
            </h2>
            <p className="text-white/50 text-xl max-w-2xl mx-auto font-light">
              See how VoiceBuild turns complex voice requests into structured reasoning and instant action.
            </p>
          </FadeInSection>
          <LiveWorkflowDemo showBackground={true} />
        </div>
      </section>

      {/* Product Cadence - Alternating Rhythm */}
      <div className="space-y-0 pt-20">
        <WorkflowExecutionDemo /> {/* Rhythm A: Visual Left / Text Right */}
        <BuilderUIPreview />      {/* I will adjust this to Rhythm B (Text Left / Visual Right) */}
        <SystemExecutionPreview /> {/* Rhythm A: Visual Left / Text Right */}
        <AnalyticsPreview />      {/* Rhythm B (Text Left / Visual Right) */}
      </div>

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
