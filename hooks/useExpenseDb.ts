import { useState, useCallback } from 'react';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  doc 
} from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { useFirebaseAuth } from './useFirebaseAuth';
import { ExpenseModel } from '../interfaces/ExpenseModel';
import { FirebaseAppError } from '../utils/errors/FirebaseAppError';
import { ErrorHandler } from '../utils/ErrorHandler';

const db = getFirestore(getApp());

export function useExpenseDb() {
  const { auth } = useFirebaseAuth();
  const [expenses, setExpenses] = useState<ExpenseModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    if (!auth.currentUser) return;
    setIsLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, 'expense_tracker_expenses'),
        where('userId', '==', auth.currentUser.uid),
        // Fetch user's active records
        where('isDeleted', '==', false)
      );
      const querySnapshot = await getDocs(q);
      setExpenses(
        querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExpenseModel))
      );
    } catch (err: any) {
      console.error('useExpenseDb.fetchExpenses error:', err);
      setError(err.message || 'Failed to fetch expenses.');
    } finally {
      setIsLoading(false);
    }
  }, [auth.currentUser]);

  const addExpense = async (expense: Omit<ExpenseModel, 'id' | 'isDeleted' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    if (!auth.currentUser) throw new Error("User not authenticated");
    setIsLoading(true);
    setError(null);
    try {
      const fullExpense = {
        ...expense,
        isDeleted: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        createdBy: auth.currentUser.uid,
        updatedBy: auth.currentUser.uid,
      };
      const docRef = await addDoc(collection(db, 'expense_tracker_expenses'), fullExpense);
      const newExpense = { id: docRef.id, ...fullExpense };
      setExpenses((prev) => [...prev, newExpense as ExpenseModel]);
      return docRef.id;
    } catch (error: unknown) {
      console.error('useExpenseDb.addExpense error:', error);
      const firebaseCode = (error as any)?.code || 'unknown';
      const appErr = new FirebaseAppError(firebaseCode);
      setError(appErr.message);
      ErrorHandler.handleError(appErr);
      throw appErr;
    } finally {
      setIsLoading(false);
    }
  };

  const updateExpense = async (id: string, updates: Partial<ExpenseModel>) => {
    if (!auth.currentUser) throw new Error("User not authenticated");
    setIsLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'expense_tracker_expenses', id);
      const fullUpdates = {
        ...updates,
        updatedAt: Date.now(),
        updatedBy: auth.currentUser.uid,
      };
      await updateDoc(docRef, fullUpdates);
      
      setExpenses((prev) => 
        prev.map((exp) => (exp.id === id ? { ...exp, ...fullUpdates } : exp))
      );
    } catch (err: any) {
      console.error('useExpenseDb.updateExpense error:', err);
      setError(err.message || 'Failed to update expense.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const softDeleteExpense = async (id: string) => {
    if (!auth.currentUser) throw new Error("User not authenticated");
    setIsLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'expense_tracker_expenses', id);
      const deletePayload: Partial<ExpenseModel> = {
        isDeleted: true,
        deletedAt: Date.now(),
        updatedAt: Date.now(),
        updatedBy: auth.currentUser.uid
      };
      await updateDoc(docRef, deletePayload);
      
      // Remove locally
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    } catch (err: any) {
      console.error('useExpenseDb.softDeleteExpense error:', err);
      setError(err.message || 'Failed to soft delete expense.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    expenses,
    isLoading,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    softDeleteExpense
  };
}
