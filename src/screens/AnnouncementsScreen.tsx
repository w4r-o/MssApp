import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../types/navigation';

type IconName = 'view-grid' | 'school' | 'basketball' | 'account-group' | 'calendar' | 'trophy' | 'calculator' | 'flask' | 'code-tags' | 'music';

interface Category {
  id: string;
  label: string;
  icon: IconName;
}

interface Announcement {
  id: string;
  title: string;
  category: string;
  date: string;
  description: string;
  icon: IconName;
}

const categories: Category[] = [
  { id: 'all', label: 'All', icon: 'view-grid' },
  { id: 'academic', label: 'Academic', icon: 'school' },
  { id: 'sports', label: 'Sports', icon: 'basketball' },
  { id: 'clubs', label: 'Clubs', icon: 'account-group' },
  { id: 'events', label: 'Events', icon: 'calendar' },
  { id: 'competitions', label: 'Competitions', icon: 'trophy' },
];

const announcements: Announcement[] = [
  {
    id: '1',
    title: 'Math Contest Registration',
    category: 'academic',
    date: '2024-05-15',
    description: 'Register for the upcoming Waterloo Math Contest. Open to all grades.',
    icon: 'calculator',
  },
  {
    id: '2',
    title: 'Basketball Team Tryouts',
    category: 'sports',
    date: '2024-05-10',
    description: 'Junior and Senior basketball team tryouts starting next week.',
    icon: 'basketball',
  },
  {
    id: '3',
    title: 'Science Fair Projects',
    category: 'academic',
    date: '2024-05-20',
    description: 'Submit your science fair project proposals by the end of this week.',
    icon: 'flask',
  },
  {
    id: '4',
    title: 'Coding Club Meeting',
    category: 'clubs',
    date: '2024-05-12',
    description: 'Weekly meeting in Room 210. New members welcome!',
    icon: 'code-tags',
  },
  {
    id: '5',
    title: 'Spring Concert',
    category: 'events',
    date: '2024-05-25',
    description: 'Annual spring concert featuring band and choir performances.',
    icon: 'music',
  },
];

const demoMarks: Record<string, string> = {
  'ICS3U1-1': '97.8',
  'TWJ3E1-3': '98',
  'MCR3U1-10': '67',
  'SPH3U1-9': '89',
};

export default function AnnouncementsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  const filteredAnnouncements = selectedCategory === 'all'
    ? announcements
    : announcements.filter(a => a.category === selectedCategory);

  const renderAnnouncement = ({ item }: { item: Announcement }) => (
    <TouchableOpacity style={styles.card}>
      <LinearGradient
        colors={['rgba(0, 124, 240, 0.1)', 'rgba(0, 124, 240, 0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={item.icon} size={24} color="#007CF0" />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDate}>{new Date(item.date).toLocaleDateString()}</Text>
          </View>
        </View>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <LinearGradient
        colors={['#000000', '#111111']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.menuButton}
          >
            <MaterialCommunityIcons name="menu" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Announcements</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categories}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              onPress={() => setSelectedCategory(category.id)}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.selectedCategory,
              ]}
            >
              <MaterialCommunityIcons
                name={category.icon}
                size={20}
                color={selectedCategory === category.id ? '#007CF0' : '#FFFFFF'}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={filteredAnnouncements}
          renderItem={renderAnnouncement}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  categories: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedCategory: {
    backgroundColor: 'rgba(0, 124, 240, 0.1)',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  selectedCategoryText: {
    color: '#007CF0',
    opacity: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111111',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardGradient: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 124, 240, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 20,
  },
}); 