
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type JournalEntryProps = {
  onEntryCreated: () => void;
};

const moods = [
  { value: "happy", label: "Happy" },
  { value: "calm", label: "Calm" },
  { value: "productive", label: "Productive" },
  { value: "stressed", label: "Stressed" },
  { value: "sad", label: "Sad" },
  { value: "anxious", label: "Anxious" },
  { value: "energetic", label: "Energetic" },
  { value: "tired", label: "Tired" }
];

const JournalEntry = ({ onEntryCreated }: JournalEntryProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleClear = () => {
    setTitle("");
    setContent("");
    setMood(undefined);
  };

  const handleSaveEntry = async () => {
    if (!title) {
      toast({
        title: "Entry needs a title",
        description: "Please provide a title for your journal entry",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from("journal_entries")
      .insert({
        user_id: user!.id,
        title,
        content,
        mood,
      });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error saving journal entry",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Journal entry saved",
        description: "Your thoughts have been recorded",
      });
      handleClear();
      onEntryCreated();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal Entry</CardTitle>
        <CardDescription>Write freely about your thoughts and feelings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="entry-title">Title</Label>
          <Input
            id="entry-title"
            placeholder="Give your entry a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="entry-content">Content</Label>
          <Textarea
            id="entry-content"
            placeholder="What's on your mind today?"
            className="min-h-[200px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mood">Current Mood</Label>
          <Select value={mood} onValueChange={setMood}>
            <SelectTrigger>
              <SelectValue placeholder="How are you feeling?" />
            </SelectTrigger>
            <SelectContent>
              {moods.map((moodOption) => (
                <SelectItem key={moodOption.value} value={moodOption.value}>
                  {moodOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={handleClear}>Clear</Button>
        <Button onClick={handleSaveEntry} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Entry"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JournalEntry;
