import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dummy friend data
const FRIENDS = [
  { id: 1, name: 'Alex', studyTime: 120 },
  { id: 2, name: 'Sarah', studyTime: 90 },
  { id: 3, name: 'Mike', studyTime: 45 },
];

export default function StudyScreen() {
  const [isStudying, setIsStudying] = useState(false);
  const [time, setTime] = useState(0);
  const [partyMode, setPartyMode] = useState(false);

  useEffect(() => {
    let interval;
    if (isStudying) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStudying]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleStudy = () => {
    setIsStudying(!isStudying);
  };

  const togglePartyMode = () => {
    setPartyMode(!partyMode);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.timerSection}>
        <Text style={styles.timer}>{formatTime(time)}</Text>
        <TouchableOpacity 
          style={[styles.button, isStudying && styles.buttonActive]} 
          onPress={toggleStudy}
        >
          <Text style={styles.buttonText}>
            {isStudying ? 'Stop Studying' : 'Start Studying'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.partySection}>
        <TouchableOpacity 
          style={[styles.partyButton, partyMode && styles.buttonActive]}
          onPress={togglePartyMode}
        >
          <Ionicons name="people" size={24} color={partyMode ? '#fff' : '#007AFF'} />
          <Text style={[styles.partyButtonText, partyMode && styles.partyButtonTextActive]}>
            Study Party Mode
          </Text>
        </TouchableOpacity>

        {partyMode && (
          <View style={styles.friendsList}>
            <Text style={styles.sectionTitle}>Study Party</Text>
            {FRIENDS.map(friend => (
              <View key={friend.id} style={styles.friendItem}>
                <Text style={styles.friendName}>{friend.name}</Text>
                <Text style={styles.friendTime}>{formatTime(friend.studyTime * 60)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.leaderboard}>
        <Text style={styles.sectionTitle}>Today's Leaderboard</Text>
        {[...FRIENDS].sort((a, b) => b.studyTime - a.studyTime).map((friend, index) => (
          <View key={friend.id} style={styles.leaderboardItem}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.friendName}>{friend.name}</Text>
            <Text style={styles.friendTime}>{formatTime(friend.studyTime * 60)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  timerSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonActive: {
    backgroundColor: '#ff3b30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  partySection: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  partyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
  },
  partyButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  partyButtonTextActive: {
    color: '#fff',
  },
  friendsList: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leaderboard: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rank: {
    width: 40,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  friendName: {
    flex: 1,
    fontSize: 16,
  },
  friendTime: {
    fontSize: 16,
    color: '#666',
  },
}); 