import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#000000',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: 'Study',
          tabBarIcon: ({ color }) => <FontAwesome name="book" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="teachers"
        options={{
          title: 'Teachers',
          tabBarIcon: ({ color }) => <FontAwesome name="users" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="volunteer"
        options={{
          title: 'Volunteer',
          tabBarIcon: ({ color }) => <FontAwesome name="handshake-o" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tests"
        options={{
          title: 'Tests',
          tabBarIcon: ({ color }) => <FontAwesome name="pencil" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
} 