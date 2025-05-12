import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Student from the teachassist package
const { Student } = require('teachassist');

export default function MarksScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchMarks() {
      setLoading(true);
      setError(null);
      setCourses([]);
      try {
        // Get credentials from AsyncStorage
        const credsStr = await AsyncStorage.getItem('ta_credentials');
        if (!credsStr) {
          setError('Not logged in. Please log in first.');
          setLoading(false);
          return;
        }
        const creds = JSON.parse(credsStr);
        const { username, password } = creds;
        if (!username || !password) {
          setError('Missing credentials.');
          setLoading(false);
          return;
        }

        // Use the teachassist Student class
        const student = new Student(username, password);
        const courses = await student.getCourses();
        setCourses(courses);
      } catch (err) {
        console.error('[Marks] Error:', err);
        setError('Failed to load marks.');
      } finally {
        setLoading(false);
      }
    }
    fetchMarks();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#00BFFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Marks Screen</Text>
      {courses.length > 0 ? (
        courses.map((course, idx) => (
          <View key={idx} style={{ marginBottom: 16 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{course.name}</Text>
            <Text style={{ color: '#fff' }}>Room: {course.room}</Text>
            <Text style={{ color: '#fff' }}>Mark: {course.grade}%</Text>
          </View>
        ))
      ) : (
        <Text>No courses found.</Text>
      )}
    </ScrollView>
  );
} 