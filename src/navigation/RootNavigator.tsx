import React from 'react';
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import type {EventItem} from '../types/event';
import {useAppTheme} from '../theme/theme';

export type RootStackParamList = {
  MainTabs: undefined;
  EventDetails: {event: EventItem};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const {isDark, colors} = useAppTheme();
  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="EventDetails"
          component={EventDetailsScreen}
          options={{
            headerShown: true,
            title: 'Event Details',
            headerStyle: {backgroundColor: colors.surface},
            headerTintColor: colors.text,
            headerShadowVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
