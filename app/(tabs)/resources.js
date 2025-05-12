import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Linking, TouchableOpacity } from 'react-native';

// TODO: Replace with real service if available
async function fetchResources() {
  // Simulate async fetch
  return [
    { id: '1', name: 'Math Notes', url: 'https://example.com/math-notes.pdf' },
    { id: '2', name: 'Science Guide', url: 'https://example.com/science-guide.pdf' },
  ];
}

export default function ResourcesScreen() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResources()
      .then(setResources)
      .catch((err) => setError(err.message || 'Failed to load resources'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (error) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>{error}</Text></View>;

  return (
    <FlatList
      data={resources}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => Linking.openURL(item.url)} style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
          <Text style={{ fontWeight: 'bold', color: '#007AFF' }}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
} 