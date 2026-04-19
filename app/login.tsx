import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, SafeAreaView, Image, View } from 'react-native';
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailValidation, setEmailValidation] = useState<ValidationStates>(ValidationStates.None);
  const [passwordValidation, setPasswordValidation] = useState<ValidationStates>(ValidationStates.None);
  const [isFormValid, setIsFormValid] = useState(false);

  const router = useRouter();
  const { signIn, isLoading } = useFirebaseAuth();

  useEffect(() => {
    const isValidEmail = email.includes('@') && email.indexOf('@') > 0;
    setEmailValidation(email ? (isValidEmail ? ValidationStates.Valid : ValidationStates.Invalid) : ValidationStates.None);

    setPasswordValidation(password ? (password.length > 8 ? ValidationStates.Valid : ValidationStates.Invalid) : ValidationStates.None);
  }, [email, password]);

  useEffect(() => {
    setIsFormValid(
      emailValidation === ValidationStates.Valid &&
      passwordValidation === ValidationStates.Valid
    );
  }, [emailValidation, passwordValidation]);

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      router.replace('/(tabs)/dashboard');
    } catch (error: any) {
      console.warn('Login warning:', error);
      Alert.alert(UI_MESSAGES.TITLES.LOGIN_FAILED, error.message || UI_MESSAGES.ERRORS.INVALID_CREDENTIALS);
    }
  };

  return (
    <ThemeView screenType="login" style={[globalStyles.container, styles.container]}>
      <SafeAreaView style={styles.safeArea}>
        <Image style={styles.icon} source={require('../assets/logo.png')} />
        <ThemeText type="title" style={styles.title}>Welcome Back</ThemeText>

        <ThemeInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          errorText={emailValidation === ValidationStates.Invalid ? VALIDATION_ERRORS.INVALID_EMAIL : undefined}
        />

        <View style={{ marginTop: 10 }}>
          <ThemeInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            errorText={passwordValidation === ValidationStates.Invalid ? VALIDATION_ERRORS.INVALID_PASSWORD : undefined}
          />
        </View>

        <ThemeButton
          title="Login"
          onPress={handleLogin}
          disabled={!isFormValid}
          loading={isLoading}
        />

        <ThemeButton
          title="Don't have an account? Sign Up"
          variant="secondary"
          onPress={() => router.push('/signup')}
          style={styles.signupBtn}
        />
      </SafeAreaView>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  safeArea: {
    width: '100%',
    paddingTop: 40,
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
  signupBtn: {
    marginTop: 20,
    backgroundColor: 'transparent',
  }
});
