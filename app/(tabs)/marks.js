import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MarksScreen() {
  const [marks, setMarks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rawHtml, setRawHtml] = useState('');

  useEffect(() => {
    const fetchMarks = async () => {
      setLoading(true);
      setError('');
      setMarks(null);
      setRawHtml('');
      try {
        console.log('[Marks] Fetching credentials from AsyncStorage...');
        const creds = await AsyncStorage.getItem('ta_credentials');
        if (!creds) {
          setError('Not logged in.');
          console.log('[Marks] No credentials found.');
          setLoading(false);
          return;
        }
        const { username, password } = JSON.parse(creds);
        console.log('[Marks] Credentials loaded:', username ? 'username present' : 'no username', password ? 'password present' : 'no password');
        console.log('[Marks] Sending POST request to Fetch-TA-Data API...');
        const response = await fetch('https://api.pegasis.site/public/yrdsb_ta/getmark_v2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ number: username, password }),
        });
        console.log('[Marks] Response status:', response.status);
        if (response.status === 400) {
          setError('Bad request. Please check your credentials.');
          return;
        } else if (response.status === 401) {
          setError('Password incorrect.');
          return;
        } else if (response.status === 500) {
          setError('Internal server error. Please try again later.');
          return;
        } else if (response.status === 503) {
          setError('TeachAssist server is down. Please try again later.');
        return;
      }
        const data = await response.json();
        console.log('[Marks] Response data:', data);
        if (Array.isArray(data)) {
          setMarks(data);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError('Unexpected response from server.');
        }
    } catch (err) {
        setError('Failed to fetch marks.');
        console.log('[Marks] Error:', err);
    } finally {
      setLoading(false);
    }
  };
    fetchMarks();
  }, []);

    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Your Marks</Text>
        {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {marks && Array.isArray(marks) && marks.length > 0 && (
          <View style={styles.marksSection}>
            <Text style={styles.sectionTitle}>Courses</Text>
            {marks.map((course, idx) => (
              <View key={idx} style={styles.courseCard}>
                <Text style={styles.courseName}>{course.name} ({course.code})</Text>
                <Text style={styles.courseMark}>Mark: {course.overall_mark ? course.overall_mark.toFixed(1) : 'N/A'}</Text>
                <Text style={styles.courseMeta}>Room: {course.room} | Block: {course.block}</Text>
                {course.assignments && course.assignments.length > 0 && (
                  <View style={styles.assignmentsSection}>
                    <Text style={styles.assignmentsTitle}>Assignments:</Text>
                    {course.assignments.map((a, i) => (
                      <View key={i} style={styles.assignmentCard}>
                        <Text style={styles.assignmentName}>{a.name}</Text>
                        {a.feedback && <Text style={styles.assignmentFeedback}>Feedback: {a.feedback}</Text>}
                        {/* Show KU, F, O, A, C, T if present */}
                        {['KU','F','O','A','C','T'].map(cat => a[cat] && a[cat].length > 0 ? (
                          <Text key={cat} style={styles.assignmentCat}>{cat}: {a[cat][0].get}/{a[cat][0].total} (Weight: {a[cat][0].weight})</Text>
                        ) : null)}
            </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 18,
  },
  error: {
    color: '#FF3B30',
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  marksSection: {
    marginTop: 24,
    width: '100%',
    maxWidth: 400,
  },
  sectionTitle: {
    color: '#00BFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  courseCard: {
    backgroundColor: '#181A20',
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
  },
  courseName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  courseMark: {
    color: '#B0B0B0',
    fontSize: 15,
    marginTop: 2,
  },
  courseMeta: {
    color: '#B0B0B0',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 6,
  },
  assignmentsSection: {
    marginTop: 10,
    backgroundColor: '#232A3E',
    borderRadius: 8,
    padding: 10,
  },
  assignmentsTitle: {
    color: '#00BFFF',
    fontWeight: '700',
    marginBottom: 6,
  },
  assignmentCard: {
    marginBottom: 10,
    backgroundColor: '#181A20',
    borderRadius: 6,
    padding: 8,
  },
  assignmentName: {
    color: '#fff',
    fontWeight: '600',
  },
  assignmentFeedback: {
    color: '#B0B0B0',
    fontSize: 13,
    marginTop: 2,
  },
  assignmentCat: {
    color: '#B0B0B0',
    fontSize: 13,
    marginTop: 2,
  },
}); 