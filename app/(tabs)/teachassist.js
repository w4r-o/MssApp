import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Student } from '../../src/lib/teachassist/Student';

export default function TeachAssistScreen() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        setError('');
        const creds = await AsyncStorage.getItem('ta_credentials');
        if (!creds) throw new Error('Not logged in');
        const { username, password } = JSON.parse(creds);
        const student = new Student(username, password);
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
  if (error) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>{error}</Text></View>;

  return (
    <FlatList
      data={courses}
      keyExtractor={(item, idx) => item.courseCode + idx}
      renderItem={({ item }) => (
        <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#eee' }}>
          <Text style={{ fontWeight: 'bold' }}>{item.courseName}</Text>
          <Text>Mark: {item.overallMark}</Text>
        </View>
      )}
    />
  );
} 