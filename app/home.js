import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { BookOpen, Timer, Users, HeartHandshake, Megaphone, FileText } from 'lucide-react-native';
import Header from './components/Header';
import { getAnnouncements } from '../src/services/announcements';
import { useSidebar } from '../src/context/SidebarContext';

const TOOLS = [
  { title: 'Practice Tests', icon: FileText, route: '/tests', accent: '#00BFFF' },
  { title: 'Study Timer', icon: Timer, route: '/study', accent: '#00BFFF' },
  { title: 'Resources', icon: BookOpen, route: '/resources', accent: '#00BFFF' },
  { title: 'Find Teachers', icon: Users, route: '/teachers', accent: '#00BFFF' },
  { title: 'Volunteering', icon: HeartHandshake, route: '/volunteer', accent: '#00BFFF' },
  { title: 'Announcements', icon: Megaphone, route: '/announcements', accent: '#00BFFF' },
];

const TAGS = ['All', 'Academic', 'Sports', 'Competitions'];

export default function HomeScreen() {
  const router = useRouter();
  const { openSidebar } = useSidebar();
  const numColumns = Dimensions.get('window').width > 600 ? 3 : 2;
  const [announcements, setAnnouncements] = useState([]);
  const [tag, setTag] = useState('All');

  useEffect(() => {
    getAnnouncements().then((data) => {
      setAnnouncements(data);
    });
  }, []);

  const filtered = announcements.filter((a) => tag === 'All' || a.tag === tag);
  const filteredAnnouncements = filtered.length ? filtered : announcements;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      <Header openSidebar={openSidebar} title="Home" />
      {/* Announcements filter and scroll */}
      <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }} contentContainerStyle={{ gap: 10 }}>
          {TAGS.map((t) => (
            <TouchableOpacity
              key={t}
              style={{
                backgroundColor: tag === t ? '#00BFFF' : '#232A3E',
                borderRadius: 16,
                paddingHorizontal: 18,
                paddingVertical: 7,
              }}
              onPress={() => setTag(t)}
            >
              <Text style={{ color: tag === t ? '#fff' : '#B0B0B0', fontSize: 15, fontWeight: '500' }}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }} contentContainerStyle={{ gap: 18 }}>
          {filteredAnnouncements.map((item, idx) => {
            const cardKey = typeof item.title === 'string' ? item.title : `announcement-${idx}`;
            const title = item.title ? String(item.title) : 'Untitled Announcement';
            const date = item.date ? String(item.date) : '';
            const tagVal = item.tag ? String(item.tag) : '';
            const content = item.content ? String(item.content) : '';
            return (
              <View key={cardKey} style={{
                backgroundColor: '#1E1E1E',
                borderRadius: 18,
                width: 320,
                padding: 18,
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 2,
                marginBottom: 6,
              }}>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18, marginBottom: 2 }}>{title}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ color: '#B0B0B0', fontSize: 14 }}>{date}</Text>
                  <View style={{ backgroundColor: '#232A3E', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3 }}>
                    <Text style={{ color: '#00BFFF', fontWeight: '600', fontSize: 13 }}>{tagVal}</Text>
                  </View>
                </View>
                <Text style={{ color: '#B0B0B0', fontSize: 15, marginTop: 6 }}>{content}</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
      {/* Main grid */}
      <FlatList
        data={TOOLS}
        keyExtractor={(item) => item.title}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => router.push(item.route)}
          >
            <View style={[styles.iconWrap, { backgroundColor: item.accent + '22' }]}> {/* 22 = 13% opacity */}
              <item.icon color={item.accent} size={36} />
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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