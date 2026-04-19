import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, Platform, TouchableOpacity } from 'react-native';
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
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function AddEditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEditing = !!params.id;
  
  const { auth } = useFirebaseAuth();
  const { addExpense, updateExpense, expenses, isLoading } = useExpenseDb();

  const [amountStr, setAmountStr] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.OTHER);
  const [date, setDate] = useState(new Date());
  const [note, setNote] = useState(''); //New Note state
  const [showDatePicker, setShowDatePicker] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (isEditing && typeof params.id === 'string') {
        const expenseToEdit = expenses.find(e => e.id === params.id);
        if (expenseToEdit) {
          setAmountStr(expenseToEdit.amount.toString());
          setCategory(expenseToEdit.category);
          setDate(new Date(expenseToEdit.date));
          setNote((expenseToEdit as any).note || '');
        }
      } 
      else {
        setAmountStr('');
        setCategory(ExpenseCategory.OTHER);
        setDate(new Date());
        setNote('');
      }
    }, [params.id, isEditing, expenses])
  );

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSave = async () => {
    try {
      const amountNum = parseFloat(amountStr);
      if (!amountNum || amountNum < 1 || amountNum > 10000) {
        throw new ValidationError(VALIDATION_ERRORS.AMOUNT_OUT_OF_BOUNDS(1, 10000));
      }

      const expenseData = {
        userId: auth.currentUser?.uid || 'UNKNOWN',
        amount: amountNum,
        category,
        date: date.toISOString().split('T')[0],
        note: note.trim(),
      };

      if (isEditing && typeof params.id === 'string') {
        await updateExpense(params.id, expenseData);
        Alert.alert(UI_MESSAGES.TITLES.SUCCESS, UI_MESSAGES.SUCCESS.EXPENSE_UPDATED);
      } else {
        await addExpense(expenseData);
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
        <ThemeText type="title" style={styles.headerTitle}>
          {isEditing ? 'Edit Expense' : 'Add New Expense'}
        </ThemeText>

        <View style={styles.whiteCard}>
          <ThemeText style={styles.inputLabel}>AMOUNT</ThemeText>
          <View style={styles.amountRow}>
            <ThemeText style={styles.currencySymbol}>$</ThemeText>
            <ThemeInput
              placeholder="0.00"
              value={amountStr}
              onChangeText={setAmountStr}
              keyboardType="decimal-pad"
              style={styles.amountInput}
            />
          </View>
          
          <ThemeText style={styles.inputLabel}>CATEGORY</ThemeText>
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

          <ThemeText style={styles.inputLabel}>DATE</ThemeText>
          <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
            <ThemeText style={styles.dateValue}>{date.toLocaleDateString('en-GB')}</ThemeText>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              maximumDate={new Date()}
              onChange={onChangeDate}
            />
          )}

          <ThemeText style={styles.inputLabel}>NOTE</ThemeText>
          <ThemeInput
            placeholder="What was this for?"
            value={note}
            onChangeText={setNote}
            multiline
            style={styles.noteInput}
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
        </View>
      </ScrollView>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  headerTitle: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginBottom: 30, textAlign: 'left' },
  
  whiteCard: {
    backgroundColor: '#FFF',
    borderRadius: 35,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5
  },

  inputLabel: { color: '#B2BABB', fontSize: 11, fontWeight: '900', marginBottom: 10, letterSpacing: 1.5 },
  
  amountRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#EEE', width: '100%' },
  currencySymbol: { fontSize: 35, height: 50, lineHeight: 50, includeFontPadding: false, fontWeight: 'bold', color: '#1A1A1A', marginRight: 8, alignSelf: 'center' },
  amountInput: { backgroundColor: 'transparent', borderWidth: 0, fontSize: 30, fontWeight: 'bold', color: '#1A1A1A', height: 50,paddingTop:10, width: 200, paddingHorizontal: 0, paddingVertical: 0, textAlignVertical: 'center' },
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  catBtn: { width: 'auto', paddingHorizontal: 15, marginVertical: 0 },
  dateSelector: { backgroundColor: '#F8F9FA', padding: 18, borderRadius: 15, marginBottom: 25, borderWidth: 1, borderColor: '#EEE' },
  dateValue: { color: '#1A1A1A', fontSize: 16, fontWeight: '600' },

  noteInput: { backgroundColor: '#F8F9FA', borderRadius: 15, padding: 15, fontSize: 16, color: '#1A1A1A', minHeight: 80, marginBottom: 30, borderBottomWidth: 0 },
});
