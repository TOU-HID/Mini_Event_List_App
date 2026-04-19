import React, {useState, useCallback} from 'react';
import {FlatList, StyleSheet, View, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/RootNavigator';
import type {EventItem} from '../types/event';
import {useSearchEventsQuery} from '../api/ticketmasterApi';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {toggleFavorite} from '../features/favorites/favoritesSlice';
import SearchBar from '../components/SearchBar';
import EventCard from '../components/EventCard';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import LoadingView from '../components/LoadingView';
import {useAppTheme} from '../theme/theme';

type ExploreNav = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const ExploreScreen: React.FC = () => {
  const {colors} = useAppTheme();
  const navigation = useNavigation<ExploreNav>();
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector(state => state.favorites.ids);

  // Search state
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [page, setPage] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);

  // Only fire query after user searches
  const {data, isLoading, isFetching, isError, refetch} = useSearchEventsQuery(
    {keyword, city, page},
    {skip: !hasSearched},
  );

  const events = data?.events ?? [];
  const totalPages = data?.page?.totalPages ?? 0;
  const currentPage = data?.page?.number ?? 0;
  const canLoadMore = currentPage + 1 < totalPages;

  // ── Handlers ──

  const handleSearch = useCallback((kw: string, ct: string) => {
    setKeyword(kw);
    setCity(ct);
    setPage(0);
    setHasSearched(true);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (canLoadMore && !isFetching) {
      setPage(prev => prev + 1);
    }
  }, [canLoadMore, isFetching]);

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

  // ── Render helpers ──

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

  const renderFooter = () => {
    if (!isFetching || page === 0) {
      return null;
    }
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  // ── Body content ──

  const renderBody = () => {
    if (!hasSearched) {
      return (
        <EmptyState message="Search for events by keyword or city to get started." />
      );
    }
    if (isLoading) {
      return <LoadingView />;
    }
    if (isError) {
      return (
        <ErrorState
          message="Failed to load events. Check your connection and try again."
          onRetry={refetch}
        />
      );
    }
    if (events.length === 0) {
      return <EmptyState />;
    }

    return (
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <SearchBar onSearch={handleSearch} />
      {renderBody()}
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
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default ExploreScreen;
