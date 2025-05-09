/**
 * Error Handler Service
 * 
 * This service provides centralized error handling for API calls and other operations
 * in the decentralized education platform.
 */

// Define error types for better categorization
export enum ErrorType {
  API = 'API_ERROR',
  NETWORK = 'NETWORK_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

// Interface for structured error information
export interface ErrorInfo {
  type: ErrorType;
  message: string;
  originalError?: any;
  timestamp: Date;
  context?: Record<string, any>;
}

// Class to handle error logging and reporting
export class ErrorHandler {
  private static errors: ErrorInfo[] = [];
  private static maxErrorsStored = 50;
  
  /**
   * Handle an error by logging it and optionally reporting it
   * @param error The error to handle
   * @param context Additional context about where/when the error occurred
   * @returns Structured error information
   */
  static handleError(error: any, context?: Record<string, any>): ErrorInfo {
    // Determine error type
    const errorType = this.determineErrorType(error);
    
    // Create structured error info
    const errorInfo: ErrorInfo = {
      type: errorType,
      message: this.getErrorMessage(error, errorType),
      originalError: error,
      timestamp: new Date(),
      context
    };
    
    // Log the error
    this.logError(errorInfo);
    
    // Store the error (with a limit to prevent memory issues)
    this.storeError(errorInfo);
    
    return errorInfo;
  }
  
  /**
   * Determine the type of error based on its properties
   * @param error The error to analyze
   * @returns The determined error type
   */
  private static determineErrorType(error: any): ErrorType {
    if (!error) return ErrorType.UNKNOWN;
    
    // Network errors
    if (
      error.message?.includes('network') || 
      error.message?.includes('fetch') ||
      error.name === 'NetworkError' ||
      error.name === 'AbortError' ||
      error.code === 'ECONNREFUSED' ||
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT'
    ) {
      return ErrorType.NETWORK;
    }
    
    // API errors
    if (
      error.status >= 400 || 
      error.statusCode >= 400 ||
      error.message?.includes('API') ||
      error.name === 'ApiError'
    ) {
      // Authentication errors are a subset of API errors
      if (error.status === 401 || error.status === 403 || error.statusCode === 401 || error.statusCode === 403) {
        return ErrorType.AUTHENTICATION;
      }
      return ErrorType.API;
    }
    
    // Validation errors
    if (
      error.name === 'ValidationError' ||
      error.message?.includes('validation') ||
      error.message?.includes('invalid')
    ) {
      return ErrorType.VALIDATION;
    }
    
    return ErrorType.UNKNOWN;
  }
  
  /**
   * Get a user-friendly error message based on the error and its type
   * @param error The original error
   * @param type The determined error type
   * @returns A user-friendly error message
   */
  private static getErrorMessage(error: any, type: ErrorType): string {
    if (error?.message) {
      return error.message;
    }
    
    // Default messages based on error type
    switch (type) {
      case ErrorType.NETWORK:
        return 'Network error occurred. Please check your internet connection and try again.';
      case ErrorType.API:
        return 'An error occurred while communicating with the server. Please try again later.';
      case ErrorType.AUTHENTICATION:
        return 'Authentication error. Please check your credentials or log in again.';
      case ErrorType.VALIDATION:
        return 'Validation error. Please check your input and try again.';
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  }
  
  /**
   * Log the error to the console
   * @param errorInfo Structured error information
   */
  private static logError(errorInfo: ErrorInfo): void {
    console.error('Error:', {
      type: errorInfo.type,
      message: errorInfo.message,
      timestamp: errorInfo.timestamp.toISOString(),
      context: errorInfo.context,
      originalError: errorInfo.originalError
    });
  }
  
  /**
   * Store the error in memory for later reference
   * @param errorInfo Structured error information
   */
  private static storeError(errorInfo: ErrorInfo): void {
    this.errors.unshift(errorInfo);
    
    // Limit the number of stored errors to prevent memory issues
    if (this.errors.length > this.maxErrorsStored) {
      this.errors = this.errors.slice(0, this.maxErrorsStored);
    }
  }
  
  /**
   * Get recent errors
   * @param limit Maximum number of errors to retrieve
   * @returns Recent errors
   */
  static getRecentErrors(limit: number = 10): ErrorInfo[] {
    return this.errors.slice(0, limit);
  }
  
  /**
   * Clear all stored errors
   */
  static clearErrors(): void {
    this.errors = [];
  }
  
  /**
   * Create a user-friendly error message for display
   * @param error The error to format
   * @returns A user-friendly error message
   */
  static formatErrorForUser(error: any): string {
    const errorInfo = error instanceof Object && 'type' in error ? 
      error as ErrorInfo : 
      this.handleError(error);
    
    switch (errorInfo.type) {
      case ErrorType.NETWORK:
        return 'Unable to connect to the server. Please check your internet connection and try again.';
      case ErrorType.API:
        return 'The server encountered an issue processing your request. Please try again later.';
      case ErrorType.AUTHENTICATION:
        return 'Your session may have expired. Please log in again to continue.';
      case ErrorType.VALIDATION:
        return 'Please check your input and try again.';
      default:
        return 'Something went wrong. Please try again later.';
    }
  }
}

/**
 * Wrap an async function with error handling
 * @param fn The async function to wrap
 * @param context Additional context about the function
 * @returns A wrapped function that handles errors
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: Record<string, any>
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      ErrorHandler.handleError(error, {
        ...context,
        functionName: fn.name,
        arguments: args
      });
      throw error;
    }
  };
}
