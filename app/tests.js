import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './components/Header';
import { useSidebar } from '../src/context/SidebarContext';

const GradeSelector = ({ selectedGrade, onSelect }) => {
  const grades = [9, 10, 11, 12];
  return (
    <View style={styles.gradeContainer}>
      {grades.map((grade) => (
        <TouchableOpacity
          key={grade}
          style={[styles.gradeButton, selectedGrade === grade && styles.gradeButtonSelected]}
          onPress={() => onSelect(grade)}
          activeOpacity={0.8}
          hitSlop={{top:12,bottom:12,left:12,right:12}}
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
        activeOpacity={0.8}
        hitSlop={{top:8,bottom:8,left:8,right:8}}
      >
        <Ionicons name="remove" size={20} color="#00BFFF" />
      </TouchableOpacity>
      <Text style={styles.counterValue}>{value}</Text>
      <TouchableOpacity 
        style={styles.counterButton}
        onPress={() => onChange(value + 1)}
        activeOpacity={0.8}
        hitSlop={{top:8,bottom:8,left:8,right:8}}
      >
        <Ionicons name="add" size={20} color="#00BFFF" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function TestsScreen() {
  const { openSidebar } = useSidebar();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      <Header openSidebar={openSidebar} title="Practice Test" />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
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
            activeOpacity={0.8}
            hitSlop={{top:12,bottom:12,left:12,right:12}}
        >
          <Ionicons name="create-outline" size={24} color="#fff" style={styles.generateIcon} />
          <Text style={styles.generateButtonText}>Generate Practice Test</Text>
        </TouchableOpacity>

          <TouchableOpacity style={styles.uploadButton} activeOpacity={0.8} hitSlop={{top:12,bottom:12,left:12,right:12}}>
            <Ionicons name="cloud-upload-outline" size={20} color="#00BFFF" />
          <Text style={styles.uploadButtonText}>Upload Past Test for Reference</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  section: {
    padding: 20,
    backgroundColor: '#181A20',
    marginBottom: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#fff',
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
    backgroundColor: '#232A3E',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
  },
  gradeButtonSelected: {
    backgroundColor: '#00BFFF',
  },
  gradeText: {
    fontSize: 16,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  gradeTextSelected: {
    color: '#fff',
  },
  questionConfig: {
    backgroundColor: '#181A20',
    borderRadius: 8,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#232A3E',
  },
  inputLabel: {
    fontSize: 16,
    color: '#fff',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#232A3E',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
    color: '#fff',
  },
  generateButton: {
    backgroundColor: '#00BFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  generateButtonDisabled: {
    backgroundColor: '#232A3E',
  },
  generateButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  uploadButton: {
    backgroundColor: '#232A3E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#00BFFF',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  generateIcon: {
    marginRight: 8,
  },
}); 