export const themeTokens = {
  colors: {
    brand: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
    },
    accent: '#F97316',
    background: '#fafaf9',
    surface: '#ffffff',
    textPrimary: '#292524',
    textMuted: '#78716c',
    border: '#e7e5e4',
  },
  gradients: {
    headerPrimary: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    panelDark: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
    softSurface: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontSize: '1.5rem', fontWeight: 700 },
    h2: { fontSize: '1.125rem', fontWeight: 600 },
    body1: { fontSize: '0.875rem', fontWeight: 400 },
    body2: { fontSize: '0.75rem', fontWeight: 400 },
  },
  radius: { md: '12px', lg: '16px' },
};

export default themeTokens;