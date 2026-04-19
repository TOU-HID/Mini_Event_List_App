import Config from 'react-native-config';

// Ticketmaster Discovery API configuration
export const TM_API_BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

const tmApiKey = Config.TM_API_KEY?.trim();

if (!tmApiKey) {
  throw new Error(
    'Missing TM_API_KEY. Add it to your .env file (project root) and restart Metro.',
  );
}

export const TM_API_KEY = tmApiKey;

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_SORT = 'date,asc';
