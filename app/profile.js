import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'lucide-react-native';
import Header from './components/Header';
import { useSidebar } from '../src/context/SidebarContext';

export default function ProfileScreen() {
  const { openSidebar } = useSidebar();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const creds = await AsyncStorage.getItem('ta_credentials');
        if (!creds) throw new Error('Not logged in');
        setProfile(JSON.parse(creds));
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (loading) return null;
  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
        <View style={styles.center}>
          <Header openSidebar={openSidebar} title="Profile" />
          <Text style={styles.emptyTitle}>Profile not found</Text>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }
  const user = profile || { username: 'Student', avatar: null };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      <Header openSidebar={openSidebar} title="Profile" />
      <View style={styles.avatarWrap}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <User color="#fff" size={48} />
        )}
      </View>
      <Text style={styles.name}>{user.username}</Text>
      <Text style={styles.meta}>Grade 12 • Student</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatarWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#232A3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  meta: {
    color: '#00BFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyText: {
    color: '#B0B0B0',
    fontSize: 16,
  },
}); 