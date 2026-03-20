import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { updateProfile } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { ThemeView } from '../components/ThemeView';
import { ThemeText } from '../components/ThemeText';
import { ThemeButton } from '../components/ThemeButton';
import { ThemeInput } from '../components/ThemeInput';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { UI_MESSAGES } from '../constants/uiMessages';

export default function EditProfileScreen() {
  const { auth } = useFirebaseAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (auth.currentUser) {
      setDisplayName(auth.currentUser.displayName || '');
      
      auth.currentUser.reload()
        .then(() => {
          if (isMounted) {
             setDisplayName(prev => prev ? prev : (auth.currentUser?.displayName || ''));
          }
        })
        .catch(console.warn);
    }
    return () => { isMounted = false; };
  }, [auth.currentUser]);

  const handleUpdateName = async () => {
    if (!auth.currentUser) return;
    if (displayName.trim().length === 0) {
      Alert.alert(UI_MESSAGES.TITLES.INVALID_NAME, UI_MESSAGES.ERRORS.DISPLAY_NAME_EMPTY);
      return;
    }
    
    setIsUpdating(true);
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() });
      Alert.alert(UI_MESSAGES.TITLES.SUCCESS, UI_MESSAGES.SUCCESS.PROFILE_UPDATED);
      router.back();
    } catch (error: any) {
      console.warn('Update profile warning:', error);
      Alert.alert(UI_MESSAGES.TITLES.UPDATE_FAILED, error.message || UI_MESSAGES.ERRORS.COULD_NOT_UPDATE_PROFILE);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ThemeView screenType="mainTabs" style={styles.container}>
      <ThemeText type="title" style={styles.title}>Edit Profile</ThemeText>

      <View style={styles.section}>
        <ThemeText style={styles.label}>Email Address (Read-Only):</ThemeText>
        <ThemeText style={styles.valueText}>{auth.currentUser?.email || 'N/A'}</ThemeText>
      </View>

      <View style={styles.section}>
        <ThemeText style={styles.label}>Display Name:</ThemeText>
        <ThemeInput 
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Enter display name"
        />
        <ThemeButton 
          title="Save Changes" 
          onPress={handleUpdateName} 
          loading={isUpdating}
        />
        <ThemeButton 
          title="Cancel" 
          variant="secondary"
          onPress={() => router.back()} 
          style={{ marginTop: 10 }}
        />
      </View>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { color: '#FFF', marginBottom: 30, textAlign: 'center' },
  section: { marginBottom: 24 },
  label: { color: 'rgba(255, 255, 255, 0.7)', marginBottom: 8, fontSize: 14 },
  valueText: { color: '#FFF', fontSize: 18, fontWeight: '500', marginBottom: 8 }
});
