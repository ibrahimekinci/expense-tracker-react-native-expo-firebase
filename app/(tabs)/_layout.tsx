import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { useThemeColors } from '../../hooks/useThemeColors';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colors = useThemeColors();
  const { auth } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace('/login');
      }
    });
    return unsubscribe;
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.text + '80',
        tabBarStyle: {
          backgroundColor: colors.background,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="pie-chart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add_edit"
        options={{
          title: 'Add Expense',
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
