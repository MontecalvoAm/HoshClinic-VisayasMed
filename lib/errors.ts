// HoshClinic/lib/errors.ts
import { StatusCodes } from 'http-status-codes';

export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: number;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, any>;

  constructor(name: string, httpCode: number, message: string, isOperational: boolean, details?: Record<string, any>) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain

    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this);
  }
}

// Specific Error Classes
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', details?: Record<string, any>) {
    super('AuthenticationError', StatusCodes.UNAUTHORIZED, message, true, details);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Unauthorized access', details?: Record<string, any>) {
    super('AuthorizationError', StatusCodes.FORBIDDEN, message, true, details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Invalid input', details?: Record<string, any>) {
    super('ValidationError', StatusCodes.BAD_REQUEST, message, true, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', details?: Record<string, any>) {
    super('NotFoundError', StatusCodes.NOT_FOUND, message, true, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', details?: Record<string, any>) {
    super('InternalServerError', StatusCodes.INTERNAL_SERVER_ERROR, message, false, details); // isOperational: false for unexpected errors
  }
}
