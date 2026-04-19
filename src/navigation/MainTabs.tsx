import React, {useCallback} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet} from 'react-native';
import ExploreScreen from '../screens/ExploreScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import {Text, TouchableOpacity} from 'react-native';
import {useAppTheme, useThemeMode} from '../theme/theme';

export type MainTabsParamList = {
  Explore: undefined;
  Favorites: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

const styles = StyleSheet.create({
  headerRightButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modeIcon: {
    fontSize: 18,
  },
});

interface ThemeToggleProps {
  onPress: () => void;
  modeLabel: string;
  modeIcon: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  onPress,
  modeLabel,
  modeIcon,
}) => (
  <TouchableOpacity
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`Theme toggle. Current: ${modeLabel}`}
    style={styles.headerRightButton}>
    <Text style={styles.modeIcon}>{modeIcon}</Text>
  </TouchableOpacity>
);

const renderSearchIcon = ({color, size}: {color: string; size: number}) => (
  <TabIcon name="search" color={color} size={size} />
);

const renderFavoriteIcon = ({color, size}: {color: string; size: number}) => (
  <TabIcon name="favorite" color={color} size={size} />
);

const MainTabs: React.FC = () => {
  const {colors} = useAppTheme();
  const {mode, toggleMode} = useThemeMode();

  const modeIcon = mode === 'system' ? '🌓' : mode === 'dark' ? '🌙' : '☀️';
  const modeLabel =
    mode === 'system'
      ? 'System mode'
      : mode === 'dark'
      ? 'Dark mode'
      : 'Light mode';

  const headerRight = useCallback(
    () => (
      <ThemeToggle
        onPress={toggleMode}
        modeLabel={modeLabel}
        modeIcon={modeIcon}
      />
    ),
    [toggleMode, modeLabel, modeIcon],
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTitleStyle: {
          color: colors.text,
        },
        headerRight,
        tabBarLabelStyle: {fontSize: 12, fontWeight: '600'},
      }}>
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: 'Explore',
          tabBarIcon: renderSearchIcon,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: 'Favorites',
          tabBarIcon: renderFavoriteIcon,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;

// ─── Simple text-based tab icons (no external icon lib needed) ───

const ICONS: Record<string, string> = {
  search: '🔍',
  favorite: '🔖',
};

const TabIcon: React.FC<{name: string; color: string; size: number}> = ({
  name,
  size,
}) => <Text style={{fontSize: size - 4}}>{ICONS[name] ?? '•'}</Text>;
