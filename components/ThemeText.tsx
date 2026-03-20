import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';

interface ThemeTextProps extends TextProps {
  type?: 'default' | 'title' | 'subtitle' | 'error';
}

export function ThemeText({
  style,
  type = 'default',
  ...props
}: ThemeTextProps) {
  const colors = useThemeColors();

  return (
    <Text
      style={[
        { color: type === 'error' ? colors.error : colors.text },
        type === 'title' ? styles.title : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.8,
    marginBottom: 8,
  },
});

