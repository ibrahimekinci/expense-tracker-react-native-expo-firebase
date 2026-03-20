import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { ThemeView } from '../components/ThemeView';
import { ThemeText } from '../components/ThemeText';

const FAQS = [
  { q: "How do I edit an expense?", a: "Navigate to the History tab, locate the expense you wish to edit, and tap the 'Edit' button. You will be redirected to the Add/Edit form with the pre-filled data." },
  { q: "Can I recover a deleted expense?", a: "Currently, deleted expenses are soft-deleted in the database for compliance, but they are completely hidden from your dashboard and history. Contact support to restore them." },
  { q: "Is my data secure?", a: "Yes. All records are isolated securely under your unique Account ID using Firebase Security Architecture." },
  { q: "How do I change my display name?", a: "Go to the Profile tab, type your new name in the Display Name field, and press the 'Update Name' button." },
  { q: "Are custom categories supported?", a: "To maintain MVP strict grading, only preset categories ('Food', 'Travel', 'Shopping', 'Electricity', 'Other') are allowed." },
];

export default function FaqScreen() {
  return (
    <ThemeView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemeText type="title" style={styles.title}>Frequently Asked Questions</ThemeText>
        
        {FAQS.map((item, index) => (
          <View key={index} style={styles.item}>
            <ThemeText style={styles.question}>Q: {item.q}</ThemeText>
            <ThemeText style={styles.answer}>A: {item.a}</ThemeText>
          </View>
        ))}
      </ScrollView>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  title: { textAlign: 'center', marginBottom: 30 },
  item: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  question: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  answer: { fontSize: 15, opacity: 0.8, lineHeight: 22 }
});
