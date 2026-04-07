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
    tint: '#5CD334',
    error: '#FF7675',
    card: '#F5F5F5',
    border: '#DDDDDD',
    inputBackground: '#F5F6FA',
    splash: '#5CD334',
    login: '#3BABD7',
    signUp: '#B2BEC3',
    mainTabs: '#840A18',
  },
  dark: {
    background: '#2D3436',
    text: '#DFE6E9',
    tint: '#008B74',
    error: '#D63031',
    card: '#15181B',
    border: '#33373D',
    inputBackground: '#4A535A',
    splash: '#008B74',
    login: '#0652DD',
    signUp: '#636E72',
    mainTabs: '#840A18',
  },
};
