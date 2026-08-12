import "server-only";

abstract class AppError extends Error {
  abstract readonly status: number;
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

class NotFoundError extends AppError {
  readonly status = 404;
  readonly code = "NOT_FOUND";
}

class ConflictError extends AppError {
  readonly status = 409;
  readonly code = "CONFLICT";
}

class ValidationError extends AppError {
  readonly status = 422;
  readonly code = "VALIDATION_ERROR";
}

class UnauthorizedError extends AppError {
  readonly status = 401;
  readonly code = "UNAUTHORIZED";
}

class ForbiddenError extends AppError {
  readonly status = 403;
  readonly code = "FORBIDDEN";
}

export {
  AppError,
  NotFoundError,
  ConflictError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
};
