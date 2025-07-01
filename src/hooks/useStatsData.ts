
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface StatsData {
  totalSessions: number;
  mindfulMinutes: number;
  currentStreak: number;
  longestStreak: number;
  moodScore: number;
  minigameStreak: number;
  timeSpentOnApp: number;
  weeklyData: Array<{
    name: string;
    minutes: number;
    mood: number;
  }>;
}

export const useStatsData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<StatsData>({
    totalSessions: 0,
    mindfulMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    moodScore: 5,
    minigameStreak: 0,
    timeSpentOnApp: 0,
    weeklyData: []
  });
  const [loading, setLoading] = useState(true);

  const calculateMoodScore = (mood: string): number => {
    switch (mood) {
      case 'happy': return 9;
      case 'neutral': return 5;
      case 'sad': return 3;
      case 'angry': return 2;
      default: return 5;
    }
  };

  const fetchStatsData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get meditation sessions
      const { data: meditationData } = await supabase
        .from('meditation_sessions')
        .select('duration, created_at')
        .eq('user_id', user.id);

      // Get minigame progress
      const { data: minigameData } = await supabase
        .from('minigame_progress')
        .select('current_level, created_at')
        .eq('user_id', user.id);

      // Get chat sessions for app usage
      const { data: chatData } = await supabase
        .from('chat_sessions')
        .select('created_at, updated_at')
        .eq('user_id', user.id);

      // Get user settings for mood
      const { data: userSettings } = await supabase
        .from('user_settings')
        .select('mood')
        .eq('user_id', user.id)
        .single();

      // Calculate total mindful minutes
      const totalMinutes = meditationData?.reduce((sum, session) => sum + session.duration, 0) || 0;
      
      // Calculate mood score based on current mood
      const currentMoodScore = calculateMoodScore(userSettings?.mood || 'neutral');
      
      // Calculate minigame streak (current level)
      const maxLevel = minigameData?.reduce((max, game) => Math.max(max, game.current_level), 0) || 0;
      
      // Calculate time spent on app (rough estimate based on sessions)
      const appUsageMinutes = (chatData?.length || 0) * 15; // Assume 15 min per session
      
      // Generate weekly data
      const weeklyData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          name: date.toLocaleDateString('en', { weekday: 'short' }),
          minutes: Math.floor(Math.random() * 30) + 10, // Sample data
          mood: Math.floor(Math.random() * 5) + 5, // Sample data
        };
      });

      setData({
        totalSessions: meditationData?.length || 0,
        mindfulMinutes: totalMinutes,
        currentStreak: Math.floor(totalMinutes / 60), // Rough streak calculation
        longestStreak: Math.floor(totalMinutes / 30), // Rough longest streak
        moodScore: currentMoodScore,
        minigameStreak: maxLevel,
        timeSpentOnApp: appUsageMinutes,
        weeklyData
      });
    } catch (error) {
      console.error('Error fetching stats data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsData();
  }, [user]);

  return { data, loading, refetch: fetchStatsData };
};
