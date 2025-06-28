
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import JournalEntry from "@/components/JournalEntry";
import JournalEntries from "@/components/JournalEntries";

interface JournalTabProps {
  refreshCounter: number;
  onEntryCreated: () => void;
}

const JournalTab: React.FC<JournalTabProps> = ({ refreshCounter, onEntryCreated }) => {
  return (
    <div className="space-y-4">
      <JournalEntry onEntryCreated={onEntryCreated} />
      <JournalEntries refresh={refreshCounter} />
      
      {/* AI Companion */}
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="flex-1">
            <CardTitle>AI Companion</CardTitle>
            <CardDescription>Get mindfulness suggestions from your AI companion</CardDescription>
          </div>
          <Heart className="h-6 w-6 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded-lg p-4 border">
            <p className="italic">
              "Based on your journal entries, you might benefit from a short breathing 
              exercise followed by the 'Stress Relief' meditation. Would you like me to 
              queue these up for you?"
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Not Now</Button>
          <Button>Yes, Please</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default JournalTab;
