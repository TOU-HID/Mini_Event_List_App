// Normalized event model used across the app
export interface EventItem {
  id: string;
  name: string;
  date: string; // human-readable date string
  dateTime: string | null; // ISO 8601
  imageUrl: string;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueState: string;
  venueCountry: string;
  latitude: number | null;
  longitude: number | null;
  category: string; // segment name e.g. "Music", "Sports"
  genre: string;
  url: string; // ticket purchase link
  info: string;
  priceRange: string;
}

// Raw Ticketmaster API response types (trimmed to what we use)
export interface TmImage {
  ratio?: string;
  url: string;
  width: number;
  height: number;
}

export interface TmVenue {
  name?: string;
  address?: {line1?: string};
  city?: {name?: string};
  state?: {name?: string; stateCode?: string};
  country?: {name?: string; countryCode?: string};
  location?: {longitude?: string; latitude?: string};
}

export interface TmClassification {
  segment?: {name?: string};
  genre?: {name?: string};
  subGenre?: {name?: string};
}

export interface TmDate {
  start?: {
    localDate?: string;
    localTime?: string;
    dateTime?: string;
  };
  status?: {code?: string};
}

export interface TmPriceRange {
  type?: string;
  currency?: string;
  min?: number;
  max?: number;
}

export interface TmEvent {
  id: string;
  name: string;
  url?: string;
  images?: TmImage[];
  dates?: TmDate;
  classifications?: TmClassification[];
  _embedded?: {
    venues?: TmVenue[];
  };
  info?: string;
  pleaseNote?: string;
  priceRanges?: TmPriceRange[];
}

export interface TmPageInfo {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number; // current page (0-based)
}

export interface TmEventsResponse {
  _embedded?: {
    events?: TmEvent[];
  };
  page: TmPageInfo;
}

// Query params we send
export interface EventSearchParams {
  keyword?: string;
  city?: string;
  page?: number;
  size?: number;
  sort?: string;
}
