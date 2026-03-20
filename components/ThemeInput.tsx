import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native';
import { useThemeColors } from '../hooks/useThemeColors';
import { ThemeText } from './ThemeText';

interface ThemeInputProps extends TextInputProps {
  errorText?: string;
}

export function ThemeInput({
  style,
  errorText,
  ...props
}: ThemeInputProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            color: colors.text,
            borderColor: errorText ? colors.error : 'transparent',
          },
          style,
        ]}
        placeholderTextColor={colors.text + '80'}
        {...props}
      />
      {!!errorText && (
        <ThemeText type="error" style={styles.errorText}>
          {errorText}
        </ThemeText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

