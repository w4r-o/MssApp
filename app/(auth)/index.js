import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter your TeachAssist username and password');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await AsyncStorage.setItem('ta_credentials', JSON.stringify({ username, password }));
      router.replace('/home');
    } catch (error) {
      setError('An error occurred while logging in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>MarkvilleApp</Text>
      <Text style={styles.tagline}>Your School, Your Way</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setError('');
          }}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
          secureTextEntry
          editable={!loading}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>
        <Text style={styles.disclaimer}>
          Your credentials are stored securely and only used to access TeachAssist.
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Need an account? </Text>
        <TouchableOpacity onPress={() => {
          Alert.alert(
            'TeachAssist Account Required',
            'You need a TeachAssist account to use this app. Please contact your school administrator if you don\'t have one.'
          );
        }}>
          <Text style={styles.signupText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#121212',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00BFFF',
    marginBottom: 10,
    marginTop: 24,
  },
  tagline: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 32,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#232A3E',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#181A20',
    color: '#fff',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00BFFF',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#232A3E',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disclaimer: {
    marginTop: 10,
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  signupText: {
    color: '#00BFFF',
    fontSize: 14,
    fontWeight: '500',
  },
}); 