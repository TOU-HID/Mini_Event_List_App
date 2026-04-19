import React, {useCallback} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/RootNavigator';
import type {EventItem} from '../types/event';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {toggleFavorite} from '../features/favorites/favoritesSlice';
import {selectFavoriteItems} from '../features/favorites/selectors';
import EventCard from '../components/EventCard';
import EmptyState from '../components/EmptyState';
import {useAppTheme} from '../theme/theme';

type FavoritesNav = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const FavoritesScreen: React.FC = () => {
  const {colors} = useAppTheme();
  const navigation = useNavigation<FavoritesNav>();
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavoriteItems);
  const favoriteIds = useAppSelector(state => state.favorites.ids);

  const handlePress = useCallback(
    (event: EventItem) => {
      navigation.navigate('EventDetails', {event});
    },
    [navigation],
  );

  const handleToggleFavorite = useCallback(
    (event: EventItem) => {
      dispatch(toggleFavorite(event));
    },
    [dispatch],
  );

  const renderItem = useCallback(
    ({item}: {item: EventItem}) => (
      <EventCard
        event={item}
        onPress={handlePress}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={!!favoriteIds[item.id]}
      />
    ),
    [handlePress, handleToggleFavorite, favoriteIds],
  );

  const keyExtractor = useCallback((item: EventItem) => item.id, []);

  if (favorites.length === 0) {
    return (
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <EmptyState message="No favorites yet. Tap the bookmark on any event to save it here." />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingVertical: 8,
  },
});

export default FavoritesScreen;
