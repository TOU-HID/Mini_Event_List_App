import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';
import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {TM_API_BASE_URL} from './config';

/**
 * Custom base query that wraps fetchBaseQuery with request/response logging.
 * Logs method, URL, params, response status, and data (or error) for every API call.
 */

const rawBaseQuery = fetchBaseQuery({baseUrl: TM_API_BASE_URL});

const TAG = '🌐 API';

const redactSensitive = (value: unknown): unknown => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }

  return Object.entries(value as Record<string, unknown>).reduce<
    Record<string, unknown>
  >((acc, [key, fieldValue]) => {
    const normalizedKey = key.toLowerCase();
    if (
      normalizedKey.includes('apikey') ||
      normalizedKey.includes('authorization') ||
      normalizedKey.includes('token')
    ) {
      acc[key] = '***REDACTED***';
      return acc;
    }
    acc[key] = fieldValue;
    return acc;
  }, {});
};

export const baseQueryWithLogger: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  // ── Build readable request info ──────────────────────────────────
  const method =
    typeof args === 'string' ? 'GET' : (args.method ?? 'GET').toUpperCase();
  const url = typeof args === 'string' ? args : args.url;
  const params = typeof args === 'string' ? undefined : args.params;
  const body = typeof args === 'string' ? undefined : args.body;
  const safeParams = redactSensitive(params);
  const safeBody = redactSensitive(body);

  const timestamp = new Date().toISOString();

  console.log(
    `\n${TAG} ➡️  REQUEST  [${timestamp}]`,
    `\n   Endpoint : ${api.endpoint}`,
    `\n   Method   : ${method}`,
    `\n   URL      : ${TM_API_BASE_URL}${url}`,
    safeParams ? `\n   Params   : ${JSON.stringify(safeParams, null, 2)}` : '',
    safeBody ? `\n   Body     : ${JSON.stringify(safeBody, null, 2)}` : '',
  );

  // ── Execute the actual request ───────────────────────────────────
  const startMs = Date.now();
  const result = await rawBaseQuery(args, api, extraOptions);
  const durationMs = Date.now() - startMs;

  // ── Log response ─────────────────────────────────────────────────
  if (result.error) {
    const errorData = result.error.data as
      | {
          fault?: {
            detail?: {
              errorcode?: string;
            };
          };
        }
      | undefined;
    const invalidApiKey =
      result.error.status === 401 &&
      errorData?.fault?.detail?.errorcode === 'oauth.v2.InvalidApiKey';

    console.error(
      `\n${TAG} ❌ ERROR   [${durationMs}ms]`,
      `\n   Endpoint : ${api.endpoint}`,
      `\n   Status   : ${result.error.status}`,
      `\n   Data     :`,
      JSON.stringify(result.error.data, null, 2),
    );

    if (invalidApiKey) {
      console.error(
        `${TAG} 🔑 INVALID API KEY\n` +
          '   Update TM_API_KEY in src/api/config.ts with a valid Ticketmaster Discovery key.\n' +
          '   Ensure the key is active and generated from your own Ticketmaster Developer account.',
      );
    }
  } else {
    // Summarize to avoid flooding the console with huge payloads
    const summary =
      typeof result.data === 'object' && result.data !== null
        ? Object.keys(result.data as Record<string, unknown>)
        : typeof result.data;

    console.log(
      `\n${TAG} ✅ SUCCESS [${durationMs}ms]`,
      `\n   Endpoint : ${api.endpoint}`,
      `\n   Status   : ${result.meta?.response?.status ?? 200}`,
      `\n   Keys     : ${JSON.stringify(summary)}`,
    );

    // Full payload in a collapsed console group (viewable in Flipper / Chrome debugger)
    if (__DEV__) {
      try {
        console.groupCollapsed?.(`${TAG} 📦 Full Response — ${api.endpoint}`);
        console.log(JSON.stringify(result.data, null, 2));
        console.groupEnd?.();
      } catch {
        // console.group not available in all RN environments — skip silently
      }
    }
  }

  return result;
};
