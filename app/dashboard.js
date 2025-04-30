import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const DashboardCard = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Ionicons name={icon} size={32} color="#007AFF" />
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function DashboardScreen() {
  const router = useRouter();

  const features = [
    { title: 'Upload Notes', icon: 'document-outline', route: '/notes' },
    { title: 'Practice Tests', icon: 'pencil-outline', route: '/tests' },
    { title: 'Study Timer', icon: 'timer-outline', route: '/study' },
    { title: 'Resources', icon: 'library-outline', route: '/resources' },
    { title: 'Find Teachers', icon: 'people-outline', route: '/teachers' },
    { title: 'Announcements', icon: 'megaphone-outline', route: '/announcements' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>
      </View>
      <View style={styles.grid}>
        {features.map((feature, index) => (
          <DashboardCard
            key={index}
            title={feature.title}
            icon={feature.icon}
            onPress={() => router.push(feature.route)}
          />
        ))}
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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  grid: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
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
  cardTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
}); 