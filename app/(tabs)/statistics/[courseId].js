import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen() {
  const { courseId } = useLocalSearchParams();
  const router = useRouter();
  const [courseData, setCourseData] = useState(null);

  // Simulated data - replace with real data from your API
  useEffect(() => {
    // This would normally fetch data from your API
    setCourseData({
      courseAverage: {
        labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
        data: [84, 88, 85, 86.3, 85.5, 87.1],
      },
      categories: {
        Knowledge: {
          labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
          data: [85, 92, 75, 80, 78, 78],
        },
        Thinking: {
          labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
          data: [100, 88, 94, 96, 92, 95],
        },
        Communication: {
          labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
          data: [87, 81, 92, 95, 94, 96],
        },
        Application: {
          labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
          data: [75, 88, 82, 85, 84, 87],
        },
      },
    });
  }, []);

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 1,
    style: {
      borderRadius: 16,
    },
  };

  const categoryColors = {
    Knowledge: '#4CAF50',
    Thinking: '#2196F3',
    Communication: '#9C27B0',
    Application: '#FF9800',
  };

  if (!courseData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{courseId}</Text>
          <View style={{ width: 70 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#007AFF" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{courseId}</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Course Average Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Course Average</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: courseData.courseAverage.labels,
                datasets: [{
                  data: courseData.courseAverage.data,
                }],
              }}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                ...chartConfig,
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#007AFF',
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        {/* Category Charts */}
        {Object.entries(courseData.categories).map(([category, data]) => (
          <View key={category} style={styles.section}>
            <Text style={styles.sectionTitle}>{category}</Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: data.labels,
                  datasets: [{
                    data: data.data,
                  }],
                }}
                width={screenWidth - 32}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `${categoryColors[category]}${Math.round(opacity * 255).toString(16)}`,
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: categoryColors[category],
                  },
                }}
                bezier
                style={styles.chart}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  backText: {
    fontSize: 17,
    color: '#007AFF',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    borderRadius: 12,
    marginVertical: 8,
  },
}); 