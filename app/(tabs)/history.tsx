import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView, Alert, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ThemeView } from '../../components/ThemeView';
import { ThemeText } from '../../components/ThemeText';
import { ThemeButton } from '../../components/ThemeButton';
import { useExpenseDb } from '../../hooks/useExpenseDb';
import { UI_MESSAGES } from '../../constants/uiMessages';

export default function HistoryScreen() {
  const router = useRouter();
  const { expenses, isLoading, error, fetchExpenses, softDeleteExpense } = useExpenseDb();

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [fetchExpenses])
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      UI_MESSAGES.TITLES.CONFIRM_DELETE,
      UI_MESSAGES.CONFIRM.DELETE_EXPENSE,
      [
        { text: UI_MESSAGES.CONFIRM.CANCEL, style: 'cancel' },
        { 
          text: UI_MESSAGES.CONFIRM.DELETE, 
          style: 'destructive', 
          onPress: async () => {
            try {
              await softDeleteExpense(id);
            } catch (err: any) {
              console.warn('Delete expense warning:', err);
              Alert.alert(UI_MESSAGES.TITLES.ERROR, err.message || UI_MESSAGES.ERRORS.DELETION_FAILED);
            }
          }
        }
      ]
    );
  };

  return (
    <ThemeView screenType="mainTabs" style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchExpenses} />}
      >
        <ThemeText type="title" style={styles.title}>Expense History</ThemeText>
        
        {error ? <ThemeText type="error" style={styles.errorText}>{error}</ThemeText> : null}

        {expenses.length === 0 && !isLoading ? (
          <ThemeText style={styles.emptyText}>No expenses found.</ThemeText>
        ) : (
          expenses.map((exp) => (
            <View key={exp.id!} style={styles.card}>
              <View style={styles.cardInfo}>
                <ThemeText style={styles.amountText}>${exp.amount.toFixed(2)}</ThemeText>
                <ThemeText style={styles.catText}>{exp.category}</ThemeText>
                <ThemeText style={styles.dateText}>{exp.date}</ThemeText>
              </View>
              
              <View style={styles.actionRow}>
                <ThemeButton 
                  title="Edit" 
                  variant="secondary" 
                  style={styles.actionBtn}
                  onPress={() => router.push(`/(tabs)/add_edit?id=${exp.id}`)}
                />
                <ThemeButton 
                  title="Delete" 
                  variant="danger" 
                  style={styles.actionBtn}
                  onPress={() => handleDelete(exp.id!)}
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  title: { color: '#FFF', marginBottom: 20 },
  errorText: { marginBottom: 10, backgroundColor: '#FFF', padding: 10, borderRadius: 8 },
  emptyText: { color: 'rgba(255, 255, 255, 0.6)', fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardInfo: { marginBottom: 10 },
  amountText: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  catText: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 },
  dateText: { fontSize: 14, color: 'rgba(255, 255, 255, 0.5)', marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, marginVertical: 0, height: 40 }
});
