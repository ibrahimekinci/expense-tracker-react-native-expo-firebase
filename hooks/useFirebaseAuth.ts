import { useState } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as fbSignOut, updateProfile } from 'firebase/auth';
import { firebaseConfig } from '../config/firebaseConfig';
import { FIREBASE_ERRORS } from '../constants/errorMessages';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export function useFirebaseAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFriendlyErrorMessage = (err: any, fallback: string) => {
    if (err && err.code && FIREBASE_ERRORS[err.code]) {
      return FIREBASE_ERRORS[err.code];
    }
    return err?.message || fallback;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
      setIsLoading(false);
      return userCredential.user;
    } catch (err: any) {
      console.warn('useFirebaseAuth.signUp warning:', err);
      const msg = getFriendlyErrorMessage(err, 'An unknown error occurred during sign up.');
      setError(msg);
      setIsLoading(false);
      throw new Error(msg);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      return userCredential.user;
    } catch (err: any) {
      console.warn('useFirebaseAuth.signIn warning:', err);
      const msg = getFriendlyErrorMessage(err, 'An unknown error occurred during sign in.');
      setError(msg);
      setIsLoading(false);
      throw new Error(msg);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await fbSignOut(auth);
      setIsLoading(false);
    } catch (err: any) {
      console.warn('useFirebaseAuth.signOut warning:', err);
      const msg = getFriendlyErrorMessage(err, 'An unknown error occurred during sign out.');
      setError(msg);
      setIsLoading(false);
      throw new Error(msg);
    }
  };

  return { signIn, signUp, signOut, isLoading, error, auth };
}
