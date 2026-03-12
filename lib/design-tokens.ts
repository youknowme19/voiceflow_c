// Design System & Tokens
export const tokens = {
  // Colors - Premium Dark Theme
  colors: {
    background: {
      primary: '#0B0B0F',
      secondary: '#11111A',
      tertiary: '#1A1A24',
      hover: '#1F1F2E',
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.05)',
      medium: 'rgba(255, 255, 255, 0.08)',
      strong: 'rgba(255, 255, 255, 0.12)',
    },
    glassBorder: {
      light: 'rgba(255, 255, 255, 0.08)',
      medium: 'rgba(255, 255, 255, 0.12)',
      strong: 'rgba(255, 255, 255, 0.2)',
    },
    accent: {
      primary: '#6C63FF',    // Purple
      secondary: '#00D4FF',  // Cyan
      tertiary: '#FF6B9D',   // Pink
      success: '#00D084',    // Green
      warning: '#FFB84D',    // Orange
      error: '#FF6B6B',      // Red
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B8B8CC',
      tertiary: '#808099',
      disabled: '#5A5A70',
    },
    border: '#2A2A3E',
  },

  // Spacing - 4px base unit
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
    xxxl: '48px',
  },

  // Typography
  typography: {
    fontFamily: {
      base: 'system-ui, -apple-system, sans-serif',
      display: '"Inter", system-ui, -apple-system, sans-serif',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
      '4xl': '48px',
      '5xl': '64px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
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
