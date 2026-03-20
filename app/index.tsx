import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { ThemeView } from '../components/ThemeView';
import { ThemeText } from '../components/ThemeText';

export default function SplashScreen() {
  const { auth } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth.currentUser) {
        router.replace('/(tabs)/dashboard');
      } else {
        router.replace('/login');
      }
    }, 1500); // Splash screen delay

    return () => clearTimeout(timer);
  }, [auth.currentUser, router]);

  return (
    <ThemeView screenType="splash" style={styles.container}>
      <ThemeText type="title" style={styles.title}>Expense Tracker</ThemeText>
      <ActivityIndicator size="large" color="#FFFFFF" />
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFF',
    fontSize: 32,
    marginBottom: 20,
    fontWeight: 'bold',
  }
});
