import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator }  from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import DashboardScreen        from '@/screens/DashboardScreen';
import WorkoutScreen          from '@/screens/WorkoutScreen';
import NutritionScreen        from '@/screens/NutritionScreen';
import ProgressScreen         from '@/screens/ProgressScreen';
import ProfileScreen          from '@/screens/ProfileScreen';
import CommunityScreen        from '@/screens/CommunityScreen';
import TrainerDashboardScreen from '@/screens/TrainerDashboardScreen';
import ClientDetailScreen     from '@/screens/ClientDetailScreen';
import WhereToScreen          from '@/screens/WhereToScreen';
import { colors, radius } from '@/theme';
import { isTrainerMode } from '@/lib/trainer';

// ─── Dashboard stack (Dashboard → WhereTo) ────────────────────────────────────
const DashStack = createNativeStackNavigator();
function DashboardStackNavigator() {
  return (
    <DashStack.Navigator screenOptions={{ headerShown: false }}>
      <DashStack.Screen name="DashboardHome" component={DashboardScreen} />
      <DashStack.Screen name="WhereTo"       component={WhereToScreen}  />
    </DashStack.Navigator>
  );
}

// ─── Trainer stack (Dashboard → ClientDetail) ─────────────────────────────────
const TrainerStack = createNativeStackNavigator();
function TrainerStackNavigator() {
  return (
    <TrainerStack.Navigator screenOptions={{ headerShown: false }}>
      <TrainerStack.Screen name="TrainerDashboard" component={TrainerDashboardScreen} />
      <TrainerStack.Screen name="ClientDetail"     component={ClientDetailScreen}     />
    </TrainerStack.Navigator>
  );
}

// ─── Tab definitions ─────────────────────────────────────────────────────────
const Tab = createBottomTabNavigator();
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabDef {
  name: string;
  icon: IoniconName;
  iconActive: IoniconName;
  label: string;
}

const BASE_TABS: TabDef[] = [
  { name: 'Dashboard',  icon: 'home-outline',          iconActive: 'home',          label: 'Home'      },
  { name: 'Workout',    icon: 'barbell-outline',        iconActive: 'barbell',        label: 'Train'     },
  { name: 'Nutrition',  icon: 'restaurant-outline',     iconActive: 'restaurant',     label: 'Eat'       },
  { name: 'Progress',   icon: 'bar-chart-outline',      iconActive: 'bar-chart',      label: 'Stats'     },
  { name: 'Community',  icon: 'people-circle-outline',  iconActive: 'people-circle',  label: 'Community' },
  { name: 'Trainer',    icon: 'people-outline',         iconActive: 'people',         label: 'Trainer'   },
  { name: 'Profile',    icon: 'person-circle-outline',  iconActive: 'person-circle',  label: 'Me'        },
];

// ─── Custom tab bar ───────────────────────────────────────────────────────────
function CustomTabBar({ state, navigation, showTrainer }: {
  state: any; navigation: any; showTrainer: boolean;
}) {
  const insets = useSafeAreaInsets();

  const visibleTabs = showTrainer
    ? BASE_TABS
    : BASE_TABS.filter(t => t.name !== 'Trainer');

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {/* Clean grey top border — no orange */}
      <View style={styles.topBorder} />

      {state.routes.map((route: any, index: number) => {
        const tabDef = visibleTabs[index];
        if (!tabDef) return null;
        const isFocused = state.index === index;

        function onPress() {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          // Always emit tabPress — nested stack navigators listen to this event
          // to pop back to their root screen (fixes "Home doesn't work" bug)
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }

        return (
          <TouchableOpacity
            key={route.name}
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.tabItem}
          >
            {isFocused ? (
              // ── Active: white icon + white label in a subtle pill ──────────
              <View style={styles.activePill}>
                <Ionicons
                  name={tabDef.iconActive}
                  size={16}
                  color={colors.textPrimary}
                />
                <Text style={styles.tabLabelActive}>
                  {tabDef.label}
                </Text>
              </View>
            ) : (
              // ── Inactive: white icon + white label, dimmed ─────────────────
              <>
                <Ionicons
                  name={tabDef.icon}
                  size={22}
                  color='#FFFFFF'
                  style={{ opacity: 0.38 }}
                />
                <Text style={styles.tabLabel}>{tabDef.label}</Text>
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Main navigator ───────────────────────────────────────────────────────────
export default function TabNavigator() {
  const [showTrainer, setShowTrainer] = useState(false);

  useFocusEffect(useCallback(() => {
    isTrainerMode().then(setShowTrainer);
  }, []));

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} showTrainer={showTrainer} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={DashboardStackNavigator} />
      <Tab.Screen name="Workout"   component={WorkoutScreen}           />
      <Tab.Screen name="Nutrition" component={NutritionScreen}         />
      <Tab.Screen name="Progress"  component={ProgressScreen}          />
      <Tab.Screen name="Community" component={CommunityScreen}         />
      {showTrainer && (
        <Tab.Screen name="Trainer" component={TrainerStackNavigator}   />
      )}
      <Tab.Screen name="Profile"   component={ProfileScreen}           />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.bg,       // pure black — no warm tint
    paddingTop: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderTopWidth: 0,                // handled by topBorder below
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 20,
  },
  topBorder: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
    backgroundColor: colors.cardBorder,   // neutral grey — no orange
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minHeight: 52,
  },
  // ── Inactive labels ─────────────────────────────────────────────────────────
  tabLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.38,
    letterSpacing: 0.2,
    marginTop: 3,
  },
  // ── Active pill — neutral dark, white text (orange is NOT the active color) ─
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.cardElevated,    // subtle dark lift, no orange
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.cardBorderBright,    // neutral grey border
    paddingHorizontal: 12,
    paddingVertical: 7,
    minWidth: 58,
    justifyContent: 'center',
  },
  tabLabelActive: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textPrimary,   // pure white
    letterSpacing: 0.2,
  },
});
