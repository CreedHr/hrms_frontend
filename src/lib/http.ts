/**
 * HTTP client stub. The demo runs on mocks; set VITE_USE_MOCKS=false and point
 * VITE_API_BASE_URL at a real API to swap every service without touching UI code.
 */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000/api/v1';

export const USE_MOCKS: boolean =
  ((import.meta.env.VITE_USE_MOCKS as string | undefined) ?? 'true') !== 'false';

export interface ApiError {
  status: number;
  message: string;
}

export class HttpError extends Error implements ApiError {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

const buildUrl = (path: string, query?: Record<string, string | number | undefined>): string => {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
};

const request = async <T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  options?: { body?: unknown; query?: Record<string, string | number | undefined> },
): Promise<T> => {
  const response = await fetch(buildUrl(path, options?.query), {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: options?.body === undefined ? undefined : JSON.stringify(options.body),
  });
  if (!response.ok) {
    throw new HttpError(response.status, `${method} ${path} failed with ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
};

/** Minimal typed HTTP surface used by services when mocks are disabled. */
export const http = {
  get: <T>(path: string, query?: Record<string, string | number | undefined>): Promise<T> =>
    request<T>('GET', path, { query }),
  post: <T>(path: string, body: unknown): Promise<T> => request<T>('POST', path, { body }),
  patch: <T>(path: string, body: unknown): Promise<T> => request<T>('PATCH', path, { body }),
  delete: (path: string): Promise<void> => request<void>('DELETE', path),
};
