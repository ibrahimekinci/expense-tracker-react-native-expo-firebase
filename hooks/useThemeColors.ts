import { useColorScheme } from 'react-native';
import { Colors, ThemeColorSet, ThemeName } from '../constants/appThemes';

export function useThemeColors(): ThemeColorSet {
  const colorScheme = useColorScheme();
  const themeName: ThemeName = colorScheme === 'dark' ? 'dark' : 'light';
  return Colors[themeName];
}

