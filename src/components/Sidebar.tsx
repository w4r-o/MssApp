import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
  Platform,
  AccessibilityInfo,
} from 'react-native';
import {
  Home,
  Megaphone,
  GraduationCap,
  BookOpen,
  FileText,
  Timer,
  User,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, route: '/(tabs)' },
  { label: 'Announcements', icon: Megaphone, route: '/announcements' },
  { label: 'Marks', icon: GraduationCap, route: '/marks' },
  { label: 'Resources', icon: BookOpen, route: '/resources' },
  { label: 'Practice Tests', icon: FileText, route: '/tests' },
  { label: 'Study Timer', icon: Timer, route: '/timer' },
];

const PROFILE_ITEM = { label: 'Profile', icon: User, route: '/profile' };

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  currentRoute: string;
}

export default function Sidebar({ open, onClose, onNavigate, currentRoute }: SidebarProps) {
  const insets = useSafeAreaInsets();
  const width = Dimensions.get('window').width;
  const sidebarWidth = width > 600 ? 300 : width * 0.8;
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: open ? 1 : 0,
      duration: 320,
      useNativeDriver: true,
    }).start();
    if (open) {
      AccessibilityInfo.announceForAccessibility('Sidebar opened');
    }
  }, [open]);

  const sidebarTranslate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-sidebarWidth, 0],
  });
  const overlayOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <>
      {/* Overlay */}
      {open && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close sidebar"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        >
          <Animated.View
            style={[
              styles.overlay,
              { opacity: overlayOpacity },
            ]}
          />
        </Pressable>
      )}
      {/* Sidebar Panel */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            width: sidebarWidth,
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 16,
            transform: [{ translateX: sidebarTranslate }],
            shadowOpacity: open ? 0.25 : 0,
          },
        ]}
        accessibilityRole="menu"
        accessibilityLabel="Sidebar navigation"
        testID="sidebar-container"
      >
        <View style={styles.menuItems}>
          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  isActive && styles.menuItemActive,
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  onNavigate(item.route);
                  onClose();
                }}
                accessibilityRole="menuitem"
                accessibilityState={isActive ? { selected: true } : {}}
              >
                <Icon
                  color={isActive ? '#00BFFF' : '#FFFFFF'}
                  size={26}
                />
                <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* Separator */}
        <View style={styles.separator} />
        {/* Profile (bottom-aligned) */}
        <View style={styles.profileContainer}>
          <TouchableOpacity
            style={styles.profileButton}
            activeOpacity={0.8}
            onPress={() => {
              onNavigate(PROFILE_ITEM.route);
              onClose();
            }}
            accessibilityRole="menuitem"
          >
            <PROFILE_ITEM.icon color="#00BFFF" size={22} />
            <Text style={styles.profileLabel}>{PROFILE_ITEM.label}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#1E1E1E',
    zIndex: 20,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowRadius: 24,
    elevation: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  menuItems: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 18,
    marginBottom: 2,
    backgroundColor: 'transparent',
  },
  menuItemActive: {
    backgroundColor: 'rgba(0,191,255,0.08)',
  },
  menuLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 18,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  menuLabelActive: {
    color: '#00BFFF',
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 24,
    marginVertical: 12,
    borderRadius: 2,
  },
  profileContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00BFFF',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: 'transparent',
  },
  profileLabel: {
    color: '#00BFFF',
    fontSize: 15,
    marginLeft: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
}); 