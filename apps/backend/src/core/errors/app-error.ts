export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(code: string, message: string, details?: unknown) {
    return new AppError(400, code, message, details);
  }

  static notFound(code: string, message: string) {
    return new AppError(404, code, message);
  }

  static conflict(code: string, message: string) {
    return new AppError(409, code, message);
  }

  static internal(message: string = 'Internal server error') {
    return new AppError(500, 'INTERNAL_ERROR', message);
  }
}
