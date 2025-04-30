import 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RootLayout() {
  const [initialized, setInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const credentials = await AsyncStorage.getItem('ta_credentials');
        const isAuthenticated = !!credentials;
        
        const inAuthGroup = segments[0] === '(auth)';

        if (!initialized) {
          setInitialized(true);
          if (isAuthenticated && !inAuthGroup) {
            router.replace('/');
          } else if (!isAuthenticated && !inAuthGroup) {
            router.replace('/(auth)');
          }
        } else {
          if (!isAuthenticated && !inAuthGroup) {
            router.replace('/(auth)');
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        if (!initialized) {
          router.replace('/(auth)');
        }
      }
    };

    checkAuth();
  }, [segments, initialized]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={({ navigation }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFFFF',
            height: Platform.OS === 'ios' ? 90 : 70,
          },
          headerTitleStyle: {
            fontSize: 17,
            fontWeight: '600',
          },
          headerTintColor: '#007AFF',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{
                marginLeft: 16,
                padding: 8,
              }}
            >
              <Ionicons name="menu" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
          drawerActiveBackgroundColor: '#E8E8ED',
          drawerActiveTintColor: '#007AFF',
          drawerInactiveTintColor: '#000000',
          drawerStyle: {
            backgroundColor: '#FFFFFF',
            width: 280,
          },
          drawerLabelStyle: {
            marginLeft: -20,
            fontSize: 16,
          },
        })}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Home',
            title: 'Home',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="marks"
          options={{
            drawerLabel: 'Marks',
            title: 'Marks',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="school-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="resources"
          options={{
            drawerLabel: 'Resources',
            title: 'Resources',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="library-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="services"
          options={{
            drawerLabel: 'Services',
            title: 'Services',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="statistics"
          options={{
            drawerLabel: 'Statistics',
            title: 'Statistics',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="stats-chart-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="study"
          options={{
            drawerLabel: 'Study',
            title: 'Study',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="teachers"
          options={{
            drawerLabel: 'Teachers',
            title: 'Teachers',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="tests"
          options={{
            drawerLabel: 'Tests',
            title: 'Tests',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="volunteer"
          options={{
            drawerLabel: 'Volunteer',
            title: 'Volunteer',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="heart-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="(auth)"
          options={{
            drawerItemStyle: { display: 'none' },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
} 