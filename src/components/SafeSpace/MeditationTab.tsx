import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useSound } from "@/components/SoundContext";

import MeditationOptions          from "./MeditationOptions";
import MeditationSessionControls  from "./MeditationSessionControls";
import ActiveMeditationSession    from "./ActiveMeditationSession";
import MeditationSessionHistory   from "./MeditationSessionHistory";

interface MeditationSession {
  id: string;
  session_type: string;
  duration: number;
  youtube_link?: string;
  notes?: string;
  created_at: string;
}

/* ── links for each preset ───────────────────────────────────────────── */
const LINK_MAP: Record<string, { url: string; mins: number }> = {
  "Mindful Morning":    { url: "https://www.youtube.com/watch?v=OccjH_2ddQc", mins: 10 },
  "Deep Relaxation":    { url: "https://www.youtube.com/watch?v=aIIEI33EUqI", mins: 15 },
  "Stress Relief":      { url: "https://www.youtube.com/watch?v=zYzFUBMJO9E", mins: 8  },
  "Bedtime Relaxation": { url: "https://www.youtube.com/watch?v=TP2gb2fSYXY", mins: 12 },
};

const MeditationTab: React.FC = () => {
  const [isMeditating, setIsMeditating] = useState(false);

  /* selected preset defaults to “Mindful Morning” */
  const [selectedMeditationTitle, setSelectedMeditationTitle] = useState<keyof typeof LINK_MAP>("Mindful Morning");
  const [selectedMeditationDuration, setSelectedMeditationDuration] = useState<number>(LINK_MAP["Mindful Morning"].mins);
  const [meditationYoutubeLink, setMeditationYoutubeLink] = useState<string>(LINK_MAP["Mindful Morning"].url);

  const [meditationNotes, setMeditationNotes] = useState("");
  const [timeRemaining, setTimeRemaining]   = useState(0);

  const [meditationSessions, setMeditationSessions] = useState<MeditationSession[]>([]);
  const [loadingSessions,   setLoadingSessions]     = useState(false);

  const { user }         = useAuth();
  const { playWaterDrop } = useSound();

  /* ── fetch recent sessions (unchanged) ─────────────────────────────── */
  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      try {
        setLoadingSessions(true);
        const { data, error } = await supabase
          .from("meditation_sessions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) throw error;
        setMeditationSessions(data || []);
      } catch (err) {
        console.error(err);
        toast("Failed to load meditation sessions");
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchSessions();
  }, [user]);

  /* ── start meditation ─────────────────────────────────────────────── */
  const startMeditation = () => {
    if (!selectedMeditationTitle) {
      toast("Please select a meditation type");
      return;
    }
    setIsMeditating(true);
    setTimeRemaining(selectedMeditationDuration * 60);
    playWaterDrop();
  };

  /* ── sync video duration (only for custom links / iframe mode) ─────── */
  const handleVideoDurationChange = (duration: number) => {
    if (duration > 0) {
      setSelectedMeditationDuration(Math.ceil(duration / 60));
      setTimeRemaining(duration);
      toast(`YouTube meditation duration: ${Math.ceil(duration / 60)} minutes`);
    }
  };

  /* ── end / save session ────────────────────────────────────────────── */
  const endMeditation = async (completed = true) => {
    setIsMeditating(false);
    playWaterDrop();
    if (!user) return;

    try {
      const { error } = await supabase.from("meditation_sessions").insert({
        user_id: user.id,
        session_type: selectedMeditationTitle,
        duration: selectedMeditationDuration,
        youtube_link: meditationYoutubeLink || null,
        notes: meditationNotes || null,
        completed,
      });
      if (error) throw error;

      toast("Meditation session saved");

      /* refresh */
      const { data, error: fetchErr } = await supabase
        .from("meditation_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (fetchErr) throw fetchErr;
      setMeditationSessions(data || []);

      /* clear notes */
      setMeditationNotes("");
    } catch (err) {
      console.error(err);
      toast("Failed to save session");
    }
  };

  /* ── countdown tick ────────────────────────────────────────────────── */
  useEffect(() => {
    if (!isMeditating || timeRemaining <= 0) return;
    const id = setInterval(() => {
      setTimeRemaining((t) => {
        if (t <= 1) {
          clearInterval(id);
          endMeditation(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isMeditating, timeRemaining]);

  /* ── helpers ───────────────────────────────────────────────────────── */
  const formatTime = () => {
    const m = Math.floor(timeRemaining / 60);
    const s = String(timeRemaining % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const getYoutubeId = (url: string) => {
    const m = url.match(/(?:youtu\.be\/|v\/|embed\/|watch\?v=|&v=)([^#&?]{11})/);
    return m ? m[1] : "";
  };

  /* when user picks a meditation from MeditationOptions */
  const handleSelectMeditation = (title: string, _duration: number) => {
    if (LINK_MAP[title]) {
      setSelectedMeditationTitle(title as keyof typeof LINK_MAP);
      setSelectedMeditationDuration(LINK_MAP[title].mins);
      setMeditationYoutubeLink(LINK_MAP[title].url);
    } else {
      setSelectedMeditationTitle(title as any);
      setSelectedMeditationDuration(_duration);
      setMeditationYoutubeLink("");
    }
  };

  /* text-box YouTube link change (custom videos) */
  const handleYoutubeLinkChange = (url: string) => setMeditationYoutubeLink(url);
  const handleNotesChange       = (n: string) => setMeditationNotes(n);

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
          onComplete={() => endMeditation(true)}
          onEnd={endMeditation}
          onVideoDurationChange={handleVideoDurationChange}
          formatTimeRemaining={formatTime}
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
