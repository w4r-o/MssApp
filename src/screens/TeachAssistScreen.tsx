import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootDrawerParamList } from '../types/navigation';
import { Student } from '../lib/teachassist';
import { CourseData } from '../types/teachassist';
import { secureStorage } from '../services/secureStorage';
import Svg, { Circle } from 'react-native-svg';

const PERIOD_TIMES: Record<string, string> = {
  '1': '8:20 am – 9:40 am',
  '2': '9:45 am – 11:00 am',
  '3': '11:05 am – 12:20 pm',
  '4': '12:25 pm – 1:40 pm',
  '5': '1:45 pm – 3:00 pm',
};

export default function TeachAssistScreen() {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  // Demo marks mapping
  const demoMarks: Record<string, string> = {
    'ICS3U1-1': '97.8', // Computer Science
    'TWJ3E1-3': '98',   // TWJ3E1-3
    'MCR3U1-10': '67',  // Math
    'SPH3U1-9': '89',   // Physics
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      
      // Get saved credentials
      const credentials = await secureStorage.getCredentials();
      if (!credentials) {
        setError('Please login first');
        return;
      }

      // Initialize TeachAssist client with saved credentials
      const student = new Student(credentials.username, credentials.password);
      
      // Get courses
      const coursesData = await student.getCourses();
      
      // Transform data to match our app's format
      const transformedCourses = coursesData.map(course => ({
        id: course.id,
        name: course.name,
        code: course.code || 'N/A',
        teacher: course.teacher || 'N/A',
        room: course.room || 'N/A',
        mark: course.grade || 'N/A',
        block: course.block || '',
      }));
      
      setCourses(transformedCourses);
      setError(null);
    } catch (err) {
      console.error('TeachAssist Error:', err);
      setError('Failed to load courses. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

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

  const renderCourseCard = (course: CourseData | undefined, idx: number) => {
    if (!course) return null;
    // Extract period from block (e.g., '1', '2', etc.)
    let period = '';
    let room = 'N/A';
    if (course.block) {
      const periodMatch = course.block.match(/P(\d+)/i);
      if (periodMatch && periodMatch[1]) period = periodMatch[1];
      const roomMatch = course.block.match(/rm\.?\s*([\w\d]+)/i);
      if (roomMatch && roomMatch[1]) room = roomMatch[1];
    }
    if (room === 'N/A' && course.room && course.room !== 'N/A') room = course.room;
    const periodTime = PERIOD_TIMES[period] || '';
    const courseCode = course.code || `Course-${idx}`;
    const courseName = course.name || '';
    let courseMark = (course.mark !== undefined && course.mark !== null && course.mark !== '') ? course.mark : 'N/A';
    const markNum = parseFloat(courseMark);
    const badgeColor = !isNaN(markNum) ? getMarkBadgeColor(markNum) : '#444';
    const { id: displayId, name: displayName } = getCourseIdAndName(courseCode, courseName);
    const size = 54;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = !isNaN(markNum) ? Math.max(0, Math.min(1, markNum / 100)) : 0;
    return (
      <View key={courseCode + idx} style={styles.taCardOuter}>
        <View style={styles.taCardInner}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.taCourseId}>{displayId}</Text>
            <Text style={styles.taCourseName}>{displayName}</Text>
            <View style={styles.taInfoRow}>
              <MaterialCommunityIcons name="clock" size={17} color="#888" />
              <View style={{ marginLeft: 4, marginRight: 16 }}>
                <Text style={styles.taInfoText}>{period ? `Period ${period}` : 'Period N/A'}</Text>
                {period && periodTime ? (
                  <Text style={styles.taPeriodTimeText}>{periodTime}</Text>
                ) : null}
              </View>
              <MaterialCommunityIcons name="map-marker" size={17} color="#888" />
              <Text style={styles.taInfoText}>{`Room ${room}`}</Text>
        </View>
          </View>
          <View style={styles.taMarkBadgeSvgContainer}>
            <Svg width={size} height={size}>
              <Circle
                stroke="#eee"
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
              />
              <Circle
                stroke={badgeColor}
                fill="none"
                cx={size / 2}
                cy={size / 2}
                r={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={circumference - progress * circumference}
                strokeLinecap="round"
              />
            </Svg>
            <View style={styles.taMarkBadgeSvgTextContainer}>
              <Text style={styles.taMarkTextSvg}>{!isNaN(markNum) ? `${markNum.toFixed(1)}%` : 'N/A'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.taDivider} />
        <TouchableOpacity style={styles.taDetailsButton}>
          <Text style={styles.taDetailsButtonText}>Show details</Text>
        </TouchableOpacity>
        </View>
  );
  };

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
          <TouchableOpacity
            onPress={() => setDemoMode((prev) => !prev)}
            style={{ flex: 1, alignItems: 'center' }}
            activeOpacity={0.2}
          >
          <Text style={styles.title}>TeachAssist</Text>
          </TouchableOpacity>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007CF0" />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={48}
                color="#FF3B30"
              />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchCourses}
              >
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.coursesList}>
              {courses
                .filter(course => course && !((course.code || '').toUpperCase().includes('LUNCH') || (course.name || '').toUpperCase().includes('LUNCH')))
                .map((course, idx) => renderCourseCard(course, idx))}
            </View>
          )}
        </ScrollView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007CF0',
  },
  coursesList: {
    gap: 16,
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
}); 