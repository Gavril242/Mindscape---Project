import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMood } from '@/context/MoodContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

export const useChatContext = () => {
  const { user } = useAuth();
  const { setMood } = useMood();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userContext, setUserContext] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const loadSessions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setSessions(data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error('Failed to load chat sessions');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (sessionId: string | null) => {
    if (!sessionId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load chat messages');
    } finally {
      setLoading(false);
    }
  };

  const loadUserContext = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('chat_context')
        .eq('user_id', user.id)
        .single();

      if (error) {
        throw error;
      }

      setUserContext(data?.chat_context || '');
    } catch (error) {
      console.error('Error loading user context:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadSessions();
      loadUserContext();
    }
  }, [user]);

  useEffect(() => {
    if (currentSession) {
      loadMessages(currentSession);
    }
  }, [currentSession]);

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return;

    setSendingMessage(true);
    
    try {
      const response = await supabase.functions.invoke('chat-ai', {
        body: {
          message: content,
          header: userContext,
          sessionId: currentSession || 'new',
          userId: user.id,
        },
      });

      if (response.error) {
        throw response.error;
      }

      const { response: aiResponse, sessionId, detectedMood } = response.data;

      // Update mood if detected
      if (detectedMood && detectedMood !== 'neutral') {
        console.log('Updating mood based on AI detection:', detectedMood);
        await setMood(detectedMood);
      }

      if (!currentSession) {
        setCurrentSession(sessionId);
        await loadSessions();
      }

      await loadMessages(sessionId || currentSession);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const createNewChat = async () => {
    setCurrentSession(null);
    setMessages([]);
  };

  const deleteChat = async (sessionId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        throw error;
      }

      setSessions(sessions.filter(session => session.id !== sessionId));
      setCurrentSession(null);
      setMessages([]);
      toast.success('Chat deleted successfully');
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Failed to delete chat');
    } finally {
      setLoading(false);
    }
  };

  return {
    sessions,
    currentSession,
    setCurrentSession,
    messages,
    userContext,
    loading,
    sendingMessage,
    createNewChat,
    deleteChat,
    sendMessage,
  };
};
