import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BookOpen, Timer, Users, HeartHandshake, Megaphone, FileText } from 'lucide-react-native';
import Header from './components/Header';
import { getAnnouncements } from '../src/services/announcements';
import { useSidebar } from '../src/context/SidebarContext';

const TOOLS = [
  { title: 'Marks', icon: Megaphone, route: '/marks', accent: '#00BFFF' },
  { title: 'Practice Tests', icon: FileText, route: '/tests', accent: '#00BFFF' },
  { title: 'Study Timer', icon: Timer, route: '/study', accent: '#00BFFF' },
  { title: 'Resources', icon: BookOpen, route: '/resources', accent: '#00BFFF' },
  { title: 'Find Teachers', icon: Users, route: '/teachers', accent: '#00BFFF' },
  { title: 'Volunteering', icon: HeartHandshake, route: '/volunteer', accent: '#00BFFF' },
  { title: 'Announcements', icon: Megaphone, route: '/announcements', accent: '#00BFFF' },
];

const TAGS = ['All', 'Academic', 'Sports', 'Competitions'];

// Announcement Card Component
function AnnouncementCard({ item, idx }) {
  // Defensive string conversion and fallbacks
  const title = item?.title ? String(item.title) : 'Untitled Announcement';
  const date = item?.date ? String(item.date) : '';
  const tagVal = item?.tag ? String(item.tag) : '';
  const content = item?.content ? String(item.content) : '';
  const cardKey = typeof item?.title === 'string' ? item.title : `announcement-${idx}`;

  return (
    <View key={cardKey} style={styles.announcementCard}>
      <Text style={styles.announcementTitle}>{title}</Text>
      <View style={styles.announcementMetaRow}>
        <Text style={styles.announcementDate}>{date}</Text>
        <View style={styles.announcementTagWrap}>
          <Text style={styles.announcementTag}>{tagVal}</Text>
        </View>
      </View>
      <Text style={styles.announcementContent}>{content}</Text>
    </View>
  );
}

// Tool Card Component
function ToolCard({ item, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={[styles.iconWrap, { backgroundColor: item.accent + '22' }]}> {/* 22 = 13% opacity */}
        {item.icon
          ? <item.icon color={item.accent} size={36} />
          : <Text style={{color: '#fff', fontSize: 24}}>?</Text>}
      </View>
      <Text style={styles.cardTitle}>{String(item.title || 'Tool')}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { openSidebar } = useSidebar();
  const numColumns = Dimensions.get('window').width > 600 ? 3 : 2;
  const [announcements, setAnnouncements] = useState([]);
  const [tag, setTag] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch announcements on mount
  useEffect(() => {
    setLoading(true);
    getAnnouncements()
      .then((data) => {
        setAnnouncements(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        setError('Failed to load announcements.');
        setAnnouncements([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Memoize filtered announcements for performance
  const filteredAnnouncements = useMemo(() => {
    const filtered = announcements.filter((a) => tag === 'All' || a.tag === tag);
    return filtered.length ? filtered : announcements;
  }, [announcements, tag]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header openSidebar={openSidebar} title="Home" />
      {/* Announcements filter and scroll */}
      <View style={styles.announcementsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll} contentContainerStyle={styles.tagScrollContent}>
          {TAGS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tagButton, { backgroundColor: tag === t ? '#00BFFF' : '#232A3E' }]}
              onPress={() => setTag(t)}
            >
              <Text style={[styles.tagText, { color: tag === t ? '#fff' : '#B0B0B0' }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Announcements List */}
        {loading ? (
          <ActivityIndicator size="small" color="#00BFFF" style={{ marginVertical: 24 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : filteredAnnouncements.length === 0 ? (
          <Text style={styles.emptyText}>No announcements found.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.announcementScroll} contentContainerStyle={styles.announcementScrollContent}>
            {filteredAnnouncements.map((item, idx) => (
              <AnnouncementCard item={item} idx={idx} key={typeof item?.title === 'string' ? item.title : `announcement-${idx}`} />
            ))}
          </ScrollView>
        )}
      </View>
      {/* Main grid of tools */}
      <FlatList
        data={TOOLS}
        keyExtractor={(item) => String(item.title || 'tool')}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <ToolCard item={item} onPress={() => router.push(item.route)} />
        )}
      />
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  announcementsSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  tagScroll: {
    marginBottom: 10,
  },
  tagScrollContent: {
    gap: 10,
  },
  tagButton: {
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 7,
  },
  tagText: {
    fontSize: 15,
    fontWeight: '500',
  },
  announcementScroll: {
    marginBottom: 18,
  },
  announcementScrollContent: {
    gap: 18,
  },
  announcementCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 18,
    width: 320,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 6,
  },
  announcementTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 2,
  },
  announcementMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  announcementDate: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  announcementTagWrap: {
    backgroundColor: '#232A3E',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  announcementTag: {
    color: '#00BFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  announcementContent: {
    color: '#B0B0B0',
    fontSize: 15,
    marginTop: 6,
  },
  errorText: {
    color: '#FF4D4F',
    fontSize: 15,
    marginVertical: 24,
    textAlign: 'center',
  },
  emptyText: {
    color: '#B0B0B0',
    fontSize: 15,
    marginVertical: 24,
    textAlign: 'center',
  },
  grid: {
    padding: 24,
    gap: 18,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    flex: 1,
    aspectRatio: 1.1,
    margin: 9,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00BFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    padding: 18,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
}); 