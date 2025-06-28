
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useSound } from "@/components/SoundContext";
import MeditationOptions from "./MeditationOptions";
import MeditationSessionControls from "./MeditationSessionControls";
import ActiveMeditationSession from "./ActiveMeditationSession";
import MeditationSessionHistory from "./MeditationSessionHistory";

interface MeditationSession {
  id: string;
  session_type: string;
  duration: number;
  youtube_link?: string;
  notes?: string;
  created_at: string;
}

const MeditationTab: React.FC = () => {
  const [isMeditating, setIsMeditating] = useState(false);
  const [meditationYoutubeLink, setMeditationYoutubeLink] = useState('');
  const [selectedMeditationTitle, setSelectedMeditationTitle] = useState('Mindful Morning');
  const [selectedMeditationDuration, setSelectedMeditationDuration] = useState(10);
  const [meditationNotes, setMeditationNotes] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [meditationSessions, setMeditationSessions] = useState<MeditationSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  
  const { user } = useAuth();
  const { playWaterDrop } = useSound();

  // Fetch meditation sessions
  useEffect(() => {
    if (!user) return;
    
    const fetchMeditationSessions = async () => {
      try {
        setLoadingSessions(true);
        const { data, error } = await supabase
          .from('meditation_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        setMeditationSessions(data || []);
      } catch (error) {
        console.error('Error fetching meditation sessions:', error);
        toast('Failed to load meditation sessions');
      } finally {
        setLoadingSessions(false);
      }
    };
    
    fetchMeditationSessions();
  }, [user]);
  
  // Start meditation timer
  const startMeditation = () => {
    if (!selectedMeditationTitle || !selectedMeditationDuration) {
      toast('Please select a meditation type and duration');
      return;
    }
    
    setIsMeditating(true);
    setTimeRemaining(selectedMeditationDuration * 60);
    playWaterDrop();
  };
  
  // Handle YouTube video duration change
  const handleVideoDurationChange = (duration: number) => {
    if (duration && duration > 0) {
      // Convert duration from seconds to minutes, round up
      const durationMinutes = Math.ceil(duration / 60);
      setSelectedMeditationDuration(durationMinutes);
      setTimeRemaining(duration);
      
      toast(`YouTube meditation duration: ${durationMinutes} minutes`);
    }
  };
  
  // End meditation session
  const endMeditation = async (completed = true) => {
    setIsMeditating(false);
    playWaterDrop();
    
    if (!user) return;
    
    try {
      // Save session to database
      const { error } = await supabase
        .from('meditation_sessions')
        .insert({
          user_id: user.id,
          session_type: selectedMeditationTitle,
          duration: selectedMeditationDuration,
          youtube_link: meditationYoutubeLink || null,
          notes: meditationNotes || null,
          completed: completed
        });
      
      if (error) throw error;
      
      toast('Meditation session saved');
      
      // Refresh the sessions list
      const { data: newSessions, error: fetchError } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (fetchError) throw fetchError;
      
      setMeditationSessions(newSessions || []);
      
      // Clear form fields
      setMeditationYoutubeLink('');
      setMeditationNotes('');
      
    } catch (error) {
      console.error('Error saving meditation session:', error);
      toast('Failed to save meditation session');
    }
  };
  
  // Countdown timer effect
  useEffect(() => {
    if (!isMeditating || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endMeditation(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isMeditating, timeRemaining]);
  
  // Format time remaining
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Extract YouTube ID
  const getYoutubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const handleSelectMeditation = (title: string, duration: number) => {
    setSelectedMeditationTitle(title);
    setSelectedMeditationDuration(duration);
  };

  // Handle session completion
  const handleSessionComplete = () => {
    endMeditation(true);
  };

  // Handle youtube link change
  const handleYoutubeLinkChange = (link: string) => {
    setMeditationYoutubeLink(link);
  };

  // Handle notes change
  const handleNotesChange = (notes: string) => {
    setMeditationNotes(notes);
  };

  return (
    <div className="space-y-4">
      {isMeditating ? (
        <ActiveMeditationSession
          title={selectedMeditationTitle}
          duration={selectedMeditationDuration}
          timeRemaining={timeRemaining}
          youtubeLink={meditationYoutubeLink}
          notes={meditationNotes}
          onNotesChange={handleNotesChange}
          onComplete={handleSessionComplete}
          onEnd={endMeditation}
          onVideoDurationChange={handleVideoDurationChange}
          formatTimeRemaining={formatTimeRemaining}
          getYoutubeId={getYoutubeId}
        />
      ) : (
        <div className="space-y-6">
          <MeditationOptions 
            selectedTitle={selectedMeditationTitle}
            onSelectMeditation={handleSelectMeditation}
          />
          <MeditationSessionControls
            meditationYoutubeLink={meditationYoutubeLink}
            onYoutubeLinkChange={handleYoutubeLinkChange}
            onStartMeditation={startMeditation}
          />
        </div>
      )}
      
      <MeditationSessionHistory 
        sessions={meditationSessions}
        isLoading={loadingSessions}
      />
    </div>
  );
};

export default MeditationTab;
