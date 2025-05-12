import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Animated, Dimensions } from 'react-native';
import { Slot } from 'expo-router';
import Sidebar from '../components/Sidebar';
import { AuthProvider } from '../src/context/AuthContext';
import { SidebarContext } from '../src/context/SidebarContext';

export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnim = useState(new Animated.Value(-sidebarWidth()))[0];

  function sidebarWidth() {
    const width = Dimensions.get('window').width;
    return width < 600 ? width * 0.8 : 300;
  }

  const openSidebar = () => {
    setSidebarOpen(true);
    Animated.timing(sidebarAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: -sidebarWidth(),
      duration: 300,
      useNativeDriver: false,
    }).start(() => setSidebarOpen(false));
  };

  return (
    <AuthProvider>
      <SidebarContext.Provider value={{ openSidebar, closeSidebar }}>
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
          <Slot />
      {sidebarOpen && (
        <Pressable style={styles.backdrop} onPress={closeSidebar} />
      )}
      <Animated.View
        style={[
          styles.sidebar,
          {
            width: sidebarWidth(),
            left: sidebarAnim,
          },
        ]}
      >
        <Sidebar closeSidebar={closeSidebar} />
      </Animated.View>
    </View>
      </SidebarContext.Provider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 20,
    backgroundColor: '#1E1E1E',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 20,
  },
}); 