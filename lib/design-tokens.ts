// Design System & Tokens
export const tokens = {
  // Colors - Premium Dark Theme
  colors: {
    background: {
      primary: '#070709',    // Deeper dark
      secondary: '#0B0B0F',
      tertiary: '#0F0F15',
      hover: '#14141C',
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.03)',
      medium: 'rgba(255, 255, 255, 0.05)',
      strong: 'rgba(255, 255, 255, 0.08)',
    },
    glassBorder: {
      light: 'rgba(255, 255, 255, 0.05)',
      medium: 'rgba(255, 255, 255, 0.1)',
      strong: 'rgba(255, 255, 255, 0.15)',
    },
    accent: {
      primary: '#6C63FF',    // Purple
      secondary: '#00D4FF',  // Cyan
      tertiary: '#FF6B9D',   // Pink
      success: '#10B981',    // Emerald 500
      warning: '#F59E0B',    // Amber 500
      error: '#EF4444',      // Red 500
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#94A3B8',  // Slate 400
      tertiary: '#64748B',   // Slate 500
      disabled: '#475569',   // Slate 600
    },
    border: 'rgba(255, 255, 255, 0.06)',
  },

  // Spacing - 4px base unit
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',      // Slightly tighter
    lg: '20px',      // Balanced
    xl: '28px',
    xxl: '48px',
    xxxl: '96px',
    giant: '80px',   // Normalized Section Spacing (down from 160)
  },

  // Typography
  typography: {
    fontFamily: {
      base: '"Inter", system-ui, -apple-system, sans-serif',
      display: '"Geist Sans", "Inter", system-ui, -apple-system, sans-serif',
    },
    fontSize: {
      xs: '12px',    // Smallest labels
      sm: '14px',    // Small labels / meta
      base: '15px',  // Body text
      lg: '18px',    // Subheadings
      xl: '24px',    // Small section headings
      '2xl': '32px', // Section headlines
      '3xl': '48px', // Hero secondary
      '4xl': '56px', // Hero headline max
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.1,
      normal: 1.5,
      relaxed: 1.6,
      loose: 1.8,
    },
  },

  // Shadows - Glassmorphism depth
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
    md: '0 4px 16px rgba(0, 0, 0, 0.2)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.3)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.4)',
    glow: '0 0 20px rgba(108, 99, 255, 0.2)',
    glowCyan: '0 0 20px rgba(0, 212, 255, 0.2)',
    inner: 'inset 0 2px 4px rgba(255, 255, 255, 0.05)',
  },

  // Border Radius
  radius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },

  // Blur values
  blur: {
    sm: 'blur(10px)',
    md: 'blur(20px)',
    lg: 'blur(30px)',
  },

  // Z-Index
  zIndex: {
    hide: '-1',
    base: '0',
    dropdown: '100',
    sticky: '200',
    fixed: '300',
    modal: '400',
    popover: '500',
    tooltip: '600',
  },

  // Transitions
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Glass Morphism Styles
export const glassStyles = {
  light: `
    background: ${tokens.colors.glass.light};
    backdrop-filter: blur(20px);
    border: 1px solid ${tokens.colors.glassBorder.light};
    box-shadow: ${tokens.shadows.inner};
  `,
  medium: `
    background: ${tokens.colors.glass.medium};
    backdrop-filter: blur(20px);
    border: 1px solid ${tokens.colors.glassBorder.medium};
    box-shadow: ${tokens.shadows.md}, ${tokens.shadows.inner};
  `,
  strong: `
    background: ${tokens.colors.glass.strong};
    backdrop-filter: blur(25px);
    border: 1px solid ${tokens.colors.glassBorder.strong};
    box-shadow: ${tokens.shadows.lg}, ${tokens.shadows.inner};
  `,
};

// Gradient Overlays
export const gradients = {
  heroGradient: 'linear-gradient(135deg, #6C63FF 0%, #00D4FF 100%)',
  accentGradient: 'linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%)',
  glowGradient: 'radial-gradient(circle, rgba(108, 99, 255, 0.1) 0%, transparent 70%)',
  darkGradient: 'linear-gradient(180deg, #0B0B0F 0%, #11111A 100%)',
};
