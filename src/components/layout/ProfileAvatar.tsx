
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const ProfileAvatar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url, full_name')
          .eq('id', user.id)
          .single();

        if (profile) {
          setAvatarUrl(profile.avatar_url || '');
          setFullName(profile.full_name || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();

    // Subscribe to profile changes to update avatar in real-time
    const channel = supabase
      .channel('profile_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user?.id}`,
        },
        (payload) => {
          if (payload.new) {
            setAvatarUrl(payload.new.avatar_url || '');
            setFullName(payload.new.full_name || '');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getInitials = () => {
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <Button
      variant="ghost"
      className="relative h-10 w-10 rounded-full"
      onClick={() => navigate('/profile')}
    >
      <Avatar className="h-9 w-9">
        <AvatarImage src={avatarUrl} alt="Profile" />
        <AvatarFallback className="bg-primary/10">
          {avatarUrl ? <User className="h-5 w-5" /> : getInitials()}
        </AvatarFallback>
      </Avatar>
    </Button>
  );
};
