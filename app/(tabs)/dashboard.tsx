import React, { useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, RefreshControl, useColorScheme} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { ThemeView } from '../../components/ThemeView';
import { ThemeText } from '../../components/ThemeText';
import { useExpenseDb } from '../../hooks/useExpenseDb';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import { ExpenseCategory } from '../../interfaces/ExpenseCategory';
import { globalStyles } from '../../constants/globalStyles';
import { PieChart } from "react-native-gifted-charts";

const COLORS = {
  food: '#840A18',
  travel: '#5CD334',
  shopping: '#FFD369',
  electricity: '#B2BABB',
  textMain: '#1A1A1A',
  white: '#FFFFFF'
};

export default function DashboardScreen() {
  const isDarkMode = useColorScheme() === 'dark';
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

  //Transform Databse data into Chart data
  const chartData = useMemo(() => {
    const data = Object.keys(categoryBreakdown).map((cat) => ({
      value: categoryBreakdown[cat],
      color: COLORS[cat.toLowerCase() as keyof typeof COLORS] || '#3BABD7',
      text: cat
    }));
    return data.length > 0 ? data : [{ value: 1, color: '#EEEEEE' }]; //Fallback for empty data
  }, [categoryBreakdown]);

  return (
    <ThemeView screenType="mainTabs" style={globalStyles.container}>
      <ScrollView 
        contentContainerStyle={[globalStyles.scrollContent, { paddingBottom: 100 }]}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchExpenses} />}
      >
        <ThemeText style={styles.welcomeText}>Hello, {displayName}!</ThemeText>
        <View style={styles.summaryCard}>
          <ThemeText style={styles.cardSubtitle}>MONTHLY SPENDING</ThemeText>
          <ThemeText style={styles.balance}>${totalBalance.toLocaleString()}</ThemeText>
        </View>        
        {error ? <ThemeText type="error" style={globalStyles.errorText}>{error}</ThemeText> : null}
        
        <View style={styles.whiteSheet}>
          <Text style={styles.sectionTitle}>Spending Overview</Text>
          
          <View style={styles.chartContainer}>
            <PieChart
              data={chartData}
              donut
              radius={90}
              innerRadius={60}
              innerCircleColor={isDarkMode ? '#1E1E1E' : '#FFFFFF'}
              centerLabelComponent={() => (
                <Text style={{fontSize: 12, fontWeight: 'bold'}}>Expenses</Text>
              )}
            />
          </View>

          <ThemeText type="subtitle" style={styles.breakdownHeader}>Category Breakdown</ThemeText>

          {Object.keys(categoryBreakdown).length === 0 && !isLoading ? (
            <ThemeText style={styles.emptyText}>No expenses logged yet.</ThemeText>
          ) : (
            Object.keys(categoryBreakdown).map((category) => {
              const categoryColor = COLORS[category.toLowerCase() as keyof typeof COLORS] || '#3BABD7';

              return (
                <View key={category} style={styles.breakdownItem}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[styles.statusDot, { backgroundColor: categoryColor }]} />
                    <ThemeText style={styles.categoryName}>{category}</ThemeText>
                  </View>
                  <ThemeText style={[styles.breakdownAmount, { color: categoryColor }]}>
                    ${categoryBreakdown[category].toFixed(2)}
                  </ThemeText>
                </View>

              );
            })
          )}
        </View>
      </ScrollView>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  welcomeText: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 40, fontWeight: 'bold', marginBottom: 20 },
  headerTitle: { color: '#FFF', marginBottom: 20 },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 25,
    alignItems: 'flex-start', 
    marginBottom: 30,
    marginHorizontal: 10,
  },

  cardSubtitle: { color: '#840A18', fontWeight: 'bold', marginBottom: 8, fontSize: 14 },
  balance: { color: '#1A1A1A', fontSize: 45, fontWeight: '900', fontFamily: 'serif' },

  whiteSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 25,
    marginTop: 10,
    marginBottom: 10,
    minHeight: 400, 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },

  breakdownHeader: { color: '#000', marginBottom: 16, fontWeight: 'bold' },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0', 
    marginBottom: 10,
  },
  breakdownAmount: { fontWeight: 'bold', fontSize: 18 },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 15,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A', //Dark text for white background
  },
});
