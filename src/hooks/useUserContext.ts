
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserContext {
  settings: {
    mood: string;
    communicationStyle: string;
    personalityTraits: any;
    therapyGoals: string[];
    triggerWords: string[];
    preferredTopics: string[];
  };
  preferences: {
    aiPersonality: string;
    responseLength: string;
    useFormalLanguage: boolean;
    includeExercises: boolean;
  };
  recentInsights: any[];
  progressData: any[];
  journalEntries: any[];
}

export const useUserContext = () => {
  const { user } = useAuth();
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserContext = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get user settings
      const { data: settings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get user preferences
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get recent insights
      const { data: insights } = await supabase
        .from('diary_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Get progress data
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Get journal entries
      const { data: journalEntries } = await supabase
        .from('journal_entries')
        .select('title, mood, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      setUserContext({
        settings: {
          mood: settings?.mood || 'neutral',
          communicationStyle: settings?.communication_style || 'supportive',
          personalityTraits: settings?.personality_traits || {},
          therapyGoals: settings?.therapy_goals || [],
          triggerWords: settings?.trigger_words || [],
          preferredTopics: settings?.preferred_topics || [],
        },
        preferences: {
          aiPersonality: preferences?.ai_personality || 'empathetic',
          responseLength: preferences?.response_length || 'medium',
          useFormalLanguage: preferences?.use_formal_language || false,
          includeExercises: preferences?.include_exercises || true,
        },
        recentInsights: insights || [],
        progressData: progress || [],
        journalEntries: journalEntries || [],
      });
    } catch (error) {
      console.error('Error fetching user context:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserContext();
  }, [user]);

  return { userContext, loading, refetchContext: fetchUserContext };
};
