import { describe, it, expect } from 'vitest';
import { ApiError, isApiError, getErrorMessage } from '@/app/lib/api/errors';

describe('api/errors', () => 
{
  describe('ApiError', () => 
  {
    it('creates error with message and status', () => 
    {
      const err = new ApiError('Unauthorized', 401);
      expect(err.message).toBe('Unauthorized');
      expect(err.status).toBe(401);
      expect(err.name).toBe('ApiError');
    });

    it('isUnauthorized returns true for 401', () => 
    {
      expect(new ApiError('', 401).isUnauthorized).toBe(true);
      expect(new ApiError('', 403).isUnauthorized).toBe(false);
    });

    it('isNotFound returns true for 404', () => 
    {
      expect(new ApiError('', 404).isNotFound).toBe(true);
      expect(new ApiError('', 400).isNotFound).toBe(false);
    });

    it('isServerError returns true for 5xx', () => 
    {
      expect(new ApiError('', 500).isServerError).toBe(true);
      expect(new ApiError('', 502).isServerError).toBe(true);
      expect(new ApiError('', 499).isServerError).toBe(false);
    });
  });

  describe('isApiError', () => 
  {
    it('returns true for ApiError instance', () => 
    {
      expect(isApiError(new ApiError('x', 400))).toBe(true);
    });

    it('returns false for plain Error', () => 
    {
      expect(isApiError(new Error('x'))).toBe(false);
    });

    it('returns false for non-error', () => 
    {
      expect(isApiError('string')).toBe(false);
      expect(isApiError(null)).toBe(false);
    });
  });

  describe('getErrorMessage', () => 
  {
    it('returns message for ApiError', () => 
    {
      expect(getErrorMessage(new ApiError('API fehlgeschlagen', 500))).toBe('API fehlgeschlagen');
    });

    it('returns message for Error', () => 
    {
      expect(getErrorMessage(new Error('Generic error'))).toBe('Generic error');
    });

    it('returns string for non-Error', () => 
    {
      expect(getErrorMessage('something')).toBe('something');
    });
  });
});
