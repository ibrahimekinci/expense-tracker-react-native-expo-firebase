import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

interface ThemeViewProps extends ViewProps {
  screenType?: 'splash' | 'login' | 'signUp' | 'mainTabs' | 'default';
}

export function ThemeView({
  style,
  screenType = 'default',
  ...props
}: ThemeViewProps) {
  const colors = useThemeColors();

  let backgroundColor = colors.background;
  if (screenType === 'splash') {
    backgroundColor = colors.splash;
  } else if (screenType === 'login') {
    backgroundColor = colors.login;
  } else if (screenType === 'signUp') {
    backgroundColor = colors.signUp;
  } else if (screenType === 'mainTabs') {
    backgroundColor = colors.mainTabs;
  }

  return (
    <View style={[styles.base, { backgroundColor }, style]} {...props} />
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});

