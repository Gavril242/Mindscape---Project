
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface DashboardData {
  userName: string;
  currentStreak: number;
  totalSessions: number;
  totalTimeSeconds: number;
  todayActivities: number;
  favoriteActivity: string;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>({
    userName: '',
    currentStreak: 0,
    totalSessions: 0,
    totalTimeSeconds: 0,
    todayActivities: 0,
    favoriteActivity: 'meditation'
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      // Get app statistics
      const { data: stats } = await supabase
        .from('app_statistics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Get today's activities
      const { data: todayData } = await supabase
        .from('daily_streaks')
        .select('activities_completed')
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0])
        .single();

      setData({
        userName: profile?.full_name || user.email?.split('@')[0] || 'User',
        currentStreak: stats?.current_streak || 0,
        totalSessions: stats?.total_sessions || 0,
        totalTimeSeconds: stats?.total_time_seconds || 0,
        todayActivities: todayData?.activities_completed || 0,
        favoriteActivity: stats?.favorite_activity || 'meditation'
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  return { data, loading, refetch: fetchDashboardData };
};
