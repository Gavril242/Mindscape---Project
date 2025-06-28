
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MeditationSessionItem from "@/components/MeditationSessionItem";

interface MeditationSession {
  id: string;
  session_type: string;
  duration: number;
  youtube_link?: string;
  notes?: string;
  created_at: string;
}

interface MeditationSessionHistoryProps {
  sessions: MeditationSession[];
  isLoading: boolean;
}

const MeditationSessionHistory: React.FC<MeditationSessionHistoryProps> = ({ 
  sessions, 
  isLoading 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sessions</CardTitle>
        <CardDescription>Your meditation journey</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse">Loading sessions...</div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No meditation sessions yet. Start your first session above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(session => (
              <MeditationSessionItem 
                key={session.id}
                title={session.session_type}
                duration={session.duration}
                date={session.created_at}
                youtubeLink={session.youtube_link}
                notes={session.notes}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeditationSessionHistory;
