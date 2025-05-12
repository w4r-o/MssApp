import React, { useState, useRef } from 'react';
import { View, Text, Button } from 'react-native';

export default function TimerScreen() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (!running) {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    setSeconds(0);
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 48 }}>{seconds}s</Text>
      <View style={{ flexDirection: 'row', marginTop: 24 }}>
        <Button title={running ? 'Pause' : 'Start'} onPress={running ? stopTimer : startTimer} />
        <View style={{ width: 16 }} />
        <Button title="Reset" onPress={resetTimer} />
      </View>
    </View>
  );
} 