"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { tokens, glassStyles, gradients } from '@/lib/design-tokens';

// Glass Card Component
export const GlassCard = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    variant?: 'light' | 'medium' | 'strong';
    className?: string;
    hover?: boolean;
  }
>(({ children, variant = 'light', className = '', hover = false }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={`
        rounded-[24px] backdrop-blur-2xl border
        glass-card
        ${variant === 'strong' ? 'glass-card-strong' : ''}
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      whileHover={hover ? { y: -8, scale: 1.02, boxShadow: '0 40px 80px rgba(0,0,0,0.5)' } : {}}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded-[24px]" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
});
GlassCard.displayName = 'GlassCard';

// Premium Button Component
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', className = '', disabled = false, onClick }, ref) => {
    const sizeStyles = {
      sm: `px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest`,
      md: `px-8 py-4 text-sm font-bold uppercase tracking-[0.15em]`,
      lg: `px-12 py-6 text-lg font-bold tracking-tight`,
    };

    const variantStyles = {
      primary: `
        bg-white text-black border-none
        hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)]
      `,
      secondary: `
        bg-white/5 border border-white/10
        text-white hover:bg-white/10
      `,
      ghost: `
        text-white hover:bg-white/5
      `,
      outline: `
        border border-white/20 text-white
        hover:bg-white/5 hover:border-white/40
      `,
    };

    return (
      <motion.button
        ref={ref}
        className={`
          rounded-[18px] transition-all duration-300
          flex items-center justify-center gap-3
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${className}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
        `}
        whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

// Animated Gradient Text
export const GradientText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span
    className={`bg-gradient-to-r from-accent-purple via-accent-cyan to-accent-pink bg-clip-text text-transparent ${className}`}
  >
    {children}
  </span>
);

// Cinematic Reveal Component
export const Reveal = ({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}) => {
  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        duration: 1.2, 
        delay, 
        ease: [0.16, 1, 0.3, 1] // Apple-style quint ease-out
      }}
    >
      {children}
    </motion.div>
  );
};

// Fade In Animation Wrapper
export const FadeInSection = ({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <Reveal delay={delay} className={className}>
    {children}
  </Reveal>
);

// Scale Reveal Animation Wrapper
export const ScaleReveal = ({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
    whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ 
      duration: 1, 
      delay, 
      ease: [0.16, 1, 0.3, 1]
    }}
  >
    {children}
  </motion.div>
);

// Parallax Wrapper
export const ParallaxSection = ({
  children,
  offset = 50,
  className = '',
}: {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}) => {
  const [y, setY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setY(window.scrollY * 0.5);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div
      className={className}
      style={{ y }}
      transition={{ type: 'spring', stiffness: 100, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

// Floating Gradient Orb
export const FloatingOrb = ({ 
  size = 300, 
  color = '#6C63FF',
  className = '',
  delay = 0,
}: { 
  size?: number; 
  color?: string; 
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={`rounded-full absolute blur-3xl pointer-events-none ${className}`}
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color}, transparent)`,
      opacity: 0.3,
    }}
    animate={{ y: [0, 30, 0] }}
    transition={{
      duration: 6,
      repeat: Infinity,
      delay,
      ease: 'easeInOut',
    }}
  />
);

// Glowing Border Card
export const GlowingCard = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    className={`relative rounded-lg overflow-hidden ${className}`}
    whileHover={{ boxShadow: tokens.shadows.glow }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-[#6C63FF] to-[#00D4FF] opacity-0 group-hover:opacity-10 transition-opacity" />
    <div className="relative">{children}</div>
  </motion.div>
);

// Voice Waveform Animation
export const Waveform = ({ className = '' }: { className?: string }) => (
  <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-cyan/5 to-transparent blur-[120px] opacity-20" />
    
    {/* Floating Signal Particles */}
    <div className="absolute inset-0">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent-cyan/40 shadow-[0_0_8px_#00D4FF]"
          initial={{ x: "-10%", y: `${20 + i * 15}%`, opacity: 0 }}
          animate={{ 
            x: "110%", 
            opacity: [0, 0.8, 0.8, 0],
            y: [`${20 + i * 15}%`, `${25 + i * 15}%`, `${20 + i * 15}%`]
          }}
          transition={{ 
            duration: 15 + i * 2, 
            repeat: Infinity, 
            delay: i * 3, 
            ease: "linear" 
          }}
        />
      ))}
    </div>

    <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
      <motion.path
        d="M0,50 Q250,20 500,50 T1000,50"
        fill="none"
        stroke="url(#waveform-gradient)"
        strokeWidth="1.5"
        animate={{
          d: [
            "M0,50 Q250,20 500,50 T1000,50",
            "M0,50 Q250,80 500,50 T1000,50",
            "M0,50 Q250,20 500,50 T1000,50",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Light Trail 1 */}
      <motion.circle r="1" fill="#fff" className="shadow-[0_0_12px_#fff]">
        <animateMotion
          dur="8s"
          repeatCount="indefinite"
          path="M0,50 Q250,20 500,50 T1000,50"
        />
      </motion.circle>

      <motion.path
        d="M0,50 Q250,80 500,50 T1000,50"
        fill="none"
        stroke="url(#waveform-gradient-2)"
        strokeWidth="1"
        style={{ opacity: 0.5 }}
        animate={{
          d: [
            "M0,50 Q250,80 500,50 T1000,50",
            "M0,50 Q250,20 500,50 T1000,50",
            "M0,50 Q250,80 500,50 T1000,50",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      {/* Light Trail 2 */}
      <motion.circle r="0.8" fill="#00D4FF" className="shadow-[0_0_8px_#00D4FF]">
        <animateMotion
          dur="12s"
          repeatCount="indefinite"
          path="M0,50 Q250,80 500,50 T1000,50"
          begin="2s"
        />
      </motion.circle>
      <defs>
        <linearGradient id="waveform-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6C63FF" stopOpacity="0" />
          <stop offset="25%" stopColor="#6C63FF" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#00D4FF" stopOpacity="1" />
          <stop offset="75%" stopColor="#FF6B9D" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF6B9D" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="waveform-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0" />
          <stop offset="50%" stopColor="#6C63FF" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);
