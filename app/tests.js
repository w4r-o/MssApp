import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GradeSelector = ({ selectedGrade, onSelect }) => {
  const grades = [9, 10, 11, 12];
  return (
    <View style={styles.gradeContainer}>
      {grades.map((grade) => (
        <TouchableOpacity
          key={grade}
          style={[styles.gradeButton, selectedGrade === grade && styles.gradeButtonSelected]}
          onPress={() => onSelect(grade)}
        >
          <Text style={[styles.gradeText, selectedGrade === grade && styles.gradeTextSelected]}>
            Grade {grade}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const QuestionTypeInput = ({ label, value, onChange }) => (
  <View style={styles.inputRow}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.counterContainer}>
      <TouchableOpacity 
        style={styles.counterButton}
        onPress={() => onChange(Math.max(0, value - 1))}
      >
        <Ionicons name="remove" size={20} color="#007AFF" />
      </TouchableOpacity>
      <Text style={styles.counterValue}>{value}</Text>
      <TouchableOpacity 
        style={styles.counterButton}
        onPress={() => onChange(value + 1)}
      >
        <Ionicons name="add" size={20} color="#007AFF" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function TestsScreen() {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [questionCounts, setQuestionCounts] = useState({
    multipleChoice: 10,
    knowledge: 5,
    thinking: 3,
    application: 3,
    communication: 2,
  });

  const updateQuestionCount = (type, value) => {
    setQuestionCounts(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Your Grade</Text>
        <GradeSelector selectedGrade={selectedGrade} onSelect={setSelectedGrade} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configure Questions</Text>
        <View style={styles.questionConfig}>
          <QuestionTypeInput
            label="Multiple Choice"
            value={questionCounts.multipleChoice}
            onChange={(value) => updateQuestionCount('multipleChoice', value)}
          />
          <QuestionTypeInput
            label="Knowledge"
            value={questionCounts.knowledge}
            onChange={(value) => updateQuestionCount('knowledge', value)}
          />
          <QuestionTypeInput
            label="Thinking"
            value={questionCounts.thinking}
            onChange={(value) => updateQuestionCount('thinking', value)}
          />
          <QuestionTypeInput
            label="Application"
            value={questionCounts.application}
            onChange={(value) => updateQuestionCount('application', value)}
          />
          <QuestionTypeInput
            label="Communication"
            value={questionCounts.communication}
            onChange={(value) => updateQuestionCount('communication', value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity 
          style={[styles.generateButton, !selectedGrade && styles.generateButtonDisabled]}
          disabled={!selectedGrade}
        >
          <Ionicons name="create-outline" size={24} color="#fff" style={styles.generateIcon} />
          <Text style={styles.generateButtonText}>Generate Practice Test</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadButton}>
          <Ionicons name="cloud-upload-outline" size={20} color="#007AFF" />
          <Text style={styles.uploadButtonText}>Upload Past Test for Reference</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  section: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  gradeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gradeButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  gradeButtonSelected: {
    backgroundColor: '#007AFF',
  },
  gradeText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  gradeTextSelected: {
    color: '#fff',
  },
  questionConfig: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  generateButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  generateButtonDisabled: {
    backgroundColor: '#ccc',
  },
  generateIcon: {
    marginRight: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  uploadButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
}); 