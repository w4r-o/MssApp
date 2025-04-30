import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dummy volunteering opportunities
const OPPORTUNITIES = [
  {
    id: '1',
    title: 'Library Assistant',
    location: 'School Library',
    hours: 2,
    daysPerWeek: 3,
    spots: 4,
    description: 'Help organize books, assist students with research, and maintain library resources.',
    requirements: ['Good organizational skills', 'Knowledge of library system'],
  },
  {
    id: '2',
    title: 'Math Tutor',
    location: 'Study Hall',
    hours: 1.5,
    daysPerWeek: 2,
    spots: 6,
    description: 'Provide tutoring support for Grade 9-10 students in mathematics.',
    requirements: ['Grade 11-12 student', 'Min. 85% in Math'],
  },
  {
    id: '3',
    title: 'Environmental Club Leader',
    location: 'School Grounds',
    hours: 3,
    daysPerWeek: 1,
    spots: 2,
    description: 'Lead recycling initiatives and organize environmental awareness events.',
    requirements: ['Leadership experience', 'Environmental knowledge'],
  },
];

const OpportunityCard = ({ opportunity }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => setIsExpanded(!isExpanded)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{opportunity.title}</Text>
          <View style={styles.spotsBadge}>
            <Text style={styles.spotsText}>{opportunity.spots} spots</Text>
          </View>
        </View>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.location}>{opportunity.location}</Text>
        </View>
      </View>

      <View style={styles.timeInfo}>
        <View style={styles.timeItem}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.timeText}>{opportunity.hours} hours/day</Text>
        </View>
        <View style={styles.timeItem}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.timeText}>{opportunity.daysPerWeek} days/week</Text>
        </View>
      </View>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{opportunity.description}</Text>
          
          <Text style={styles.sectionTitle}>Requirements</Text>
          {opportunity.requirements.map((req, index) => (
            <View key={index} style={styles.requirementItem}>
              <Ionicons name="checkmark-circle" size={16} color="#34c759" />
              <Text style={styles.requirementText}>{req}</Text>
            </View>
          ))}

          <TouchableOpacity style={styles.applyButton}>
            <Text style={styles.applyButtonText}>Apply Now</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.cardFooter}>
        <Text style={styles.expandText}>
          {isExpanded ? 'Show less' : 'Show more'}
        </Text>
        <Ionicons 
          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
          size={16} 
          color="#007AFF" 
        />
      </View>
    </TouchableOpacity>
  );
};

export default function VolunteerScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Volunteering Opportunities</Text>
        <Text style={styles.headerSubtitle}>
          Find opportunities to make a difference and earn hours
        </Text>
      </View>

      <View style={styles.content}>
        {OPPORTUNITIES.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </View>

      <TouchableOpacity style={styles.createButton}>
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.createButtonText}>Create New Opportunity</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    padding: 15,
  },
  card: {
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
  cardHeader: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  spotsBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  spotsText: {
    color: '#1976d2',
    fontSize: 12,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  timeInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  timeText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444',
  },
  applyButton: {
    backgroundColor: '#34c759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandText: {
    color: '#007AFF',
    fontSize: 14,
    marginRight: 4,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    margin: 15,
    padding: 15,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 