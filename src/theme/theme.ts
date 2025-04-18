import { createTheme } from '@shopify/restyle';

const palette = {
  purplePrimary: '#6200EE',
  purpleLight: '#BB86FC',
  purpleDark: '#3700B3',
  greenSuccess: '#00C851',
  redError: '#ff4444',
  black: '#0B0B0B',
  white: '#F0F2F3',
  lightGrey: '#F8F8F8',
  grey: '#ECECEC',
  darkGrey: '#8A8A8A',
};

const theme = createTheme({
  colors: {
    mainBackground: palette.white,
    cardPrimaryBackground: palette.purpleLight,
    buttonPrimaryBackground: palette.purplePrimary,
    textPrimary: palette.black,
    textSecondary: palette.darkGrey,
    purplePrimary: palette.purplePrimary,
    purpleDark: palette.purpleDark,
    black: palette.black,
    white: palette.white,
    success: palette.greenSuccess,
    error: palette.redError,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      fontWeight: 'bold',
      fontSize: 34,
    },
    title: {
      fontWeight: 'bold',
      fontSize: 28,
    },
    subtitle: {
      fontWeight: '600',
      fontSize: 24,
    },
    body: {
      fontSize: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
    },
  },
});

export type Theme = typeof theme;
export default theme; 