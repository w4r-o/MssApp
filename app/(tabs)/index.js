import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Dummy announcements data
const ANNOUNCEMENTS = [
  {
    id: '1',
    title: 'Semester 2 Course Selection',
    date: 'Apr 26',
    description: 'Course selection for next semester opens tomorrow. Meet with guidance counselors to finalize your choices.',
    type: 'academic',
  },
  {
    id: '2',
    title: 'Spring Sports Tryouts',
    date: 'Apr 27',
    description: 'Baseball and soccer team tryouts start next week. Sign up in the athletics office.',
    type: 'sports',
  },
  {
    id: '3',
    title: 'Math Contest Results',
    date: 'Apr 25',
    description: 'Congratulations to all participants! Results will be posted this Friday.',
    type: 'contest',
  },
];

const ToolCard = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.toolCard} onPress={onPress}>
    <Ionicons name={icon} size={32} color="#007AFF" />
    <Text style={styles.toolTitle}>{title}</Text>
  </TouchableOpacity>
);

const AnnouncementCard = ({ title, date, description, type }) => (
  <TouchableOpacity style={styles.announcementCard}>
    <View style={styles.announcementHeader}>
      <View style={styles.announcementMeta}>
        <Text style={styles.announcementTitle}>{title}</Text>
        <Text style={styles.announcementDate}>{date}</Text>
      </View>
      <View style={[styles.typeBadge, { backgroundColor: type === 'academic' ? '#e3f2fd' : type === 'sports' ? '#f0fdf4' : '#fdf2f8' }]}>
        <Text style={[styles.typeText, { color: type === 'academic' ? '#1976d2' : type === 'sports' ? '#16a34a' : '#be185d' }]}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Text>
      </View>
    </View>
    <Text style={styles.announcementDescription}>{description}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const router = useRouter();

  const tools = [
    { title: 'View Marks', icon: 'school-outline', route: '/marks' },
    { title: 'Upload Notes', icon: 'document-outline', route: '/notes' },
    { title: 'Practice Tests', icon: 'pencil-outline', route: '/tests' },
    { title: 'Study Timer', icon: 'timer-outline', route: '/study' },
    { title: 'Resources', icon: 'library-outline', route: '/resources' },
    { title: 'Find Teachers', icon: 'people-outline', route: '/teachers' },
    { title: 'Volunteering', icon: 'heart-outline', route: '/volunteer' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.announcementsSection}>
        <Text style={styles.sectionTitle}>Announcements</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.announcementsList}
        >
          {ANNOUNCEMENTS.map((announcement) => (
            <AnnouncementCard key={announcement.id} {...announcement} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.toolsSection}>
        <Text style={styles.sectionTitle}>Tools</Text>
        <View style={styles.toolsGrid}>
          {tools.map((tool, index) => (
            <ToolCard
              key={index}
              title={tool.title}
              icon={tool.icon}
              onPress={() => router.push(tool.route)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
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
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  announcementsSection: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  announcementsList: {
    paddingHorizontal: 15,
  },
  announcementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  announcementMeta: {
    flex: 1,
    marginRight: 10,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  announcementDate: {
    fontSize: 14,
    color: '#666',
  },
  announcementDescription: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  toolsSection: {
    paddingVertical: 20,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
  },
  toolCard: {
    backgroundColor: '#fff',
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toolTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
}); 