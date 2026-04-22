import type { AxiosError } from 'axios';

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  const err = error as AxiosError<{ message?: string; errors?: string[] }>;
  const data = err.response?.data;
  if (data?.errors?.length) {
    return data.errors.join('. ');
  }
  if (typeof data?.message === 'string') {
    return data.message;
  }
  if (err.message) {
    return err.message;
  }
  return fallback;
}
