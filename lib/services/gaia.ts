/**
 * Gaia API Integration Service
 * 
 * This service provides integration with the Gaia API for AI-powered features
 * in the decentralized education platform.
 */

import { ErrorHandler, ErrorType, withErrorHandling } from './errorHandler';

// Default API endpoint for Gaia
const GAIA_MODEL_BASE_URL = process.env.GAIA_MODEL_BASE_URL || 'https://api.gaianet.ai/v1';
const GAIA_API_KEY = process.env.GAIA_API_KEY;

/**
 * Interface for chat message structure
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Interface for chat completion options
 */
export interface ChatCompletionOptions {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

/**
 * Interface for chat completion response
 */
export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Class for interacting with the Gaia API
 */
export class GaiaService {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl = baseUrl || GAIA_MODEL_BASE_URL;
    this.apiKey = apiKey || GAIA_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('Gaia API key is not set. Please set GAIA_API_KEY in your environment variables.');
    }
  }

  /**
   * Send a chat completion request to the Gaia API through our local API proxy
   * @param options Chat completion options
   * @returns Promise with the chat completion response
   */
  createChatCompletion = withErrorHandling(async (options: ChatCompletionOptions): Promise<ChatCompletionResponse> => {
    try {
      // Use our local API proxy to avoid CORS issues
      const response = await fetch('/api/gaia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: options.messages,
          model: options.model || 'gaia-default',
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 2000,
          stream: options.stream || false
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(`Gaia API Error: ${response.status} - ${JSON.stringify(errorData)}`);
        // Add additional properties to help with error categorization
        (error as any).status = response.status;
        (error as any).statusText = response.statusText;
        (error as any).details = errorData;
        throw error;
      }

      return await response.json();
    } catch (error) {
      // Create a more user-friendly error message
      const errorInfo = ErrorHandler.handleError(error, {
        service: 'GaiaService',
        method: 'createChatCompletion',
        options
      });
      
      // Rethrow with additional context
      const enhancedError = new Error(ErrorHandler.formatErrorForUser(errorInfo));
      (enhancedError as any).originalError = error;
      (enhancedError as any).errorInfo = errorInfo;
      throw enhancedError;
    }
  }, { service: 'GaiaService' });

  /**
   * Create a streaming chat completion through our local API proxy
   * @param options Chat completion options
   * @returns AsyncGenerator that yields chunks of the response
   */
  async *createStreamingChatCompletion(options: ChatCompletionOptions): AsyncGenerator<any, void, unknown> {
    try {
      // Use our local API proxy to avoid CORS issues
      const response = await fetch('/api/gaia/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: options.messages,
          model: options.model || 'gaia-default',
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 2000,
          stream: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gaia API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine === '') continue;
          if (trimmedLine === 'data: [DONE]') return;
          
          if (trimmedLine.startsWith('data: ')) {
            const jsonStr = trimmedLine.slice(6);
            try {
              const json = JSON.parse(jsonStr);
              yield json;
            } catch (e) {
              console.error('Error parsing JSON from stream:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in streaming chat completion:', error);
      throw error;
    }
  }

  /**
   * Get information about the Gaia node
   * @returns Promise with node information
   */
  async getNodeInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/node/info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gaia API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting Gaia node info:', error);
      throw error;
    }
  }
}

// Export a singleton instance of the service
export const gaiaService = new GaiaService();
