import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { MapPin, Clock, Calendar, CheckCircle2 } from 'lucide-react-native';
import Header from './components/Header';
import { useSidebar } from '../src/context/SidebarContext';

const VOLUNTEER_OPPS = [
  {
    title: 'Library Assistant',
    location: 'School Library',
    hours: '2 hours/day',
    days: '3 days/week',
    spots: 4,
    description: '',
    requirements: [],
  },
  {
    title: 'Math Tutor',
    location: 'Study Hall',
    hours: '1.5 hours/day',
    days: '2 days/week',
    spots: 6,
    description: 'Provide tutoring support for Grade 9-10 students in mathematics.',
    requirements: [
      'Grade 11-12 student',
      'Min. 85% in Math',
    ],
  },
  {
    title: 'Environmental Club Leader',
    location: 'School Grounds',
    hours: '3 hours/day',
    days: '1 days/week',
    spots: 2,
    description: '',
    requirements: [],
  },
];

export default function VolunteerScreen() {
  const { openSidebar } = useSidebar();
  const [expanded, setExpanded] = useState(null);
  const opportunities = VOLUNTEER_OPPS;

  if (!opportunities.length) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      <View style={styles.center}>
        <Header openSidebar={openSidebar} title="Volunteering" />
        <Text style={styles.emptyTitle}>No volunteering opportunities</Text>
        <Text style={styles.emptyText}>Check back later for new opportunities.</Text>
      </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      <Header openSidebar={openSidebar} title="Volunteering" />
      <Text style={styles.header}>Volunteering Opportunities</Text>
      <Text style={styles.subheader}>Find opportunities to make a difference and earn hours</Text>
      <FlatList
        data={opportunities}
        keyExtractor={(item, idx) => String(item.title || idx)}
        contentContainerStyle={{ paddingBottom: 32, paddingTop: 16 }}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.infoRow}>
                  <MapPin color="#888" size={16} style={{ marginRight: 4 }} />
                  <Text style={styles.infoText}>{item.location}</Text>
                  <Clock color="#888" size={16} style={{ marginLeft: 12, marginRight: 4 }} />
                  <Text style={styles.infoText}>{item.hours}</Text>
                  <Calendar color="#888" size={16} style={{ marginLeft: 12, marginRight: 4 }} />
                  <Text style={styles.infoText}>{item.days}</Text>
                </View>
              </View>
              <View style={styles.spotsBadge}>
                <Text style={styles.spotsText}>{item.spots} spots</Text>
              </View>
            </View>
            {item.description ? (
              <TouchableOpacity style={styles.showMore} onPress={() => setExpanded(expanded === index ? null : index)}>
                <Text style={styles.showMoreText}>{expanded === index ? 'Show less' : 'Show more'}</Text>
              </TouchableOpacity>
            ) : null}
            {expanded === index && (
              <View style={styles.detailsSection}>
                <Text style={styles.detailsLabel}>Description</Text>
                <Text style={styles.detailsText}>{item.description}</Text>
                {item.requirements.length > 0 && (
                  <View style={{ marginTop: 10 }}>
                    <Text style={styles.detailsLabel}>Requirements</Text>
                    {item.requirements.map((req, i) => (
                      <View key={i} style={styles.reqRow}>
                        <CheckCircle2 color="#00BFFF" size={18} style={{ marginRight: 6 }} />
                        <Text style={styles.reqText}>{req}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <TouchableOpacity style={styles.applyBtn} activeOpacity={0.8} hitSlop={{top:12,bottom:12,left:12,right:12}}>
                  <Text style={styles.applyBtnText}>Apply Now</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 16,
  },
  subheader: {
    color: '#B0B0B0',
    fontSize: 15,
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 18,
    marginBottom: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  infoText: {
    color: '#B0B0B0',
    fontSize: 13,
    marginRight: 2,
  },
  spotsBadge: {
    backgroundColor: '#232A3E',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  spotsText: {
    color: '#00BFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  showMore: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  showMoreText: {
    color: '#00BFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  detailsSection: {
    marginTop: 10,
    backgroundColor: '#181A20',
    borderRadius: 10,
    padding: 12,
  },
  detailsLabel: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  detailsText: {
    color: '#B0B0B0',
    fontSize: 14,
    marginBottom: 8,
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reqText: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  applyBtn: {
    backgroundColor: '#00BFFF',
    borderRadius: 8,
    marginTop: 16,
    paddingVertical: 10,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyText: {
    color: '#B0B0B0',
    fontSize: 15,
  }
}); 