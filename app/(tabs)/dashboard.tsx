import React, { useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { ThemeView } from '../../components/ThemeView';
import { ThemeText } from '../../components/ThemeText';
import { useExpenseDb } from '../../hooks/useExpenseDb';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import { ExpenseCategory } from '../../interfaces/ExpenseCategory';

export default function DashboardScreen() {
  const { expenses, isLoading, error, fetchExpenses } = useExpenseDb();
  const { auth } = useFirebaseAuth();
  const displayName = auth.currentUser?.displayName || 'User';

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [fetchExpenses])
  );

  const totalBalance = useMemo(() => {
    return expenses.reduce((sum, current) => sum + current.amount, 0);
  }, [expenses]);

  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    expenses.forEach(exp => {
      breakdown[exp.category] = (breakdown[exp.category] || 0) + exp.amount;
    });
    return breakdown;
  }, [expenses]);

  return (
    <ThemeView screenType="mainTabs" style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchExpenses} />}
      >
        <ThemeText style={styles.welcomeText}>Hello, {displayName}!</ThemeText>
        <ThemeText type="title" style={styles.headerTitle}>Overview</ThemeText>
        
        {error ? <ThemeText type="error" style={styles.errorText}>{error}</ThemeText> : null}
        
        <View style={styles.summaryCard}>
          <ThemeText type="subtitle" style={styles.cardSubtitle}>Total Expenses</ThemeText>
          <ThemeText type="title" style={styles.balance}>${totalBalance.toFixed(2)}</ThemeText>
        </View>

        <ThemeText type="subtitle" style={styles.breakdownHeader}>Category Breakdown</ThemeText>

        {Object.keys(categoryBreakdown).length === 0 && !isLoading ? (
          <ThemeText style={styles.emptyText}>No expenses logged yet.</ThemeText>
        ) : (
          Object.keys(categoryBreakdown).map((category) => (
            <View key={category} style={styles.breakdownItem}>
              <ThemeText>{category}</ThemeText>
              <ThemeText style={styles.breakdownAmount}>
                ${categoryBreakdown[category as ExpenseCategory]?.toFixed(2) || '0.00'}
              </ThemeText>
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
  welcomeText: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 16, marginBottom: 4 },
  headerTitle: { color: '#FFF', marginBottom: 20 },
  errorText: { marginBottom: 10, backgroundColor: '#FFF', padding: 10, borderRadius: 8 },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  cardSubtitle: { color: 'rgba(255, 255, 255, 0.8)', marginBottom: 8 },
  balance: { color: '#FFF', fontSize: 40, marginBottom: 0 },
  breakdownHeader: { color: '#FFF', marginBottom: 16 },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  breakdownAmount: { fontWeight: 'bold', color: '#FFF' },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  }
});
