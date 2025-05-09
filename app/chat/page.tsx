"use client";

import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gaiaService } from "@/lib/services/gaia";
import { useAccount } from "wagmi";
import { Loader2, Send, Brain } from "lucide-react";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const { isConnected, address } = useAccount();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'Welcome to the Decentralized Education AI Assistant. Ask me anything about blockchain, Web3, or related topics!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history from localStorage
  useEffect(() => {
    if (isConnected && address) {
      const savedMessages = localStorage.getItem(`chat_history_${address}`);
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          // Convert string timestamps back to Date objects
          const messagesWithDates = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(messagesWithDates);
        } catch (error) {
          console.error('Error parsing saved messages:', error);
        }
      }
    }
  }, [isConnected, address]);

  // Save chat history to localStorage
  useEffect(() => {
    if (isConnected && address && messages.length > 1) {
      localStorage.setItem(`chat_history_${address}`, JSON.stringify(messages));
    }
  }, [messages, isConnected, address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create system prompt for educational context
      const systemPrompt = `You are an educational AI assistant for a decentralized education platform focused on Web3, blockchain, and cryptocurrency topics. 
Your goal is to provide accurate, helpful information to users learning about these technologies.
${isConnected ? `The user is connected with wallet address: ${address}` : 'The user is not currently connected with a wallet.'}
Always be concise, accurate, and educational in your responses. Use simple analogies to explain complex concepts when appropriate.`;

      // Prepare messages for API call
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.filter(m => m.role !== 'system').map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: input }
      ];

      const response = await gaiaService.createChatCompletion({
        messages: apiMessages,
        temperature: 0.7
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Gaia API:', error);
      
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again later.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      <main className="flex-1 container max-w-4xl mx-auto py-8 px-4">
        <Card className="h-[calc(100vh-12rem)]">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-500" />
              AI Education Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[calc(100%-4rem)]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${message.role === 'system' ? 'justify-center' : ''}`}
                >
                  {message.role === 'system' ? (
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[80%]">
                      <p className="text-gray-600 dark:text-gray-300">{message.content}</p>
                    </div>
                  ) : message.role === 'user' ? (
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-3 max-w-[80%]">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">You</span>
                        <span className="text-xs text-gray-500 ml-2">{formatTime(message.timestamp)}</span>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-700 border rounded-lg p-3 max-w-[80%]">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm flex items-center">
                          <Brain className="h-3 w-3 mr-1" /> Assistant
                        </span>
                        <span className="text-xs text-gray-500 ml-2">{formatTime(message.timestamp)}</span>
                      </div>
                      <p>{message.content}</p>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about blockchain, Web3, or crypto..."
                  disabled={isLoading || !isConnected}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !isConnected || !input.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
              {!isConnected && (
                <p className="text-sm text-gray-500 mt-2">
                  Please connect your wallet to chat with the AI assistant.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
