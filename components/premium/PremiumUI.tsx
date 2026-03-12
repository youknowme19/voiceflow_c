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
  const variantClasses = {
    light: 'bg-white/5 border-white/10 shadow-glass-sm',
    medium: 'bg-white/8 border-white/15 shadow-glass-md',
    strong: 'bg-white/12 border-white/20 shadow-glass-lg',
  };

  return (
    <motion.div
      ref={ref}
      className={`
        rounded-2xl backdrop-blur-xl border
        ${variantClasses[variant]}
        ${hover ? 'cursor-pointer hover:border-accent-purple/50 transition-colors' : ''}
        ${className}
      `}
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      {children}
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
      sm: `px-4 py-2 text-sm`,
      md: `px-6 py-3 text-base`,
      lg: `px-8 py-4 text-lg font-bold`,
    };

    const variantStyles = {
      primary: `
        bg-gradient-to-r from-accent-purple to-accent-cyan
        text-white border-none
        hover:shadow-glow-purple
      `,
      secondary: `
        bg-white/5 border border-white/10
        text-white hover:bg-white/10
      `,
      ghost: `
        text-white hover:bg-white/5
      `,
      outline: `
        border border-accent-purple text-accent-purple
        hover:bg-accent-purple/10
      `,
    };

    return (
      <motion.button
        ref={ref}
        className={`
          rounded-xl font-medium transition-all duration-300
          flex items-center justify-center gap-2
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${className}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
        `}
        whileHover={!disabled ? { scale: 1.03 } : {}}
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
    className={`bg-gradient-to-r from-[#6C63FF] via-[#00D4FF] to-[#FF6B9D] bg-clip-text text-transparent ${className}`}
  >
    {children}
  </span>
);

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
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
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
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.6, delay }}
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
