import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="support" options={{ headerShown: true, title: 'Support' }} />
      <Stack.Screen name="faq" options={{ headerShown: true, title: 'FAQ' }} />
      <Stack.Screen name="edit_profile" options={{ headerShown: false }} />
    </Stack>
  );
}
