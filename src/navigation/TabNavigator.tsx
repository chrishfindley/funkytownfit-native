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
      <View style={styles.topBorder} />

      {state.routes.map((route: any, index: number) => {
        const tabDef = visibleTabs[index];
        if (!tabDef) return null;
        const isFocused = state.index === index;

        function onPress() {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          if (!isFocused) navigation.navigate(route.name);
        }

        const isTrainerTab   = tabDef.name === 'Trainer';
        const isCommunityTab = tabDef.name === 'Community';

        const activeColor = isTrainerTab
          ? '#3B82F6'
          : isCommunityTab
          ? '#22C55E'
          : colors.orange;

        return (
          <TouchableOpacity
            key={route.name}
            onPress={onPress}
            activeOpacity={0.75}
            style={styles.tabItem}
          >
            {isFocused ? (
              <View style={[
                styles.activePill,
                isTrainerTab   && { backgroundColor: 'rgba(59,130,246,0.12)', borderColor: 'rgba(59,130,246,0.35)' },
                isCommunityTab && { backgroundColor: 'rgba(34,197,94,0.12)',  borderColor: 'rgba(34,197,94,0.35)' },
              ]}>
                <Ionicons
                  name={tabDef.iconActive}
                  size={16}
                  color={activeColor}
                />
                <Text style={[
                  styles.tabLabelActive,
                  { color: activeColor },
                ]}>
                  {tabDef.label}
                </Text>
              </View>
            ) : (
              <>
                <Ionicons name={tabDef.icon} size={22} color={colors.textMuted} style={{ opacity: 0.7 }} />
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

  // Re-check trainer mode whenever this component gains focus
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
    backgroundColor: colors.bgSecondary,
    paddingTop: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 18,
  },
  topBorder: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
    backgroundColor: colors.orangeBorder,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minHeight: 52,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.2,
    marginTop: 3,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.orangeDim,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.orangeBorder,
    paddingHorizontal: 12,
    paddingVertical: 7,
    minWidth: 58,
    justifyContent: 'center',
    shadowColor: colors.orange,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  tabLabelActive: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.orange,
    letterSpacing: 0.2,
  },
});
