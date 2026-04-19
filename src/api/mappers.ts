import type {TmEvent, TmImage, EventItem} from '../types/event';

/**
 * Pick the best image from the Ticketmaster images array.
 * Prefer 16_9 ratio with width around 640 for a good balance of quality & size.
 */
function pickBestImage(images?: TmImage[]): string {
  if (!images || images.length === 0) {
    return '';
  }

  // Try 16_9 around 640w first
  const preferred = images.find(
    img => img.ratio === '16_9' && img.width >= 500 && img.width <= 800,
  );
  if (preferred) {
    return preferred.url;
  }

  // Fallback: largest image
  const sorted = [...images].sort((a, b) => b.width - a.width);
  return sorted[0]?.url ?? '';
}

/**
 * Format a human-readable date from Ticketmaster date info.
 */
function formatDate(localDate?: string, localTime?: string): string {
  if (!localDate) {
    return 'Date TBA';
  }
  try {
    const dateObj = new Date(`${localDate}T${localTime || '00:00:00'}`);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: localTime ? 'numeric' : undefined,
      minute: localTime ? '2-digit' : undefined,
    });
  } catch {
    return localDate;
  }
}

/**
 * Format a price range string from Ticketmaster price data.
 */
function formatPriceRange(priceRanges?: TmEvent['priceRanges']): string {
  if (!priceRanges || priceRanges.length === 0) {
    return '';
  }
  const p = priceRanges[0];
  const currency = p.currency ?? 'USD';
  if (p.min != null && p.max != null) {
    return `${currency} ${p.min.toFixed(0)} – ${p.max.toFixed(0)}`;
  }
  if (p.min != null) {
    return `From ${currency} ${p.min.toFixed(0)}`;
  }
  return '';
}

/**
 * Map a raw Ticketmaster event into our normalized EventItem model.
 */
export function mapTmEventToEventItem(raw: TmEvent): EventItem {
  const venue = raw._embedded?.venues?.[0];
  const classification = raw.classifications?.[0];
  const start = raw.dates?.start;

  return {
    id: raw.id,
    name: raw.name,
    date: formatDate(start?.localDate, start?.localTime),
    dateTime: start?.dateTime ?? null,
    imageUrl: pickBestImage(raw.images),
    venueName: venue?.name ?? 'Venue TBA',
    venueAddress: venue?.address?.line1 ?? '',
    venueCity: venue?.city?.name ?? '',
    venueState: venue?.state?.stateCode ?? venue?.state?.name ?? '',
    venueCountry: venue?.country?.countryCode ?? venue?.country?.name ?? '',
    latitude: venue?.location?.latitude
      ? parseFloat(venue.location.latitude)
      : null,
    longitude: venue?.location?.longitude
      ? parseFloat(venue.location.longitude)
      : null,
    category: classification?.segment?.name ?? 'Other',
    genre: classification?.genre?.name ?? '',
    url: raw.url ?? '',
    info: raw.info ?? raw.pleaseNote ?? '',
    priceRange: formatPriceRange(raw.priceRanges),
  };
}
