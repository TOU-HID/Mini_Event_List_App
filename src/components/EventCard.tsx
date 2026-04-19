import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import type {EventItem} from '../types/event';
import {useAppTheme} from '../theme/theme';

interface EventCardProps {
  event: EventItem;
  onPress: (event: EventItem) => void;
  onToggleFavorite?: (event: EventItem) => void;
  isFavorite?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const {colors, isDark} = useAppTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          shadowOpacity: isDark ? 0.24 : 0.1,
          borderColor: colors.border,
        },
      ]}
      onPress={() => onPress(event)}
      activeOpacity={0.8}>
      {event.imageUrl ? (
        <Image source={{uri: event.imageUrl}} style={styles.image} />
      ) : (
        <View
          style={[
            styles.image,
            styles.placeholder,
            {backgroundColor: colors.skeleton},
          ]}>
          <Text style={[styles.placeholderText, {color: colors.textMuted}]}>
            No Image
          </Text>
        </View>
      )}

      <View style={styles.content}>
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
          {onToggleFavorite && (
            <TouchableOpacity
              onPress={() => onToggleFavorite(event)}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Text style={styles.heart}>{isFavorite ? '🔖' : '📑'}</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={[styles.name, {color: colors.text}]} numberOfLines={2}>
          {event.name}
        </Text>

        <Text style={[styles.date, {color: colors.textSecondary}]}>
          {event.date}
        </Text>

        <Text
          style={[styles.venue, {color: colors.textMuted}]}
          numberOfLines={1}>
          📍 {event.venueName}
          {event.venueCity ? `, ${event.venueCity}` : ''}
        </Text>

        {event.priceRange ? (
          <Text style={[styles.price, {color: colors.primary}]}>
            {event.priceRange}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  image: {
    width: '100%',
    height: 160,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
  },
  content: {
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  heart: {
    fontSize: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    marginBottom: 2,
  },
  venue: {
    fontSize: 13,
    marginBottom: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default React.memo(EventCard);
