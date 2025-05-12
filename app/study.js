import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal, ScrollView } from 'react-native';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './components/Header';
import { useSidebar } from '../src/context/SidebarContext';

const POMODORO = 25 * 60; // 25 minutes
const SHORT_BREAK = 5 * 60; // 5 minutes
const LONG_BREAK = 15 * 60; // 15 minutes
const FOCUS = 50 * 60; // 50 minutes
const CUSTOM = 10 * 60; // 10 minutes (example)

const MODES = [
  { label: 'Pomodoro', duration: POMODORO },
  { label: 'Short Break', duration: SHORT_BREAK },
  { label: 'Long Break', duration: LONG_BREAK },
  { label: 'Focus', duration: FOCUS },
  { label: 'Custom', duration: CUSTOM },
];

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const studyMethodsData = [
  {
    title: 'STEM (Science, Technology, Engineering, Math)',
    methods: [
      'Practice Problems: Solve textbook and past exam questions frequently.',
      'Active Recall: Create flashcards for definitions, formulas, and theorems (e.g., Anki).',
      'Spaced Repetition: Review key concepts over increasing intervals.',
      'Concept Mapping: Link formulas and concepts visually.',
      'Teach It: Explain difficult concepts to someone else or aloud to yourself.',
      'Group Study: Collaborate to solve tough problems and verify approaches.',
    ],
  },
  {
    title: 'Humanities (History, Literature, Philosophy)',
    methods: [
      'Close Reading & Annotation: Highlight and annotate important themes/quotes.',
      'Outlining: Summarize readings by breaking them into key ideas and supporting points.',
      'Essay Planning: Practice thesis writing, structuring arguments, and using evidence.',
      'Discussion-Based Study: Join study groups to debate and refine perspectives.',
      'Flashcards for Dates/Terms: Use for memorizing historical events or philosophical terms.',
      'Mind Mapping: Visualize the connection between authors, ideas, and events.',
    ],
  },
  {
    title: 'Social Sciences (Psychology, Sociology, Political Science)',
    methods: [
      'Case Study Review: Go over real-life applications of theories.',
      'Compare & Contrast Charts: For theories and thinkers.',
      'Active Recall of Definitions & Models: Especially useful for psych and economics.',
      'Practice MCQs/Short Answers: Mimic test formats.',
      'Use Real-World Examples: Apply theories to news articles or current events.',
    ],
  },
  {
    title: 'Business/Economics',
    methods: [
      'Balance Practice and Theory: Alternate between solving finance/accounting problems and studying business theories.',
      'Graph Practice: For supply & demand curves, elasticity, etc.',
      'Case Study Analysis: Especially important in business strategy and marketing.',
      'Simulations/Models: Use Excel or apps to model business decisions.',
      'Current Affairs: Stay updated with business news to relate theory to reality.',
    ],
  },
  {
    title: 'Arts/Design',
    methods: [
      'Project-Based Learning: Learn by doing and refining personal or class projects.',
      'Portfolio Review: Regularly assess and update your work.',
      'Peer Critique: Give and receive constructive feedback.',
      'Sketchbook Journaling: Maintain daily visual ideas and reflections.',
      'Video Tutorials/Process Replays: Learn techniques by watching and replicating.',
    ],
  },
  {
    title: 'Health Sciences/Nursing/Biology',
    methods: [
      'Label Diagrams: Human anatomy, systems, cells, etc.',
      'Case-Based Scenarios: Simulate clinical or ethical situations.',
      'Flashcards for Terminology: Latin/Greek roots, diseases, body systems.',
      'Step-by-Step Processes: Practice steps in clinical procedures or cycles.',
      'Roleplay Simulations: Practice communication and emergency response.',
    ],
  },
  {
    title: 'Languages (French, Spanish, etc.)',
    methods: [
      'Flashcards & Spaced Repetition: For vocab and verb conjugations.',
      'Speaking Practice: Record yourself or talk with native speakers.',
      'Immersion: Watch shows, listen to music, and read in the target language.',
      'Writing Daily: Journaling in the language to develop fluency.',
      'Grammar Drills: Practice with exercises or apps like Duolingo.',
    ],
  },
];

export default function StudyScreen() {
  const { openSidebar } = useSidebar();
  const [mode, setMode] = useState(0);
  const [seconds, setSeconds] = useState(MODES[0].duration);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setSessions((sess) => (mode === 0 ? sess + 1 : sess));
            return MODES[mode].duration;
          }
          return s - 1;
        });
      }, 1000);
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 1000, useNativeDriver: false }),
          Animated.timing(anim, { toValue: 0, duration: 1000, useNativeDriver: false }),
        ])
      ).start();
    } else {
      clearInterval(intervalRef.current);
      anim.stopAnimation();
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const switchMode = (idx) => {
    setMode(idx);
    setSeconds(MODES[idx].duration);
    setRunning(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
      <Header openSidebar={openSidebar} title="Study Timer" />
      <View style={styles.container}>
        <View style={styles.modeRow}>
          {MODES.map((m, idx) => (
            <TouchableOpacity
              key={m.label}
              style={[styles.modeBtn, mode === idx && styles.modeBtnActive]}
              onPress={() => switchMode(idx)}
              activeOpacity={0.8}
              hitSlop={{top:10,bottom:10,left:10,right:10}}
            >
              <Text style={[styles.modeText, mode === idx && styles.modeTextActive]}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Animated.View style={[styles.timerCircle, { opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.8] }) }] }>
          <Timer color="#00BFFF" size={64} />
          <Text style={styles.time}>{formatTime(seconds)}</Text>
        </Animated.View>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.controlBtn} onPress={() => setRunning((r) => !r)} activeOpacity={0.8} hitSlop={{top:10,bottom:10,left:10,right:10}}>
            {running ? <Pause color="#fff" size={28} /> : <Play color="#fff" size={28} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} onPress={() => { setSeconds(MODES[mode].duration); setRunning(false); }} activeOpacity={0.8} hitSlop={{top:10,bottom:10,left:10,right:10}}>
            <RotateCcw color="#fff" size={28} />
          </TouchableOpacity>
        </View>
        <Text style={styles.sessionText}>Sessions completed: <Text style={{ color: '#00BFFF' }}>{sessions}</Text></Text>
        <TouchableOpacity style={styles.resourceBtn} onPress={() => setModalVisible(true)} activeOpacity={0.85} hitSlop={{top:12,bottom:12,left:12,right:12}}>
          <Text style={styles.resourceBtnText}>Study Methods by Subject</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Study Methods by Subject</Text>
              {studyMethodsData.map((section, idx) => (
                <View key={section.title} style={{ marginBottom: 18 }}>
                  <Text style={styles.sectionHeader}>{section.title}</Text>
                  {section.methods.map((method, i) => (
                    <View key={i} style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>{'•'}</Text>
                      <Text style={styles.bulletText}>{method}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  modeRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  modeBtn: {
    backgroundColor: '#232A3E',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 7,
    marginHorizontal: 4,
    marginVertical: 4,
    minWidth: 90,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: '#00BFFF',
  },
  modeText: {
    color: '#B0B0B0',
    fontSize: 15,
    fontWeight: '500',
  },
  modeTextActive: {
    color: '#fff',
  },
  timerCircle: {
    backgroundColor: '#1E1E1E',
    borderRadius: 100,
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#00BFFF',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  time: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '700',
    marginTop: 8,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  controlBtn: {
    backgroundColor: '#232A3E',
    borderRadius: 32,
    padding: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 56,
    minHeight: 56,
  },
  sessionText: {
    color: '#B0B0B0',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 18,
  },
  resourceBtn: {
    backgroundColor: '#232A3E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginTop: 10,
    alignItems: 'center',
  },
  resourceBtnText: {
    color: '#00BFFF',
    fontWeight: '700',
    fontSize: 17,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#181A20',
    borderRadius: 18,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#00BFFF',
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionHeader: {
    color: '#00BFFF',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 6,
    marginTop: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    marginLeft: 6,
  },
  bulletPoint: {
    color: '#00BFFF',
    fontSize: 18,
    marginRight: 6,
    lineHeight: 22,
  },
  bulletText: {
    color: '#fff',
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },
  closeModalBtn: {
    backgroundColor: '#00BFFF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  closeModalBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
}); 