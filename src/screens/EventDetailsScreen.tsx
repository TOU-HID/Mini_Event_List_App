import React, {useCallback} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/RootNavigator';
import {useAppDispatch, useAppSelector} from '../app/hooks';
import {toggleFavorite} from '../features/favorites/favoritesSlice';
import {selectIsFavorite} from '../features/favorites/selectors';
import {useAppTheme} from '../theme/theme';
import VenueMap from '../components/VenueMap';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetails'>;

const EventDetailsScreen: React.FC<Props> = ({route}) => {
  const {colors} = useAppTheme();
  const {event} = route.params;
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(selectIsFavorite(event.id));

  const handleBuyTickets = useCallback(() => {
    if (event.url) {
      Linking.openURL(event.url);
    }
  }, [event.url]);

  const handleToggleFavorite = useCallback(() => {
    dispatch(toggleFavorite(event));
  }, [dispatch, event]);

  const venueLocation = [event.venueCity, event.venueState, event.venueCountry]
    .filter(Boolean)
    .join(', ');

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.surface}]}
      showsVerticalScrollIndicator={false}>
      {/* Hero Image */}
      {event.imageUrl ? (
        <Image source={{uri: event.imageUrl}} style={styles.heroImage} />
      ) : (
        <View
          style={[
            styles.heroImage,
            styles.placeholder,
            {backgroundColor: colors.skeleton},
          ]}>
          <Text style={[styles.placeholderText, {color: colors.textMuted}]}>
            No Image Available
          </Text>
        </View>
      )}

      <View style={styles.body}>
        {/* Category + Favorite */}
        <View style={styles.topRow}>
          <View
            style={[
              styles.categoryBadge,
              {backgroundColor: colors.primarySoft},
            ]}>
            <Text style={[styles.categoryText, {color: colors.primary}]}>
              {event.category}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Text style={styles.heart}>{isFavorite ? '🔖' : '📑'}</Text>
          </TouchableOpacity>
        </View>

        {/* Event Name */}
        <Text style={[styles.name, {color: colors.text}]}>{event.name}</Text>

        {/* Genre */}
        {event.genre ? (
          <Text style={[styles.genre, {color: colors.textMuted}]}>
            {event.genre}
          </Text>
        ) : null}

        {/* Date & Time */}
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📅</Text>
          <Text style={[styles.infoText, {color: colors.textSecondary}]}>
            {event.date}
          </Text>
        </View>

        {/* Venue */}
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📍</Text>
          <View style={styles.infoColumn}>
            <Text style={[styles.infoText, {color: colors.textSecondary}]}>
              {event.venueName}
            </Text>
            {event.venueAddress ? (
              <Text style={[styles.infoSubtext, {color: colors.textMuted}]}>
                {event.venueAddress}
              </Text>
            ) : null}
            {venueLocation ? (
              <Text style={[styles.infoSubtext, {color: colors.textMuted}]}>
                {venueLocation}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Price Range */}
        {event.priceRange ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>💰</Text>
            <Text style={[styles.infoText, {color: colors.primary}]}>
              {event.priceRange}
            </Text>
          </View>
        ) : null}

        <VenueMap
          latitude={event.latitude}
          longitude={event.longitude}
          venueName={event.venueName || event.name}
          description={venueLocation || event.venueAddress || event.name}
        />

        {/* Description / Info */}
        {event.info ? (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>
              About
            </Text>
            <Text style={[styles.infoBody, {color: colors.textSecondary}]}>
              {event.info}
            </Text>
          </View>
        ) : null}

        {/* Buy Tickets Button */}
        {event.url ? (
          <TouchableOpacity
            style={[styles.buyButton, {backgroundColor: colors.primary}]}
            onPress={handleBuyTickets}
            activeOpacity={0.7}>
            <Text style={styles.buyButtonText}>🎟️ Buy Tickets</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.bottomSpacer} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroImage: {
    width: '100%',
    height: 220,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
  },
  body: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  heart: {
    fontSize: 24,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  genre: {
    fontSize: 14,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 1,
  },
  infoColumn: {
    flex: 1,
  },
  infoText: {
    fontSize: 15,
  },
  infoSubtext: {
    fontSize: 13,
    marginTop: 1,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  infoBody: {
    fontSize: 14,
    lineHeight: 21,
  },
  buyButton: {
    marginTop: 20,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 32,
  },
});

export default EventDetailsScreen;
