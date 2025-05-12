import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Student } from '../../src/lib/teachassist/Student';

export default function MarksScreen() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const router = useRouter();

  const setDemoMarks = async () => {
    try {
      const demoData = [
        {code:'ICS3U1-1',name:'Computer and Information Science',block:'1',room:'225',overallMark:97.8,kWeight:98,tWeight:97,cWeight:98,aWeight:97,weightTable:{"A":25,"C":25,"K":25,"T":25},isFinal:false,isMidterm:false},
        {code:'TWJ3E1-3',name:'TWJ3E1-3',block:'2',room:'132',overallMark:98.0,kWeight:98,tWeight:98,cWeight:98,aWeight:98,weightTable:{"A":25,"C":25,"K":25,"T":25},isFinal:false,isMidterm:false},
        {code:'MCR3U1-10',name:'Functions and Relations',block:'4',room:'338',overallMark:67.0,kWeight:67,tWeight:67,cWeight:67,aWeight:67,weightTable:{"A":25,"C":25,"K":25,"T":25},isFinal:false,isMidterm:false},
        {code:'SPH3U1-9',name:'Physics',block:'5',room:'328',overallMark:89.3,kWeight:89,tWeight:90,cWeight:89,aWeight:89,weightTable:{"A":25,"C":25,"K":25,"T":25},isFinal:false,isMidterm:false}
      ];
      await AsyncStorage.setItem('ta_courses', JSON.stringify(demoData));
      setCourses(demoData);
      console.log('Demo marks set successfully');
    } catch (error) {
      console.error('Error setting demo marks:', error);
    }
  };

  const loadCourses = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      // Get stored credentials
      const credentialsStr = await AsyncStorage.getItem('ta_credentials');
      if (!credentialsStr) {
        router.replace('/');
        return;
      }
      const credentials = JSON.parse(credentialsStr);
      const student = new Student(credentials.username, credentials.password);
      const courses = await student.getCourses();
      setCourses(courses);
    } catch (err) {
      const errorMessage = __DEV__ 
        ? `Error: ${err.message}\n\nPlease check the console for more details.`
        : 'Failed to load courses. Pull down to refresh.';
      console.error('[TeachAssist] Marks load error:', err, err?.message, err?.stack);
      setError(errorMessage);
      Alert.alert(
        'Error',
        'Failed to load your marks. Please check your internet connection and try again.',
        [
          { text: 'Try Again', onPress: () => loadCourses() },
          { text: 'Logout', onPress: handleLogout }
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('ta_credentials');
      router.replace('/');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    loadCourses();
  }, [router]);

  const getPeriodTime = (block) => {
    const times = {
      '1': '8:20 am – 9:40 am',
      '2': '9:45 am – 11:00 am',
      '3': '11:05 am – 12:20 pm',
      '4': '12:25 pm – 1:40 pm',
      '5': '1:45 pm – 3:00 pm',
    };
    return times[block] || '';
  };

  const renderMarkCard = (course, index) => {
    const getMarkColor = (mark) => {
      if (mark >= 90) return '#2E7D32';
      if (mark >= 80) return '#388E3C';
      if (mark >= 70) return '#FFA000';
      return '#D32F2F';
    };

    const getBgColor = (mark) => {
      if (mark >= 90) return '#E8F5E9';
      if (mark >= 80) return '#F1F8E9';
      if (mark >= 70) return '#FFF3E0';
      return '#FFEBEE';
    };

    const markColor = getMarkColor(course.overallMark);
    const bgColor = getBgColor(course.overallMark);
    const periodTime = getPeriodTime(course.block);

    return (
      <View key={`${course.code}-${index}`} style={[styles.card, { borderLeftColor: markColor, borderLeftWidth: 4 }]}>
        <View style={styles.courseHeader}>
          <View style={styles.courseInfo}>
            <View style={styles.courseTitleContainer}>
              <Text style={styles.courseCode}>{course.code}</Text>
              <Text style={styles.courseName}>{course.name}</Text>
            </View>
            <View style={styles.courseDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={14} color="#666" />
                <View>
                  <Text style={styles.detailText}>Period {course.block}</Text>
                  <Text style={styles.periodTime}>{periodTime}</Text>
                </View>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.detailText}>Room {course.room}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.markBadge, { backgroundColor: bgColor }]}>
            <Text style={[styles.markText, { color: markColor }]}>
              {course.overallMark.toFixed(1)}%
            </Text>
            <Text style={[styles.markLabel, { color: markColor }]}>
              {course.isFinal ? 'Final' : course.isMidterm ? 'Midterm' : 'Current'}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.showMoreButton}
          onPress={() => setSelectedCourse(course)}
        >
          <Text style={styles.showMoreText}>Show details</Text>
          <Ionicons name="chevron-down" size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.headerButton} 
        onPress={handleBack}
      >
        <Ionicons name="chevron-back" size={24} color="#007AFF" />
        <Text style={styles.headerButtonText}>Home</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Marks</Text>
      <TouchableOpacity 
        style={styles.headerButton} 
        onPress={() => loadCourses(true)}
      >
        <Ionicons 
          name="refresh" 
          size={24} 
          color="#007AFF"
          style={[styles.refreshIcon, refreshing && styles.refreshing]} 
        />
      </TouchableOpacity>
    </View>
  );

  const renderDetailModal = () => (
    <Modal
      visible={!!selectedCourse}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setSelectedCourse(null)}
    >
      {selectedCourse && (
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setSelectedCourse(null)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedCourse.code}</Text>
            <TouchableOpacity 
              style={styles.modalStatsButton}
              onPress={() => {
                setSelectedCourse(null);
                router.push(`/(tabs)/statistics/${selectedCourse.code}`);
              }}
            >
              <Text style={styles.modalStatsButtonText}>Statistics</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {/* Course overview section */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Course Overview</Text>
              <View style={styles.modalOverview}>
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewLabel}>Current Mark</Text>
                  <Text style={styles.overviewValue}>{selectedCourse.overallMark.toFixed(1)}%</Text>
                </View>
                <View style={styles.overviewDivider} />
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewLabel}>Room</Text>
                  <Text style={styles.overviewValue}>{selectedCourse.room || 'N/A'}</Text>
                </View>
                <View style={styles.overviewDivider} />
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewLabel}>Block</Text>
                  <Text style={styles.overviewValue}>{selectedCourse.block || 'N/A'}</Text>
                </View>
              </View>
            </View>

            {/* Weight categories section */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Mark Breakdown</Text>
              <View style={styles.weightCategories}>
                {['K', 'T', 'C', 'A'].map((category) => (
                  <View key={category} style={styles.weightCategory}>
                    <Text style={styles.categoryLabel}>{category}</Text>
                    <View style={[styles.categoryBar, { height: 120 }]}>
                      <View 
                        style={[
                          styles.categoryFill,
                          { 
                            height: `${selectedCourse[`${category.toLowerCase()}Weight`] || 0}%`,
                            backgroundColor: category === 'K' ? '#4CAF50' :
                                          category === 'T' ? '#2196F3' :
                                          category === 'C' ? '#9C27B0' :
                                          '#FF9800'
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.categoryValue}>
                      {(selectedCourse[`${category.toLowerCase()}Weight`] || 0).toFixed(1)}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadCourses(true)}
            tintColor="#007AFF"
          />
        }
      >
        <TouchableOpacity 
          onPress={setDemoMarks}
          style={{ position: 'absolute', top: 10, right: 10, opacity: 0 }}
        >
          <Text>Set Demo</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Current Marks</Text>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.coursesList}>
            {courses.map((course, index) => renderMarkCard(course, index))}
          </View>
        )}
      </ScrollView>
      {renderDetailModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#232A3E',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  headerButtonText: {
    fontSize: 17,
    color: '#00BFFF',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  refreshIcon: {
    transform: [{ rotate: '0deg' }],
  },
  refreshing: {
    transform: [{ rotate: '180deg' }],
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  coursesList: {
    gap: 16,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  courseInfo: {
    flex: 1,
    marginRight: 16,
  },
  courseTitleContainer: {
    marginBottom: 12,
  },
  courseCode: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  courseName: {
    fontSize: 17,
    color: '#B0B0B0',
  },
  courseDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  periodTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  markBadge: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  markText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 2,
    color: '#FFFFFF',
  },
  markLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#B0B0B0',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#232A3E',
  },
  showMoreText: {
    color: '#00BFFF',
    fontSize: 15,
    marginRight: 4,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#232A3E',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalStatsButton: {
    padding: 8,
  },
  modalStatsButtonText: {
    color: '#00BFFF',
    fontSize: 17,
  },
  modalContent: {
    flex: 1,
  },
  modalSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#232A3E',
  },
  modalSectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#FFFFFF',
  },
  modalOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#181A20',
    borderRadius: 12,
    padding: 16,
  },
  overviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  overviewLabel: {
    fontSize: 14,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  overviewDivider: {
    width: 1,
    backgroundColor: '#232A3E',
  },
  weightCategories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  weightCategory: {
    alignItems: 'center',
    flex: 1,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  categoryBar: {
    width: 40,
    backgroundColor: '#232A3E',
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryFill: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderRadius: 20,
  },
  categoryValue: {
    fontSize: 14,
    marginTop: 8,
    color: '#FFFFFF',
  },
}); 