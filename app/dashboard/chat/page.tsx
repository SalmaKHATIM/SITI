'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-provider';
import { generateUUIDv5 } from '@/lib/uuid-utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  message_text?: string;
  message?: string;
  response_text?: string | null;
  response?: string | null;
  created_at: string;
}

export default function ChatPage() {
  const { user: authUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Generate a deterministic UUID from the user's email
  const userUUID = useMemo(() => {
    if (!authUser?.email) return null;
    return generateUUIDv5(authUser.email);
  }, [authUser?.email]);

  useEffect(() => {
    const initChat = async () => {
      // Load chat history for current user using generated UUID
      if (userUUID) {
        const { data: chatData, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', userUUID)
          .order('created_at', { ascending: true })
          .limit(50);

        if (error) {
          console.error('[STTIS] Error loading chat history:', error);
        } else {
          // Map database columns to interface fields
          const mappedMessages = (chatData || []).map((msg: any) => ({
            id: msg.id,
            message: msg.message_text || msg.message,
            response: msg.response_text || msg.response,
            created_at: msg.created_at,
          }));
          setMessages(mappedMessages);
        }
      }

      setLoading(false);
    };

    initChat();
  }, [userUUID]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !userUUID) {
      return;
    }

    setSending(true);
    const userMessage = input.trim();

    try {
      // Search for existing message in the database
      const { data: existingMessages, error: searchError } = await supabase
        .from('chat_messages')
        .select('*')
        .ilike('message', userMessage)
        .limit(1);

      if (searchError) {
        console.error('[STTIS] Error searching message:', searchError);
        alert('Erreur lors de la recherche du message');
        setSending(false);
        return;
      }

      let response = '';
      let messageId = '';

      if (existingMessages && existingMessages.length > 0) {
        // Found existing message with response
        const foundMessage = existingMessages[0];
        response = foundMessage.response || 'Pas de réponse disponible';
        messageId = foundMessage.id;
      } else {
        // Message not found - create new entry
        const { data: newMessage, error: insertError } = await supabase
          .from('chat_messages')
          .insert([
            {
              user_id: userUUID,
              message: userMessage,
              response: null,
              intent: null,
              entities: null,
            },
          ])
          .select()
          .single();

        if (insertError) {
          console.error('[STTIS] Error saving message:', insertError);
          alert('Erreur lors de l\'envoi du message');
          setSending(false);
          return;
        }

        messageId = newMessage?.id || '';
        response = 'Je n\'ai pas compris votre question. Veuillez réessayer avec une question existante.';
      }

      // Add message to local state
      setMessages([
        ...messages,
        {
          id: messageId,
          message: userMessage,
          response: response,
          created_at: new Date().toISOString(),
        },
      ]);

      // Clear input
      setInput('');
    } catch (error) {
      console.error('[STTIS] Error in handleSendMessage:', error);
      alert('Erreur: ' + String(error));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-screen flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Chat Assistant</h1>
        <p className="text-muted-foreground mt-1">
          Ask natural language questions about your tea supply chain
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col border border-border rounded-lg bg-card overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">
                  Welcome to the STTIS Chat Assistant
                </p>
                <p className="text-sm text-muted-foreground">
                  Ask questions about products, batches, stock levels, and more.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={msg.id || idx} className="space-y-3">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-lg px-4 py-3 max-w-md">
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>

                {/* Bot Response */}
                {msg.response && (
                  <div className="flex justify-start">
                    <div className="bg-muted text-muted-foreground rounded-lg px-4 py-3 max-w-md">
                      <p className="text-sm">{msg.response}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {sending && (
            <div className="flex justify-start">
              <div className="bg-muted text-muted-foreground rounded-lg px-4 py-3">
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-6 bg-card">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              type="text"
              placeholder="Ask about products, batches, stock levels..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!input.trim() || sending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
