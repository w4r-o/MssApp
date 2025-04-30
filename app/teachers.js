import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dummy teacher data
const TEACHERS = [
  {
    id: '1',
    name: 'Mr. Smith',
    subject: 'Mathematics',
    room: '203',
    schedule: ['Period 1: Grade 11 Functions', 'Period 2: Grade 12 Calculus', 'Period 4: Grade 10 Math'],
  },
  {
    id: '2',
    name: 'Ms. Johnson',
    subject: 'English',
    room: '105',
    schedule: ['Period 2: Grade 11 English', 'Period 3: Grade 12 English', 'Period 5: Writers Craft'],
  },
  {
    id: '3',
    name: 'Mr. Brown',
    subject: 'Science',
    room: '301',
    schedule: ['Period 1: Grade 11 Physics', 'Period 3: Grade 12 Chemistry', 'Period 4: Grade 10 Science'],
  },
];

export default function TeachersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const filteredTeachers = TEACHERS.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTeacher = ({ item }) => (
    <TouchableOpacity
      style={styles.teacherCard}
      onPress={() => setSelectedTeacher(selectedTeacher?.id === item.id ? null : item)}
    >
      <View style={styles.teacherHeader}>
        <View>
          <Text style={styles.teacherName}>{item.name}</Text>
          <Text style={styles.teacherSubject}>{item.subject}</Text>
        </View>
        <View style={styles.roomBadge}>
          <Text style={styles.roomText}>Room {item.room}</Text>
        </View>
      </View>

      {selectedTeacher?.id === item.id && (
        <View style={styles.scheduleContainer}>
          <Text style={styles.scheduleTitle}>Schedule:</Text>
          {item.schedule.map((period, index) => (
            <Text key={index} style={styles.scheduleItem}>• {period}</Text>
          ))}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="mail-outline" size={20} color="#007AFF" />
              <Text style={styles.actionButtonText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="calendar-outline" size={20} color="#007AFF" />
              <Text style={styles.actionButtonText}>Book Meeting</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search teachers by name or subject..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredTeachers}
        renderItem={renderTeacher}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  list: {
    padding: 15,
  },
  teacherCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teacherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  teacherSubject: {
    fontSize: 16,
    color: '#666',
  },
  roomBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roomText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  scheduleContainer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  scheduleItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  actionButtonText: {
    color: '#007AFF',
    marginLeft: 6,
    fontWeight: '500',
  },
}); 