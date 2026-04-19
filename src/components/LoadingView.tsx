import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {useAppTheme} from '../theme/theme';

interface LoadingViewProps {
  size?: 'small' | 'large';
}

const LoadingView: React.FC<LoadingViewProps> = ({size = 'large'}) => {
  const {colors} = useAppTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
});

export default LoadingView;
