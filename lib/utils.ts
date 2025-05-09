import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ChatMessage } from "./services/gaia"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Helper function to create properly typed chat messages for Gaia API
 * @param role The role of the message sender (system, user, or assistant)
 * @param content The content of the message
 * @returns A properly typed ChatMessage object
 */
export function createChatMessage(role: 'system' | 'user' | 'assistant', content: string): ChatMessage {
  return { role, content }
}

/**
 * Helper function to create a system message
 * @param content The content of the system message
 * @returns A properly typed system message
 */
export function createSystemMessage(content: string): ChatMessage {
  return createChatMessage('system', content)
}

/**
 * Helper function to create a user message
 * @param content The content of the user message
 * @returns A properly typed user message
 */
export function createUserMessage(content: string): ChatMessage {
  return createChatMessage('user', content)
}

/**
 * Helper function to create an assistant message
 * @param content The content of the assistant message
 * @returns A properly typed assistant message
 */
export function createAssistantMessage(content: string): ChatMessage {
  return createChatMessage('assistant', content)
}
