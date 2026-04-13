import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeView } from '../components/ThemeView';
import { ThemeText } from '../components/ThemeText';
import { ThemeInput } from '../components/ThemeInput';
import { ThemeButton } from '../components/ThemeButton';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { ValidationStates } from '../interfaces/ValidationStates';
import { VALIDATION_ERRORS } from '../constants/errorMessages';
import { UI_MESSAGES } from '../constants/uiMessages';
import { globalStyles } from '../constants/globalStyles';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // update new confimation password
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailValidation, setEmailValidation] = useState<ValidationStates>(ValidationStates.None);
  const [passwordValidation, setPasswordValidation] = useState<ValidationStates>(ValidationStates.None);
  const [isFormValid, setIsFormValid] = useState(false);

  const router = useRouter();
  const { signUp, isLoading } = useFirebaseAuth();

  useEffect(() => {
    const isValidEmail = email.includes('@') && email.indexOf('@') > 0;
    setEmailValidation(email ? (isValidEmail ? ValidationStates.Valid : ValidationStates.Invalid) : ValidationStates.None);

    setPasswordValidation(password ? (password.length > 8 ? ValidationStates.Valid : ValidationStates.Invalid) : ValidationStates.None);
  }, [email, password]);

  useEffect(() => {
    setIsFormValid(
      fullName.trim().length > 0 &&
      emailValidation === ValidationStates.Valid &&
      passwordValidation === ValidationStates.Valid &&
      //check if password and confirm password match
      password === confirmPassword &&
      confirmPassword.length > 0
    );
  }, [fullName, emailValidation, passwordValidation, password, confirmPassword]);

  const handleSignUp = async () => {
    // Add safety check
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    
    try {
      await signUp(email, password, fullName);
      Alert.alert(UI_MESSAGES.TITLES.SUCCESS, UI_MESSAGES.SUCCESS.ACCOUNT_CREATED);
      router.replace('/login');
    } catch (error: any) {
      console.warn('Sign up warning:', error);
      Alert.alert(UI_MESSAGES.TITLES.SIGN_UP_FAILED, error.message || UI_MESSAGES.ERRORS.COULD_NOT_CREATE_ACCOUNT);
    }
  };

  return (
    <ThemeView screenType="signUp" style={[globalStyles.container, styles.container]}>
      <SafeAreaView style={styles.safeArea}>
        <Image style={styles.icon} source={require('../assets/logo.png')} />
        <ThemeText type="title" style={styles.title}>Create Account</ThemeText>

        <ThemeInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          errorText={fullName.trim().length === 0 && fullName !== '' ? VALIDATION_ERRORS.REQUIRED_FULL_NAME : undefined}
        />

        <ThemeInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          errorText={emailValidation === ValidationStates.Invalid ? VALIDATION_ERRORS.INVALID_EMAIL : undefined}
        />

        <ThemeInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          errorText={passwordValidation === ValidationStates.Invalid ? VALIDATION_ERRORS.INVALID_PASSWORD : undefined}
        />

        <ThemeInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          errorText={password !== confirmPassword && confirmPassword !== '' ? "Passwords do not match" : undefined}
        />

        <ThemeButton
          title="REGISTER"
          onPress={handleSignUp}
          disabled={!isFormValid}
          loading={isLoading}
        />

        <ThemeButton
          title="Already have an account? Log In"
          variant="secondary"
          onPress={() => router.push('/login')}
          style={styles.loginBtn}
        />
      </SafeAreaView>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    backgroundColor: '#A3A3A3',
    justifyContent: 'center',
  },
  safeArea: {
    width: '100%',
    paddingTop: 60,
  },
  icon: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 50,
    textAlign: 'center',
    lineHeight: 45,
  },
  loginBtn: {
    marginTop: 20,
    backgroundColor: 'transparent',
  }
});
