import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';

// TODO: Replace with real service if available
async function fetchAnnouncements() {
  // Simulate async fetch
  return [
    { id: '1', title: 'Welcome to the app!', date: '2024-05-07' },
    { id: '2', title: 'New features coming soon.', date: '2024-05-08' },
  ];
}

export default function AnnouncementsScreen() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnnouncements()
      .then(setAnnouncements)
      .catch((err) => setError(err.message || 'Failed to load announcements'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (error) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>{error}</Text></View>;

  return (
    <FlatList
      data={announcements}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
          <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
          <Text style={{ color: '#888' }}>{item.date}</Text>
        </View>
      )}
    />
  );
} 