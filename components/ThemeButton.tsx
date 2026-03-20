import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { ThemeText } from './ThemeText';

interface ThemeButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'danger' | 'secondary';
}

export function ThemeButton({
  title,
  style,
  loading,
  disabled,
  variant = 'primary',
  ...props
}: ThemeButtonProps) {
  const colors = useThemeColors();

  let backgroundColor = colors.tint;
  if (variant === 'danger') {
    backgroundColor = colors.error;
  } else if (variant === 'secondary') {
    backgroundColor = colors.inputBackground;
  }

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
        isDisabled && { opacity: 0.6 },
        style,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'secondary' ? colors.text : '#FFFFFF'}
        />
      ) : (
        <ThemeText
          style={[
            styles.text,
            { color: variant === 'secondary' ? colors.text : '#FFFFFF' },
          ]}
        >
          {title}
        </ThemeText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
    width: '100%',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

