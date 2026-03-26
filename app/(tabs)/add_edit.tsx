import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { ThemeView } from '../../components/ThemeView';
import { ThemeText } from '../../components/ThemeText';
import { ThemeInput } from '../../components/ThemeInput';
import { ThemeButton } from '../../components/ThemeButton';
import { useExpenseDb } from '../../hooks/useExpenseDb';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import { ExpenseCategory } from '../../interfaces/ExpenseCategory';
import { ValidationError } from '../../utils/errors/ValidationError';
import { ErrorHandler } from '../../utils/ErrorHandler';
import { VALIDATION_ERRORS } from '../../constants/errorMessages';
import { UI_MESSAGES } from '../../constants/uiMessages';
import { globalStyles } from '../../constants/globalStyles';

export default function AddEditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditing = !!params.id;
  
  const { auth } = useFirebaseAuth();
  const { addExpense, updateExpense, expenses, isLoading } = useExpenseDb();

  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.OTHER);
  const [dateStr, setDateStr] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      if (isEditing && typeof params.id === 'string') {
        const expenseToEdit = expenses.find(e => e.id === params.id);
        if (expenseToEdit) {
          setAmountStr(expenseToEdit.amount.toString());
          setCategory(expenseToEdit.category);
          setDateStr(expenseToEdit.date);
        }
      } else {
        setAmountStr('');
        setCategory(ExpenseCategory.OTHER);
        setDateStr(new Date().toISOString().split('T')[0]);
      }
    }, [params.id, isEditing, expenses])
  );

  const handleSave = async () => {
    try {
      if (!category) {
        throw new ValidationError(VALIDATION_ERRORS.REQUIRED_FIELD('Category'));
      }

      const amountNum = parseFloat(amountStr);
      if (!amountNum || amountNum < 1 || amountNum > 10000) {
        throw new ValidationError(VALIDATION_ERRORS.AMOUNT_OUT_OF_BOUNDS(1, 10000));
      }

      if (!dateStr?.trim()) {
        throw new ValidationError(VALIDATION_ERRORS.INVALID_DATE);
      }

      if (isEditing && typeof params.id === 'string') {
        await updateExpense(params.id, {
          amount: amountNum,
          category,
          date: dateStr,
        });
        Alert.alert(UI_MESSAGES.TITLES.SUCCESS, UI_MESSAGES.SUCCESS.EXPENSE_UPDATED);
      } else {
        await addExpense({
          userId: auth.currentUser?.uid || 'UNKNOWN',
          amount: amountNum,
          category,
          date: dateStr,
        }); 
      }
      
      // Clear ID parameter
      router.setParams({ id: '' });
      router.push('/(tabs)/history');
    } catch (error: unknown) {
      if (error instanceof ValidationError) {
        console.warn('Validation warning:', error);
        ErrorHandler.handleError(error);
      } else {
        console.error('Save expense database error:', error);
      }
    }
  };

  return (
    <ThemeView screenType="mainTabs" style={globalStyles.container}>
      <ScrollView contentContainerStyle={globalStyles.scrollContent}>
        <ThemeText type="title" style={styles.title}>
          {isEditing ? 'Edit Expense' : 'Add New Expense'}
        </ThemeText>

        <ThemeInput
          placeholder="Amount (e.g. 15.50)"
          value={amountStr}
          onChangeText={setAmountStr}
          keyboardType="decimal-pad"
        />

        <View style={styles.categoryContainer}>
          <ThemeText style={styles.categoryLabel}>Category:</ThemeText>
          <View style={styles.buttonRow}>
            {Object.values(ExpenseCategory).map(cat => (
              <ThemeButton
                key={cat}
                title={cat}
                variant={category === cat ? 'primary' : 'secondary'}
                onPress={() => setCategory(cat as ExpenseCategory)}
                style={styles.catBtn}
              />
            ))}
          </View>
        </View>

        <ThemeInput
          placeholder="Date (YYYY-MM-DD)"
          value={dateStr}
          onChangeText={setDateStr}
        />

        <ThemeButton
          title={isEditing ? 'Update Expense' : 'Save Expense'}
          onPress={handleSave}
          loading={isLoading}
        />

        {isEditing && (
          <ThemeButton
            title="Cancel"
            variant="secondary"
            onPress={() => {
              router.setParams({ id: '' });
              router.push('/(tabs)/history');
            }}
            style={{ marginTop: 10 }}
          />
        )}
      </ScrollView>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  title: { color: '#FFF', marginBottom: 30, textAlign: 'center' },
  categoryContainer: { marginBottom: 20 },
  categoryLabel: { color: '#FFF', marginBottom: 10, fontWeight: '600' },
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catBtn: { width: 'auto', marginVertical: 0, marginBottom: 10 }
});
