import {createApi} from '@reduxjs/toolkit/query/react';
import {TM_API_KEY, DEFAULT_PAGE_SIZE, DEFAULT_SORT} from './config';
import {baseQueryWithLogger} from './apiLogger';
import {mapTmEventToEventItem} from './mappers';
import type {
  EventSearchParams,
  TmEventsResponse,
  EventItem,
  TmPageInfo,
} from '../types/event';

export interface EventsResult {
  events: EventItem[];
  page: TmPageInfo;
}

export const ticketmasterApi = createApi({
  reducerPath: 'ticketmasterApi',
  baseQuery: baseQueryWithLogger,
  endpoints: builder => ({
    /**
     * Search events with keyword/city + pagination.
     * Maps raw Ticketmaster response into our normalized model.
     */
    searchEvents: builder.query<EventsResult, EventSearchParams>({
      query: ({
        keyword,
        city,
        page = 0,
        size = DEFAULT_PAGE_SIZE,
        sort = DEFAULT_SORT,
      }) => {
        const params: Record<string, string> = {
          apikey: TM_API_KEY,
          size: String(size),
          page: String(page),
          sort,
        };
        if (keyword) {
          params.keyword = keyword;
        }
        if (city) {
          params.city = city;
        }
        return {
          url: '/events.json',
          params,
        };
      },
      transformResponse: (response: TmEventsResponse): EventsResult => {
        const rawEvents = response._embedded?.events ?? [];
        return {
          events: rawEvents.map(mapTmEventToEventItem),
          page: response.page,
        };
      },
      // Merge paginated results so infinite scroll appends new events
      serializeQueryArgs: ({queryArgs}) => {
        // Cache key uses keyword+city only (not page), so pages merge
        return `${queryArgs.keyword ?? ''}_${queryArgs.city ?? ''}`;
      },
      merge: (currentCache, newItems, {arg}) => {
        if (arg.page === 0) {
          // Fresh search — replace
          return newItems;
        }
        // Append new page data
        currentCache.events.push(...newItems.events);
        currentCache.page = newItems.page;
      },
      forceRefetch: ({currentArg, previousArg}) => {
        return currentArg !== previousArg;
      },
    }),
  }),
});

export const {useSearchEventsQuery} = ticketmasterApi;
