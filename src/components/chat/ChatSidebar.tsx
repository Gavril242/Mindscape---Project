import { useState } from 'react';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSession: string | null;
  onNewChat: () => void;
  onSelectChat: (sessionId: string) => void;
  onDeleteChat: (sessionId: string) => void;
}

const ChatSidebar = ({ 
  sessions, 
  currentSession, 
  onNewChat, 
  onSelectChat, 
  onDeleteChat 
}: ChatSidebarProps) => {
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);

  const handleDeleteClick = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteSessionId(sessionId);
  };

  const confirmDelete = () => {
    if (deleteSessionId) {
      onDeleteChat(deleteSessionId);
      setDeleteSessionId(null);
    }
  };

  return (
    <div className="flex flex-col border-r p-4 h-full w-full bg-background overflow-y-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Chats</h2>
        <Button onClick={onNewChat} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" /> New
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {sessions.length === 0 ? (
          <p className="text-muted-foreground text-sm p-2">No chats yet. Start a new conversation!</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted ${
                  currentSession === session.id ? 'bg-muted' : ''
                }`}
                onClick={() => onSelectChat(session.id)}
              >
                <div className="flex items-center space-x-2 overflow-hidden flex-1">
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="text-sm truncate">{session.title}</span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100 shrink-0"
                      onClick={(e) => handleDeleteClick(session.id, e)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this conversation? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
