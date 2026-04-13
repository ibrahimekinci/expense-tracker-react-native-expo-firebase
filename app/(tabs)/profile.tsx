import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ThemeView } from '../../components/ThemeView';
import { ThemeText } from '../../components/ThemeText';
import { ThemeButton } from '../../components/ThemeButton';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import { UI_MESSAGES } from '../../constants/uiMessages';
import { globalStyles } from '../../constants/globalStyles';
import { Ionicons } from '@expo/vector-icons';

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
      {/* <ThemeText type="title" style={styles.title}>Account Dashboard</ThemeText> */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
             <Ionicons name="person-outline" size={60} color="#840A18" />
          </View>
          <TouchableOpacity style={styles.editIconBadge}>
            <Ionicons name="pencil" size={14} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <ThemeText style={styles.userName}>{displayName.toUpperCase()}</ThemeText>
        <ThemeText style={styles.userEmail}>{email}</ThemeText>
      </View>

      <View style={styles.card}>
        <ThemeText style={styles.cardTitle}>Profile Details</ThemeText>
        
        <View style={styles.infoRow}>
          <ThemeText style={styles.infoLabel}>NAME</ThemeText>
          <ThemeText style={styles.infoValue}>{displayName}</ThemeText>
          <View style={styles.underline} />
        </View>

        <View style={styles.infoRow}>
          <ThemeText style={styles.infoLabel}>EMAIL</ThemeText>
          <ThemeText style={styles.infoValue}>{email}</ThemeText>
          <View style={styles.underline} />
        </View>
      </View>
{/*
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
*/}
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

      <View style={styles.bottomSection}>
        <ThemeButton 
          title="LOG OUT" 
          variant="danger" 
          onPress={handleSignOut} 
          loading={isLoading}
          style={styles.logoutBtn}
        />
      </View>
    </ThemeView>
  );
}
{/*}
const styles = StyleSheet.create({
  title: { color: '#FFF', marginBottom: 30, textAlign: 'center' },
  section: { marginBottom: 24 },
  label: { color: 'rgba(255, 255, 255, 0.7)', marginBottom: 8, fontSize: 14 },
  valueText: { color: '#FFF', fontSize: 18, fontWeight: '500', marginBottom: 8 },
  editButton: { marginTop: 15 },
  linksSection: { marginTop: 20, gap: 10 },
  signOutSection: { marginTop: 'auto', paddingTop: 20 }
});
*/}
const styles = StyleSheet.create({
  header: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 20, 
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE'
  },
  editIconBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#4CAF50',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF'
  },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#FFF', letterSpacing: 1 },
  userEmail: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', marginBottom: 20 },
  infoRow: { marginBottom: 20 },
  infoLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 'bold', letterSpacing: 1 },
  infoValue: { fontSize: 16, color: '#FFF', marginTop: 5, fontWeight: '500' },
  underline: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 8 },
  linksSection: { 
    marginTop: 20, 
    gap: 10, 
    paddingHorizontal: 20 
  },
  bottomSection: { flex: 1, justifyContent: 'flex-end', paddingBottom: 30, paddingHorizontal: 20 },
  logoutBtn: { borderRadius: 12, height: 55 }
});
