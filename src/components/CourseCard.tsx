import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { CourseData } from '../types/teachassist';

const PERIOD_TIMES: Record<string, string> = {
  '1': '8:20 am – 9:40 am',
  '2': '9:45 am – 11:00 am',
  '3': '11:05 am – 12:20 pm',
  '4': '12:25 pm – 1:40 pm',
  '5': '1:45 pm – 3:00 pm',
};

const getMarkBadgeColor = (mark: number) => {
  if (mark >= 90) return '#4CAF50'; // green
  if (mark >= 75) return '#8BC34A'; // light green
  if (mark >= 60) return '#FFC107'; // amber
  return '#F44336'; // red
};

const getCourseIdAndName = (courseCode: string, courseName: string) => {
  let id = courseCode;
  let name = courseName;
  if (courseName && courseName.includes(':')) {
    const [left, right] = courseName.split(':');
    id = left.trim();
    name = (right?.trim() || left.trim());
  } else if (courseCode && courseCode.includes(':')) {
    const [left, right] = courseCode.split(':');
    id = left.trim();
    name = (right?.trim() || left.trim());
  } else if (courseName && courseName.length > 0) {
    id = courseCode;
    name = courseName;
  } else {
    id = courseCode;
    name = courseCode;
  }
  return { id, name };
};

interface CourseCardProps {
  course: CourseData;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [expanded, setExpanded] = useState(false);
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
  const courseCode = course.code || 'N/A';
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
    <View style={styles.taCardOuter}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.taCardInner}>
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
      </TouchableOpacity>
      {expanded && (
        <View style={styles.taExpandedDetails}>
          <Text style={styles.taExpandedText}>Course Details (expanded)</Text>
          {/* (Assignment details, etc. can be added here) */}
        </View>
      )}
      <View style={styles.taDivider} />
      <TouchableOpacity style={styles.taDetailsButton} onPress={() => setExpanded(!expanded)}>
         <Text style={styles.taDetailsButtonText}> {expanded ? 'Hide details' : 'Show details'} </Text>
      </ TouchableOpacity>
    </ View>
  );
};

const styles = StyleSheet.create({
  taCardOuter: { marginVertical: 8, borderRadius: 12, overflow: 'hidden', backgroundColor: '#1e1e1e', padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity 0.1, shadowRadius 4, elevation: 2, },
  taCardInner: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, },
  taCourseId: { fontSize: 18, fontWeight: 'bold', color: '#fff', },
  taCourseName: { fontSize: 14, color: '#aaa', marginTop: 2, },
  taInfoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, },
  taInfoText: { fontSize: 12, color: '#888', marginLeft: 4, },
  taPeriodTimeText: { fontSize: 10, color: '#888', marginTop: 1, },
  taMarkBadgeSvgContainer: { marginLeft: 16, position: 'relative', },
  taMarkBadgeSvgTextContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', },
  taMarkTextSvg: { fontSize: 12, fontWeight: 'bold', color: '#fff', },
  taExpandedDetails: { marginTop: 8, padding: 8, backgroundColor: 'rgba(0,0,0, 0.1)', borderRadius: 8, },
  taExpandedText: { fontSize: 14, color: '#aaa', },
  taDivider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginVertical: 8, },
  taDetailsButton: { alignSelf: 'center', paddingVertical: 8, },
  taDetailsButtonText: { fontSize: 14, color: '#007CF0', fontWeight: '600', },
});

export default CourseCard; 