import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useAppTheme} from '../theme/theme';

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'No events found. Try a different search.',
}) => {
  const {colors} = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔎</Text>
      <Text style={[styles.text, {color: colors.textMuted}]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default EmptyState;
