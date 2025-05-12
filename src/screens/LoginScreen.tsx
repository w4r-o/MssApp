import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import Student from '../lib/teachassist/Student';
import TeachAssistError from '../lib/teachassist/TeachAssistError';
import { secureStorage } from '../services/secureStorage';

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Debug logging on mount
  useEffect(() => {
    console.warn('[LoginScreen] Screen mounted - TESTING CONSOLE OUTPUT');
  }, []);

  const handleLogin = async () => {
    console.warn('[LoginScreen] ====== LOGIN ATTEMPT STARTED ======');
    console.warn('[LoginScreen] Button pressed with username:', username);
    
    // Validate inputs
    if (!username || !password) {
      console.warn('[LoginScreen] Validation failed: missing credentials');
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    try {
      console.warn('[LoginScreen] Starting login process...');
      setIsLoading(true);
      
      console.warn('[LoginScreen] Creating Student instance...');
      const student = new Student(username, password);
      
      console.warn('[LoginScreen] Attempting to fetch courses...');
      await student.getCourses();
      console.warn('[LoginScreen] Courses fetched:');
      
      // Save credentials securely
      await secureStorage.setCredentials(username, password);
      
      console.warn('[LoginScreen] Navigating to Home screen...');
      navigation.navigate('Home' as never);
      console.warn('[LoginScreen] Navigation called');
    } catch (error: any) {
      console.warn('[LoginScreen] Error occurred:', error);
      console.warn('[LoginScreen] Error stack:', error.stack);
      
      if (error instanceof TeachAssistError) {
        Alert.alert('Login Failed', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      console.warn('[LoginScreen] Login attempt completed');
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="school"
            size={64}
            color="#007CF0"
          />
          <Text style={styles.title}>MarkvilleApp</Text>
          <Text style={styles.subtitle}>Welcome to Markville</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={username}
            onChangeText={(text) => {
              console.warn('[LoginScreen] Username changed:', text ? 'Text entered' : 'Empty');
              setUsername(text);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={password}
              onChangeText={(text) => {
                console.warn('[LoginScreen] Password changed:', text ? 'Text entered' : 'Empty');
                setPassword(text);
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => {
                console.warn('[LoginScreen] Toggle password visibility');
                setShowPassword(!showPassword);
              }}
              disabled={isLoading}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="rgba(255, 255, 255, 0.5)"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={() => {
              Alert.alert('Test', 'Login button pressed');
              console.warn('[LoginScreen] Login button pressed - calling handleLogin');
              handleLogin();
            }}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  form: {
    gap: 16,
  },
  input: {
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  eyeButton: {
    padding: 12,
  },
  loginButton: {
    height: 56,
    backgroundColor: '#007CF0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
}); 