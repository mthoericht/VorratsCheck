/** API error with status code and server message for targeted error handling. */
export class ApiError extends Error 
{
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown
  ) 
  {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  get isUnauthorized(): boolean 
  {
    return this.status === 401;
  }

  get isNotFound(): boolean 
  {
    return this.status === 404;
  }

  get isServerError(): boolean 
  {
    return this.status >= 500;
  }
}

export function isApiError(e: unknown): e is ApiError 
{
  return e instanceof ApiError;
}

export function getErrorMessage(e: unknown): string 
{
  if (isApiError(e)) return e.message;
  if (e instanceof Error) return e.message;
  return String(e);
}
