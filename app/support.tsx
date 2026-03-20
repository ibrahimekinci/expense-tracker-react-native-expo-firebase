import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeView } from '../components/ThemeView';
import { ThemeText } from '../components/ThemeText';

export default function SupportScreen() {
  return (
    <ThemeView style={styles.container}>
      <ThemeText type="title" style={styles.title}>Contact Support</ThemeText>
      
      <View style={styles.card}>
        <ThemeText style={styles.label}>Email</ThemeText>
        <ThemeText style={styles.info}>support@expensetracker.app</ThemeText>
      </View>
      
      <View style={styles.card}>
        <ThemeText style={styles.label}>Phone</ThemeText>
        <ThemeText style={styles.info}>+1 (800) 123-4567</ThemeText>
      </View>
      
      <View style={styles.card}>
        <ThemeText style={styles.label}>Address</ThemeText>
        <ThemeText style={styles.info}>123 Innovation Drive{'\n'}Tech City, TC 90210{'\n'}United States</ThemeText>
      </View>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { textAlign: 'center', marginBottom: 30 },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  label: { fontSize: 14, opacity: 0.6, marginBottom: 4 },
  info: { fontSize: 18, fontWeight: '500' }
});
