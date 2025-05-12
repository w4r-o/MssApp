import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, Megaphone, School, BookOpen, FileText, Timer, User } from 'lucide-react-native';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, route: '/home' },
  { label: 'Announcements', icon: Megaphone, route: '/announcements' },
  { label: 'Marks', icon: School, route: '/marks' },
  { label: 'Resources', icon: BookOpen, route: '/resources' },
  { label: 'Practice Tests', icon: FileText, route: '/tests' },
  { label: 'Study Timer', icon: Timer, route: '/study' },
];

export default function Sidebar({ closeSidebar }) {
  const router = useRouter();
  // TODO: Replace with real user data
  const user = { name: 'Alex Chen', grade: 12, role: 'Student', avatar: null };

  return (
    <View style={styles.sidebar}>
      <View style={styles.menu}>
        {NAV_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuItem}
            onPress={() => {
              closeSidebar();
              router.push(item.route);
            }}
          >
            <item.icon color="#00BFFF" size={24} style={{ marginRight: 16 }} />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.spacer} />
      <View style={styles.profileSection}>
        <View style={styles.avatarWrap}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <User color="#fff" size={32} />
          )}
        </View>
        <View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileMeta}>Grade {user.grade} • {user.role}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 32,
    justifyContent: 'flex-start',
  },
  menu: {
    marginTop: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  menuLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  spacer: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#232A3E',
    paddingTop: 18,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#232A3E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  profileMeta: {
    color: '#00BFFF',
    fontSize: 14,
    marginTop: 2,
  },
}); 