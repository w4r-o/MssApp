import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Student from '../src/lib/teachassist/Student';
import { Ionicons } from '@expo/vector-icons';
import Header from './components/Header';
import { useSidebar } from '../src/context/SidebarContext';

const periodTimes = {
  '1': '8:20 am – 9:40 am',
  '2': '9:45 am – 11:00 am',
  '3': '11:05 am – 12:20 pm',
  '4': '12:25 pm – 1:40 pm',
  '5': '1:45 pm – 3:00 pm',
};

function getMarkColor(mark) {
  if (mark >= 90) return '#2E7D32';
  if (mark >= 80) return '#388E3C';
  if (mark >= 70) return '#FFA000';
  return '#D32F2F';
}

function getMarkBg(mark) {
  if (mark >= 90) return '#E8F5E922';
  if (mark >= 80) return '#F1F8E922';
  if (mark >= 70) return '#FFF3E022';
  return '#FFEBEE22';
}

export default function TeachAssistScreen() {
  const { openSidebar } = useSidebar();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        setError('');
        const creds = await AsyncStorage.getItem('ta_credentials');
        if (!creds) throw new Error('Not logged in');
        const { username, password } = JSON.parse(creds);
        const student = new Student(username, password);
        await student.login();
        const courses = await student.getCourses();
        setCourses(courses);
      } catch (err) {
        console.error('[TeachAssist] Fetch courses error:', err, err?.message, err?.stack);
        setError(err.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (!courses.length) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
        <View style={styles.center}>
          <Header openSidebar={openSidebar} title="TeachAssist" />
          <Text style={styles.emptyTitle}>No courses found</Text>
          <Text style={styles.emptyText}>You have no courses to display. Please check back later.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      <Header openSidebar={openSidebar} title="TeachAssist" />
      <FlatList
        style={{ backgroundColor: '#121212' }}
        contentContainerStyle={{ padding: 16, paddingTop: 0 }}
        data={courses}
        keyExtractor={(_, idx) => idx.toString()}
        ListHeaderComponent={error ? <Text style={styles.demoBanner}>{error}</Text> : null}
        renderItem={({ item, index }) => {
          const markColor = getMarkColor(item.overallMark);
          const markBg = getMarkBg(item.overallMark);
          return (
            <View style={[styles.card, { borderLeftColor: markColor }]}> 
              <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.courseCode}>{item.code}</Text>
                  <Text style={styles.courseName}>{item.name}</Text>
                  <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={14} color="#888" style={{ marginRight: 4 }} />
                    <Text style={styles.infoText}>Period {item.block}</Text>
                    <Text style={styles.infoText}> • {periodTimes[item.block]}</Text>
                    <Ionicons name="location-outline" size={14} color="#888" style={{ marginLeft: 12, marginRight: 4 }} />
                    <Text style={styles.infoText}>Room {item.room}</Text>
                  </View>
                </View>
                <View style={[styles.markBadge, { backgroundColor: markBg }]}> 
                  <Text style={[styles.markText, { color: markColor }]}>{item.overallMark.toFixed(1)}%</Text>
                  <Text style={[styles.markLabel, { color: markColor }]}>Current</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.showDetails} onPress={() => setExpanded(expanded === index ? null : index)}>
                <Text style={styles.showDetailsText}>{expanded === index ? 'Hide details' : 'Show details'}</Text>
                <Ionicons name={expanded === index ? 'chevron-up' : 'chevron-down'} size={16} color="#00BFFF" />
              </TouchableOpacity>
              {expanded === index && (
                <View style={styles.detailsSection}>
                  <Text style={styles.detailsLabel}>Mark Breakdown (Demo):</Text>
                  <Text style={styles.detailsText}>K: {item.kWeight}%  T: {item.tWeight}%  C: {item.cWeight}%  A: {item.aWeight}%</Text>
                </View>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 18,
    marginBottom: 18,
    padding: 18,
    borderLeftWidth: 5,
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
  courseCode: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 2,
  },
  courseName: {
    color: '#B0B0B0',
    fontSize: 15,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  infoText: {
    color: '#B0B0B0',
    fontSize: 13,
    marginRight: 2,
  },
  markBadge: {
    minWidth: 70,
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 12,
  },
  markText: {
    fontWeight: '700',
    fontSize: 20,
  },
  markLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  showDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#232A3E',
  },
  showDetailsText: {
    color: '#00BFFF',
    fontWeight: '600',
    fontSize: 15,
    marginRight: 4,
  },
  detailsSection: {
    marginTop: 10,
    backgroundColor: '#181A20',
    borderRadius: 10,
    padding: 12,
  },
  detailsLabel: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  detailsText: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
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
  },
  demoBanner: {
    color: '#FFA000',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  }
}); 