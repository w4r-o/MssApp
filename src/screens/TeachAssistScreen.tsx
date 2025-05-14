/* Insert a comment to indicate refactoring TeachAssistScreen to use Redux */
// Refactored TeachAssistScreen to use Redux (teachAssistSlice) for state management and auto-refresh/pull-to-refresh

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../types/navigation';
import { Student } from '../lib/teachassist';
import { CourseData, Assignment } from '../types/teachassist';
import { secureStorage } from '../services/secureStorage';
import Svg, { Circle } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setCourses, setLoading, setError } from '../store/slices/teachAssistSlice';
import CourseCard from '../components/CourseCard';
import AssignmentItem from '../components/AssignmentItem';

const PERIOD_TIMES: Record<string, string> = {
  '1': '8:20 am – 9:40 am',
  '2': '9:45 am – 11:00 am',
  '3': '11:05 am – 12:20 pm',
  '4': '12:25 pm – 1:40 pm',
  '5': '1:45 pm – 3:00 pm',
};

export default function TeachAssistScreen() {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const dispatch = useDispatch();
  const { courses, loading, error, lastUpdated } = useSelector((state: RootState) => state.teachAssist);
  const [demoMode, setDemoMode] = useState(false);

  // Demo marks mapping (if needed)
  const demoMarks: Record<string, string> = {
    'ICS3U1-1': '97.8', // Computer Science
    'TWJ3E1-3': '98',   // TWJ3E1-3
    'MCR3U1-10': '67',  // Math
    'SPH3U1-9': '89',   // Physics
  };

  const fetchCourses = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const credentials = await secureStorage.getCredentials();
      if (!credentials) {
        dispatch(setError('Please login first'));
        return;
      }
      const student = new Student(credentials.username, credentials.password);
      const coursesData = await student.getCourses();
      const transformedCourses = coursesData.map(course => ({
        id: course.id,
        name: course.name,
        code: course.code || 'N/A',
        teacher: course.teacher || 'N/A',
        room: course.room || 'N/A',
        mark: course.grade || 'N/A',
        block: course.block || '',
      }));
      dispatch(setCourses(transformedCourses));
      dispatch(setError(null));
    } catch (err) {
      console.error('TeachAssist Error:', err);
      dispatch(setError('Failed to load courses. Please check your credentials.'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Auto-refresh every 5 minutes (300000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCourses();
    }, 300000);
    return () => clearInterval(interval);
  }, [fetchCourses]);

  const onRefresh = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const credentials = await secureStorage.getCredentials();
      if (!credentials) {
        dispatch(setError('Please login first'));
        dispatch(setLoading(false));
        return;
      }
      const { username, password } = credentials;
      if (!username || !password) {
        dispatch(setError('TeachAssist credentials not set. Please update your settings.'));
        dispatch(setLoading(false));
        return;
      }
      const student = new Student(username, password);
      const courses: CourseData[] = await student.fetchCourses();
      dispatch(setCourses(courses));
    } catch (e) {
      dispatch(setError(e instanceof Error ? e.message : 'An unknown error occurred'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const getMarkBadgeColor = (mark: number) => {
    if (mark >= 90) return '#4CAF50'; // green
    if (mark >= 75) return '#8BC34A'; // light green
    if (mark >= 60) return '#FFC107'; // amber
    return '#F44336'; // red
  };

  const getCourseIdAndName = (courseCode: string, courseName: string) => {
    // Prefer splitting at colon in courseName, fallback to courseCode
    let id = courseCode;
    let name = courseName;
    if (courseName && courseName.includes(':')) {
      const [left, right] = courseName.split(':');
      id = left.trim();
      name = right?.trim() || left.trim();
    } else if (courseCode && courseCode.includes(':')) {
      const [left, right] = courseCode.split(':');
      id = left.trim();
      name = right?.trim() || left.trim();
    } else if (courseName && courseName.length > 0) {
      id = courseCode;
      name = courseName;
    } else {
      id = courseCode;
      name = courseCode;
    }
    return { id, name };
  };

  const renderCourseCard = (course: CourseData, idx: number) => (
    <View key={course.code || idx} style={styles.courseCard}>
      <Text style={styles.courseName}>{course.name}</Text>
      <Text>Teacher: {course.teacher} – Room: {course.room} – Block: {course.block}</Text>
      {course.assignments && course.assignments.map((assignment: Assignment, aidx: number) => (
        <AssignmentItem key={assignment.name + aidx} assignment={assignment} />
      ))}
        </View>
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
          <Text style={styles.headerTitle}>TeachAssist</Text>
          {lastUpdated && (
            <Text style={styles.lastUpdatedText}>Last updated: {new Date(lastUpdated).toLocaleString()}</Text>
          )}
        </View>
          {loading ? (
            <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading courses...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={24} color="#F44336" />
              <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchCourses} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor="#fff" />}
          >
            {courses.map((course: CourseData, idx: number) => renderCourseCard(course, idx))}
        </ScrollView>
        )}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  lastUpdatedText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: 'rgba(0, 124, 240, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007CF0',
  },
  scrollContent: {
    padding: 24,
  },
  taCardOuter: {
    backgroundColor: '#181A20',
    borderRadius: 18,
    marginBottom: 24,
    padding: 0,
    borderLeftWidth: 5,
    borderLeftColor: '#007CF0',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  taCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 14,
  },
  taCourseId: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  taCourseName: {
    fontSize: 16,
    color: '#eee',
    opacity: 0.92,
    marginBottom: 12,
    fontWeight: '500',
  },
  taInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 18,
    marginTop: 2,
    marginBottom: 2,
  },
  taInfoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#90caf9',
    marginLeft: 2,
  },
  taPeriodTimeText: {
    fontSize: 13,
    color: '#b0b0b0',
    marginTop: 2,
    marginLeft: 2,
    fontWeight: '500',
  },
  taMarkBadgeSvgContainer: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  taMarkBadgeSvgTextContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taMarkTextSvg: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  taDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.07)',
    marginHorizontal: 18,
    marginTop: 2,
    marginBottom: 0,
  },
  taDetailsButton: {
    margin: 16,
    marginTop: 8,
    marginBottom: 18,
    backgroundColor: '#007CF0',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#007CF0',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  taDetailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  courseCard: {
    backgroundColor: '#181A20',
    borderRadius: 18,
    marginBottom: 24,
    padding: 24,
  },
  courseName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
}); 