import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import Header from './components/Header';
import { useSidebar } from '../src/context/SidebarContext';

const TAGS = ['All', 'Academic', 'Sports', 'Competitions'];
const ANNOUNCEMENTS = [
  {
    title: 'Semester 2 Course Selection',
    date: 'Apr 26',
    tag: 'Academic',
    content: 'Course selection for next semester opens tomorrow. Meet with guidance counselors to finalize your choices.',
  },
  {
    title: 'Spring Sports Tryouts',
    date: 'Apr 27',
    tag: 'Sports',
    content: 'Baseball and soccer tryouts start next week. Sign up in the gym office.',
  },
  {
    title: 'Math Competition',
    date: 'Apr 30',
    tag: 'Competitions',
    content: 'Register for the upcoming math competition by Friday. See your math teacher for details.',
  },
];

export default function AnnouncementsScreen() {
  const { openSidebar } = useSidebar();
  const [tag, setTag] = useState('All');

  const filtered = ANNOUNCEMENTS.filter((a) => tag === 'All' || a.tag === tag);
  const announcements = filtered.length ? filtered : ANNOUNCEMENTS;

  if (!announcements.length) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
        <View style={styles.center}>
          <Header openSidebar={openSidebar} title="Announcements" />
          <Text style={styles.emptyTitle}>No announcements</Text>
          <Text style={styles.emptyText}>Check back later for new announcements.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      <Header openSidebar={openSidebar} title="Announcements" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow} contentContainerStyle={{ gap: 10 }}>
        {TAGS.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.chip, tag === t && styles.chipActive]}
            onPress={() => setTag(t)}
          >
            <Text style={[styles.chipText, tag === t && styles.chipTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardRow} contentContainerStyle={{ gap: 18 }}>
        {announcements.map((item, idx) => (
          <View key={item.title || idx} style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.rowBetween}>
              <Text style={styles.date}>{item.date}</Text>
              <View style={styles.tagBadge}><Text style={styles.tagText}>{item.tag}</Text></View>
            </View>
            <Text style={styles.content}>{item.content}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  cardRow: {
    flexGrow: 0,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 18,
    width: 320,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 18,
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  tagBadge: {
    backgroundColor: '#232A3E',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tagText: {
    color: '#00BFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  content: {
    color: '#B0B0B0',
    fontSize: 15,
    marginTop: 6,
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