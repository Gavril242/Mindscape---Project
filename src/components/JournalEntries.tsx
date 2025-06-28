
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";

type JournalEntry = {
  id: string;
  title: string;
  content: string;
  mood: string | null;
  created_at: string;
};

type JournalEntriesProps = {
  refresh: number;
};

const JournalEntries = ({ refresh }: JournalEntriesProps) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      
      setLoading(false);
      
      if (error) {
        toast({
          title: "Error loading entries",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setEntries(data as JournalEntry[]);
      }
    };
    
    fetchEntries();
  }, [user, toast, refresh]);

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Previous Entries</CardTitle>
          <CardDescription>Loading your journal entries...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="animate-pulse">Loading entries...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previous Entries</CardTitle>
        <CardDescription>Your recent journal entries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No journal entries yet. Start writing to see them here.
            </p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="border-l-4 border-primary pl-4 py-2">
                <div className="flex justify-between">
                  <h4 className="font-medium">{entry.title}</h4>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(entry.created_at)}
                    </span>
                    {entry.mood && (
                      <span className="text-xs mt-1 bg-muted px-2 py-0.5 rounded-full">
                        {entry.mood}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {entry.content}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">View All Entries</Button>
      </CardFooter>
    </Card>
  );
};

export default JournalEntries;
