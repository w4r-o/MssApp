import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { BookOpen, Download, Star, User2 } from 'lucide-react-native';
import Header from './components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSidebar } from '../src/context/SidebarContext';

const CATEGORIES = ['All', 'Mathematics', 'Science', 'English', 'History'];
const RESOURCES = [
  {
    title: 'Grade 12 Calculus Notes',
    category: 'Mathematics',
    author: 'Sarah K.',
    downloads: 156,
    rating: 4.8,
  },
  {
    title: 'Chemistry Unit 3 Study Guide',
    category: 'Science',
    author: 'Mike R.',
    downloads: 89,
    rating: 4.5,
  },
  {
    title: 'English Essay Writing Tips',
    category: 'English',
    author: 'Emma L.',
    downloads: 234,
    rating: 4.9,
  },
];

export default function ResourcesScreen() {
  const { openSidebar } = useSidebar();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = RESOURCES.filter(
    (r) =>
      (category === 'All' || r.category === category) &&
      (r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.author.toLowerCase().includes(search.toLowerCase()))
  );

  const resources = filtered.length ? filtered : RESOURCES;

  if (!resources.length) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
        <View style={styles.center}>
          <Header openSidebar={openSidebar} title="Resources" />
          <Text style={styles.emptyTitle}>No resources found</Text>
          <Text style={styles.emptyText}>Try a different search or check back later.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      <Header openSidebar={openSidebar} title="Resources" />
      <TextInput
        style={styles.search}
        placeholder="Search resources..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={{ gap: 10 }}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, category === cat && styles.chipActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={resources}
        keyExtractor={(item, idx) => String(item.title || idx)}
        contentContainerStyle={{ paddingBottom: 32, paddingTop: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.category}>{item.category}</Text>
                <View style={styles.infoRow}>
                  <User2 color="#888" size={16} style={{ marginRight: 4 }} />
                  <Text style={styles.infoText}>{item.author}</Text>
                  <BookOpen color="#888" size={16} style={{ marginLeft: 12, marginRight: 4 }} />
                  <Text style={styles.infoText}>{item.downloads}</Text>
                  <Star color="#FFD700" size={16} style={{ marginLeft: 12, marginRight: 4 }} />
                  <Text style={styles.infoText}>{item.rating}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.8} hitSlop={{top:12,bottom:12,left:12,right:12}}>
                <Download color="#fff" size={22} />
                <Text style={styles.downloadText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.shareBtn} activeOpacity={0.8} hitSlop={{top:12,bottom:12,left:12,right:12}}>
        <Text style={styles.shareBtnText}>+ Share Your Resources</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: '#181A20',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  chipRow: {
    marginBottom: 16,
  },
  chip: {
    backgroundColor: '#232A3E',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 7,
  },
  chipActive: {
    backgroundColor: '#00BFFF',
  },
  chipText: {
    color: '#B0B0B0',
    fontSize: 15,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 18,
    marginBottom: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 2,
  },
  category: {
    color: '#00BFFF',
    fontSize: 14,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  infoText: {
    color: '#B0B0B0',
    fontSize: 13,
    marginRight: 2,
  },
  downloadBtn: {
    backgroundColor: '#00BFFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  downloadText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    marginTop: 2,
  },
  shareBtn: {
    backgroundColor: '#232A3E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  shareBtnText: {
    color: '#00BFFF',
    fontWeight: '700',
    fontSize: 18,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  }
}); 