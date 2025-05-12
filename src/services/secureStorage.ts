import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './Header';

interface Credentials {
  username: string;
  password: string;
}

class SecureStorage {
  private static CREDENTIALS_KEY = '@markvilleapp:credentials';

  async setCredentials(username: string, password: string): Promise<void> {
    try {
      // Simple obfuscation - not true encryption but better than plain text
      const obfuscatedUsername = this.obfuscate(username);
      const obfuscatedPassword = this.obfuscate(password);
      
      const credentials: Credentials = {
        username: obfuscatedUsername,
        password: obfuscatedPassword
      };
      
      await AsyncStorage.setItem(
        SecureStorage.CREDENTIALS_KEY,
        JSON.stringify(credentials)
      );
    } catch (error) {
      console.error('Error saving credentials:', error);
      throw error;
    }
  }

  async getCredentials(): Promise<Credentials | null> {
    try {
      const stored = await AsyncStorage.getItem(SecureStorage.CREDENTIALS_KEY);
      if (!stored) return null;
      
      const credentials = JSON.parse(stored) as Credentials;
      
      // Deobfuscate the credentials
      return {
        username: this.deobfuscate(credentials.username),
        password: this.deobfuscate(credentials.password)
      };
    } catch (error) {
      console.error('Error retrieving credentials:', error);
      return null;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SecureStorage.CREDENTIALS_KEY);
    } catch (error) {
      console.error('Error clearing credentials:', error);
      throw error;
    }
  }

  private obfuscate(text: string): string {
    // Simple obfuscation by shifting characters | make better encryption bruh
    return text.split('').map(char => 
      String.fromCharCode(char.charCodeAt(0) + 1)
    ).join('');
  }

  private deobfuscate(text: string): string {
    // Reverse the obfuscation
    return text.split('').map(char => 
      String.fromCharCode(char.charCodeAt(0) - 1)
    ).join('');
  }
}

export const secureStorage = new SecureStorage(); 