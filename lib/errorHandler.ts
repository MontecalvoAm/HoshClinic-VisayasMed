// HoshClinic/lib/errorHandler.ts
import { NextResponse } from 'next/server';
import logger from './logger';
import { AppError, InternalServerError } from './errors';
import { StatusCodes } from 'http-status-codes';

// A generic error handler for API Route Handlers
export const apiErrorHandler = (handler: Function) => async (request: Request, ...args: any[]) => {
  try {
    return await handler(request, ...args);
  } catch (error: any) {
    // Log the error
    if (error instanceof AppError) {
      logger.error({ 
        name: error.name,
        httpCode: error.httpCode,
        message: error.message,
        isOperational: error.isOperational,
        details: error.details,
        stack: error.stack 
      }, `API Error: ${error.message}`);
    } else {
      logger.error({ 
        name: error.name || 'UnknownError',
        httpCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred',
        isOperational: false,
        stack: error.stack 
      }, `Unexpected API Error: ${error.message || 'An unexpected error occurred'}`);
    }

    // Return standardized error response
    if (error instanceof AppError) {
      return NextResponse.json({
        message: error.message,
        ...(error.details && { details: error.details })
      }, { status: error.httpCode });
    } else {
      // For unexpected errors, return a generic message to the client
      // but log the full error details for debugging.
      return NextResponse.json({
        message: 'An unexpected internal server error occurred.'
      }, { status: StatusCodes.INTERNAL_SERVER_ERROR });
    }
  }
};
