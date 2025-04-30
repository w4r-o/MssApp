import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 
               'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true
      });

      if (result.assets && result.assets[0]) {
        const file = result.assets[0];
        setNotes(currentNotes => [...currentNotes, {
          id: Date.now().toString(),
          name: file.name,
          uri: file.uri,
          type: file.mimeType,
          size: file.size
        }]);
      }
    } catch (err) {
      console.error('Document picking error:', err);
    }
  };

  const renderNote = ({ item }) => (
    <View style={styles.noteItem}>
      <View style={styles.noteInfo}>
        <Ionicons 
          name={item.type?.includes('pdf') ? 'document-text' : 'document'} 
          size={24} 
          color="#007AFF" 
        />
        <View style={styles.noteDetails}>
          <Text style={styles.noteName}>{item.name}</Text>
          <Text style={styles.noteSize}>
            {(item.size / 1024 / 1024).toFixed(2)} MB
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => {/* Implement view/download */}}>
        <Ionicons name="eye-outline" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notes</Text>
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={pickDocument}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {notes.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>No notes uploaded yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Tap the Upload button to add your first note
          </Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notesList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#666',
  },
  emptyStateSubtext: {
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  notesList: {
    padding: 20,
  },
  noteItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  noteDetails: {
    marginLeft: 10,
    flex: 1,
  },
  noteName: {
    fontSize: 16,
    fontWeight: '500',
  },
  noteSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
}); 