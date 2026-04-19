import React, { useEffect } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { ThemeView } from '../components/ThemeView';
import { ThemeText } from '../components/ThemeText';
import { globalStyles } from '../constants/globalStyles';

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
    }, 1500);

    return () => clearTimeout(timer);
  }, [auth.currentUser, router]);

  return (
    <ThemeView screenType="splash" style={[globalStyles.container, styles.container]}>
      <ThemeText type="title" style={styles.title}>Expense Tracker</ThemeText>
      <ActivityIndicator size="large" color="#FFFFFF" />
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
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
