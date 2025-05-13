import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const CATEGORY_LABELS = { KU: 'Knowledge/Understanding', A: 'Application', T: 'Thinking', C: 'Communication', F: 'Final', O: 'Other' };
const CATEGORY_COLORS = { KU: '#007CF0', A: '#00BFFF', T: '#64B5F6', C: '#1976D2', F: '#1565C0', O: '#90caf9' };

export default function AssignmentDetailsScreen() {
  const { course } = useLocalSearchParams();
  const router = useRouter();
  const parsedCourse = course ? JSON.parse(course) : null;

  if (!parsedCourse) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A0A' }}><Text style={{ color: '#fff' }}>No course data.</Text></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      {/* Header with back button */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: '#0A0A0A' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16, padding: 8 }}>
          <Text style={{ color: '#007CF0', fontSize: 20 }}>{'←'}</Text>
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Assignment Details</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 0, minHeight: '100%' }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#fff' }}>{parsedCourse.code} - {parsedCourse.name}</Text>
        {parsedCourse.assignments && parsedCourse.assignments.length > 0 ? (
          parsedCourse.assignments.map((assignment, idx) => (
            <View key={idx} style={{ borderWidth: 2, borderColor: '#007CF0', borderRadius: 12, marginBottom: 24, padding: 16, backgroundColor: '#181A20' }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>{assignment.name}</Text>
              {Object.keys(assignment).filter(cat => cat !== 'name' && cat !== 'feedback').map(cat =>
                Array.isArray(assignment[cat]) && assignment[cat].length > 0 ? (
                  <View key={cat} style={{ marginBottom: 8 }}>
                    <Text style={{ color: CATEGORY_COLORS[cat] || '#90caf9', fontWeight: 'bold' }}>{CATEGORY_LABELS[cat] || cat}</Text>
                    {assignment[cat].map((mark, mIdx) => (
                      <Text key={mIdx} style={{ color: '#fff', marginLeft: 8 }}>
                        {`Your mark: ${mark.get}/${mark.total} (Weight: ${mark.weight})`}
                      </Text>
                    ))}
                  </View>
                ) : null
              )}
              {assignment.feedback && assignment.feedback.length > 0 && (
                <Text style={{ color: '#B0B0B0', fontStyle: 'italic', marginTop: 8 }}>Feedback: {assignment.feedback}</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={{ color: '#fff' }}>No assignments found.</Text>
        )}
      </ScrollView>
    </View>
  );
} 