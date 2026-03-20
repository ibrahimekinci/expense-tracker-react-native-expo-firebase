export type ThemeName = 'light' | 'dark';

export interface ThemeColorSet {
  background: string;
  text: string;
  tint: string;
  error: string;
  card: string;
  border: string;
  inputBackground: string;
  splash: string;
  login: string;
  signUp: string;
  mainTabs: string;
}

export const Colors: Record<ThemeName, ThemeColorSet> = {
  light: {
    background: '#FFFFFF',
    text: '#2D3436',
    tint: '#0984E3',
    error: '#FF7675',
    card: '#F5F5F5',
    border: '#DDDDDD',
    inputBackground: '#F5F6FA',
    splash: '#00B894',
    login: '#0984E3',
    signUp: '#B2BEC3',
    mainTabs: '#D63031',
  },
  dark: {
    background: '#2D3436',
    text: '#DFE6E9',
    tint: '#74B9FF',
    error: '#D63031',
    card: '#15181B',
    border: '#33373D',
    inputBackground: '#4A535A',
    splash: '#008B74',
    login: '#0652DD',
    signUp: '#636E72',
    mainTabs: '#b71540',
  },
};
