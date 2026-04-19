import React, { useCallback, useState } from 'react';
import { StyleSheet, View, ScrollView, Alert, RefreshControl, Modal, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ThemeView } from '../../components/ThemeView';
import { ThemeText } from '../../components/ThemeText';
import { ThemeButton } from '../../components/ThemeButton';
import { useExpenseDb } from '../../hooks/useExpenseDb';
import { globalStyles } from '../../constants/globalStyles';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const router = useRouter();
  const { expenses, isLoading, error, fetchExpenses, softDeleteExpense } = useExpenseDb();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [fetchExpenses])
  );

  const openDeleteModal = (expense: any) => {
    setExpenseToDelete(expense); //Save the data to show in the modal
    setIsModalVisible(true);     //Open our new custom modal
  };

  const confirmDelete = async () => {
    if (expenseToDelete?.id) {
      try {
        await softDeleteExpense(expenseToDelete.id);
        setIsModalVisible(false); //Close modal after success
      } catch (err: any) {
        Alert.alert("Error", "Could not delete expense.");
      }
    }
  };
  return (
    <ThemeView screenType="mainTabs" style={globalStyles.container}>
      <ScrollView 
        contentContainerStyle={globalStyles.scrollContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchExpenses} />}
      >
        <ThemeText type="title" style={styles.title}>Expense History</ThemeText>
        
        {error ? <ThemeText type="error" style={globalStyles.errorText}>{error}</ThemeText> : null}

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
                  onPress={() => openDeleteModal(exp)}
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Modal 
        visible={isModalVisible} 
        transparent={true} 
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            
            <View style={styles.iconCircle}>
              <Ionicons name="trash-outline" size={28} color="#840A18" />
            </View>

            <ThemeText style={styles.modalTitle}>Delete Purchase?</ThemeText>
            <ThemeText style={styles.modalSubText}>
              Are you sure you want to permanently remove this transaction? 
              This action cannot be undone.
            </ThemeText>

            <View style={styles.previewBox}>
              <View style={styles.redAccentBar} />
              <View style={{ flex: 1 }}>
                <ThemeText style={styles.previewLabel}>TRANSACTION TO REMOVE</ThemeText>
                <ThemeText style={styles.previewName}>{expenseToDelete?.category}</ThemeText>
              </View>
              <ThemeText style={styles.previewAmount}>
                -${expenseToDelete?.amount.toFixed(2)}
              </ThemeText>
            </View>

            <TouchableOpacity style={styles.confirmDeleteBtn} onPress={confirmDelete}>
              <ThemeText style={styles.confirmDeleteText}>DELETE</ThemeText>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelModalBtn} 
              onPress={() => setIsModalVisible(false)}
            >
              <ThemeText style={styles.cancelModalText}>CANCEL</ThemeText>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  title: { color: '#FFF', marginBottom: 20 },
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
  actionBtn: { flex: 1, marginVertical: 0, height: 40 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 25,
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FDECEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#840A18',
    marginBottom: 10 
  },
  modalSubText: { 
    textAlign: 'center', 
    color: '#666', 
    lineHeight: 20, 
    marginBottom: 25 
  },
  previewBox: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 15,
    width: '100%',
    marginBottom: 30,
    alignItems: 'center',
  },
  redAccentBar: { 
    width: 4, 
    height: '100%', 
    backgroundColor: '#840A18', 
    marginRight: 15, 
    borderRadius: 2 
  },
  previewLabel: { fontSize: 10, color: '#AAA', fontWeight: 'bold' },
  previewName: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  previewAmount: { fontSize: 18, fontWeight: 'bold', color: '#840A18' },

  confirmDeleteBtn: {
    backgroundColor: '#840A18',
    width: '100%',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmDeleteText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  cancelModalBtn: {
    backgroundColor: '#CFD8DC',
    width: '100%',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  cancelModalText: { color: '#455A64', fontWeight: 'bold', fontSize: 16 },
});
