import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Header from './components/Header';
import { useSidebar } from '../src/context/SidebarContext';

const PERIOD_TIMES = {
  '1': '8:20 am - 9:40 am',
  '2': '9:45 am - 11:00 am',
  '3': '11:05 am - 12:20 pm',
  '4': '12:25 pm - 1:40 pm',
  '5': '1:45 pm - 3:00 pm',
};

export default function MarksScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const router = useRouter();
  const { openSidebar } = useSidebar();

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
        const response = await fetch('http://localhost:3001/api/getCourses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || 'Failed to fetch marks.');
        }
        const data = await response.json();
        console.log('[Marks] API Response:', JSON.stringify(data, null, 2));
        setCourses(Array.isArray(data.response) ? data.response : []);
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0A' }}>
        <View style={{ backgroundColor: '#181C24', borderRadius: 20, padding: 32, alignItems: 'center', shadowColor: '#007CF0', shadowOpacity: 0.15, shadowRadius: 12 }}>
          <ActivityIndicator size="large" color="#00BFFF" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0A' }}>
        <Header openSidebar={openSidebar} title="Marks" />
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  // Calculate average mark (exclude lunch/spare blocks and non-numeric marks)
  const validCourses = courses.filter(
    (course) =>
      course.block &&
      typeof course.overall_mark === 'number' &&
      course.block.toLowerCase() !== 'lunch' &&
      course.block.toLowerCase() !== 'spare'
  );
  const averageMark =
    validCourses.length > 0
      ? (validCourses.reduce((sum, c) => sum + c.overall_mark, 0) / validCourses.length).toFixed(2)
      : null;

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <Header openSidebar={openSidebar} title="Marks" />
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#fff' }}>Marks Screen</Text>
        {averageMark && (
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#00BFFF', marginBottom: 20 }}>
            Average Mark: {averageMark}%
          </Text>
        )}
        {courses.length > 0 ? (
          courses.map((course, idx) => (
            <View key={idx} style={{ marginBottom: 24, backgroundColor: '#232A3E', borderRadius: 20, padding: 20, width: 350, shadowColor: '#007CF0', shadowOpacity: 0.15, shadowRadius: 12 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>{course.code} - {course.name}</Text>
              <Text style={{ color: '#B0B0B0', marginTop: 4 }}>Period: {course.block} | Room: {course.room}</Text>
              <Text style={{ color: '#B0B0B0', marginTop: 2 }}>
                {PERIOD_TIMES[course.block] ? `Time: ${PERIOD_TIMES[course.block]}` : ''}
              </Text>
              <Text style={{ color: '#B0B0B0', marginTop: 2 }}>Start: {course.start_time} | End: {course.end_time}</Text>
              {course.dropped_time && <Text style={{ color: '#B0B0B0', marginTop: 2 }}>Dropped: {course.dropped_time}</Text>}
              <Text style={{ color: '#00BFFF', fontWeight: 'bold', fontSize: 18, marginTop: 8 }}>
                {course.isFinal ? `Final mark: ${course.overall_mark}%` : course.isMidterm ? `Midterm mark: ${course.overall_mark}%` : `Mark: ${course.overall_mark ?? course.grade ?? 'N/A'}%`}
              </Text>
              <TouchableOpacity
                style={{ marginTop: 16, backgroundColor: '#007CF0', borderRadius: 10, padding: 12, alignItems: 'center' }}
                onPress={() => router.push({ pathname: '/assignment-details', params: { course: JSON.stringify(course) } })}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Show Assignments</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={{ color: '#fff' }}>No courses found.</Text>
        )}
      </ScrollView>
    </View>
  );
} 