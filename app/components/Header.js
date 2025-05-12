import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Header({ openSidebar, title }) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={openSidebar}
          style={styles.hamburger}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <View style={styles.hamburgerBar} />
          <View style={styles.hamburgerBar} />
          <View style={styles.hamburgerBar} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#121212',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  hamburger: {
    padding: 12,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerBar: {
    backgroundColor: '#fff',
    height: 3,
    width: 24,
    marginVertical: 2,
    borderRadius: 2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
}); 