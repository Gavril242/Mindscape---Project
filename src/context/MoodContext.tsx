
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useTheme } from "@/components/theme-provider";

type Mood = "neutral" | "happy" | "sad" | "angry";

type MoodContextType = {
  mood: Mood;
  loading: boolean;
  setMood: (mood: Mood) => Promise<void>;
};

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [mood, setMoodState] = useState<Mood>("neutral");
  const [loading, setLoading] = useState(true);
  const { theme, setColorTheme } = useTheme();

  // Fetch the user's mood from Supabase
  const fetchMood = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_settings")
        .select("mood")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      if (data && data.mood) {
        setMoodState(data.mood as Mood);
        applyMoodTheme(data.mood as Mood);
      }
    } catch (error) {
      console.error("Error fetching mood:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply the appropriate color theme based on mood
  const applyMoodTheme = (currentMood: Mood) => {
    switch (currentMood) {
      case "happy":
        setColorTheme("green");
        break;
      case "sad":
        setColorTheme("blue"); // Using blue for sad
        break;
      case "angry":
        setColorTheme("orange"); // Using orange/red for angry
        break;
      case "neutral":
      default:
        setColorTheme("green"); // Default is green
        break;
    }
  };

  // Update the user's mood in Supabase
  const setMood = async (newMood: Mood) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("user_settings")
        .update({ mood: newMood })
        .eq("user_id", user.id);

      if (error) throw error;

      setMoodState(newMood);
      applyMoodTheme(newMood);
      toast(`Mood updated to ${newMood}`);
    } catch (error) {
      console.error("Error updating mood:", error);
      toast("Failed to update mood");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMood();
  }, [user]);

  return (
    <MoodContext.Provider value={{ mood, loading, setMood }}>
      {children}
    </MoodContext.Provider>
  );
}

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error("useMood must be used within a MoodProvider");
  }
  return context;
};
