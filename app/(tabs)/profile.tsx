import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ThemeView } from '../../components/ThemeView';
import { ThemeText } from '../../components/ThemeText';
import { ThemeButton } from '../../components/ThemeButton';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import { UI_MESSAGES } from '../../constants/uiMessages';
import { globalStyles } from '../../constants/globalStyles';

export default function ProfileScreen() {
  const { auth, signOut, isLoading } = useFirebaseAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('N/A');
  const [email, setEmail] = useState('N/A');

  useFocusEffect(
    useCallback(() => {
      if (auth.currentUser) {
        setDisplayName(auth.currentUser.displayName || 'N/A');
        setEmail(auth.currentUser.email || 'N/A');

        auth.currentUser.reload()
          .then(() => {
            setDisplayName(auth.currentUser?.displayName || 'N/A');
            setEmail(auth.currentUser?.email || 'N/A');
          })
          .catch(console.warn);
      }
    }, [auth.currentUser])
  );

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error: any) {
      console.warn('Sign out warning:', error);
      Alert.alert(UI_MESSAGES.TITLES.SIGN_OUT_ERROR, error.message || UI_MESSAGES.ERRORS.FAILED_SIGN_OUT);
    }
  };

  return (
    <ThemeView screenType="mainTabs" style={globalStyles.containerWithPadding}>
      <ThemeText type="title" style={styles.title}>Account Dashboard</ThemeText>

      <View style={styles.section}>
        <ThemeText style={styles.label}>Email Address:</ThemeText>
        <ThemeText style={styles.valueText}>{email}</ThemeText>
      </View>

      <View style={styles.section}>
        <ThemeText style={styles.label}>Display Name:</ThemeText>
        <ThemeText style={styles.valueText}>{displayName}</ThemeText>
        
        <ThemeButton 
          title="Edit Profile" 
          onPress={() => router.push('/edit_profile')}
          style={styles.editButton}
        />
      </View>

      <View style={styles.linksSection}>
        <ThemeButton 
          title="Support Information" 
          variant="secondary" 
          onPress={() => router.push('/support')} 
        />
        <ThemeButton 
          title="Frequently Asked Questions" 
          variant="secondary" 
          onPress={() => router.push('/faq')} 
        />
      </View>

      <View style={styles.signOutSection}>
        <ThemeButton 
          title="Sign Out" 
          variant="danger" 
          onPress={handleSignOut} 
          loading={isLoading}
        />
      </View>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  title: { color: '#FFF', marginBottom: 30, textAlign: 'center' },
  section: { marginBottom: 24 },
  label: { color: 'rgba(255, 255, 255, 0.7)', marginBottom: 8, fontSize: 14 },
  valueText: { color: '#FFF', fontSize: 18, fontWeight: '500', marginBottom: 8 },
  editButton: { marginTop: 15 },
  linksSection: { marginTop: 20, gap: 10 },
  signOutSection: { marginTop: 'auto', paddingTop: 20 }
});
