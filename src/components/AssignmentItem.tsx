import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Assignment } from '../types/teachassist';

const categoryNames: Record<'K'|'T'|'C'|'A', string> = { K: 'Knowledge', T: 'Thinking', C: 'Communication', A: 'Application' };

const AssignmentItem: React.FC<{ assignment: Assignment }> = ({ assignment }) => (
  <View style={styles.container}>
    <Text style={styles.title}>{assignment.name}</Text>
    {(['K', 'T', 'C', 'A'] as const).map((cat) =>
      (assignment[cat]?.map((mark: any, idx: number) => (
        <View key={cat + idx} style={styles.markRow}>
          <Text>{categoryNames[cat]}</Text>
          <Text>
            {mark.get}/{mark.total} ×{mark.weight} ({mark.percentage?.toFixed(1)}%)
          </Text>
        </View>
      )) ?? null)
    )}
    {assignment.feedback && <Text style={styles.feedback}>{assignment.feedback}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  title: { fontWeight: 'bold', color: '#fff' },
  markRow: { flexDirection: 'row', justifyContent: 'space-between', color: '#fff' },
  feedback: { fontStyle: 'italic', color: '#888' },
});

export default AssignmentItem; 