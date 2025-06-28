import { useRef, useEffect } from 'react';
import { Bot, User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface UserContext {
  name: string;
  mood: string;
  lastActivity: string;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
  userContext: UserContext | null;
  loading: boolean;
  sendingMessage: boolean;
  input: string;
  setInput: (value: string) => void;
  onSendMessage: (content: string) => void;
}

export const ChatMessages = ({
  messages,
  userContext,
  loading,
  sendingMessage,
  input,
  setInput,
  onSendMessage
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sendingMessage]);

  const handleSendMessage = () => {
    if (input.trim() && !sendingMessage) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      angry: '😠',
      excited: '🤗',
      calm: '😌',
      stressed: '😓',
      neutral: '💙'
    };
    return moodEmojis[mood] || '💙';
  };

  const getContextHeader = () => {
    if (!userContext) return '💙 Mental Health Support';
    
    const emoji = getMoodEmoji(userContext.mood);
    const moodText = userContext.mood !== 'neutral' 
      ? ` • ${userContext.name} is feeling ${userContext.mood}` 
      : ` • ${userContext.name}`;
    
    return `${emoji} Mental Health Support${moodText}`;
  };

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-hidden">
      {/* Messages area - scrollable */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <div className="bg-primary/10 p-6 rounded-full">
                  <Bot className="h-12 w-12 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{getContextHeader()}</h3>
                  <p className="text-muted-foreground max-w-md">
                    Welcome to your personalized mental health support space. I'm here to listen, 
                    understand, and provide guidance based on your unique journey.
                  </p>
                </div>
                
                {userContext && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg text-sm max-w-md">
                    <h4 className="font-semibold mb-2">🔒 Your Personal Context</h4>
                    <div className="space-y-1 text-muted-foreground">
                      <p><strong>Current Mood:</strong> {userContext.mood}</p>
                      <p><strong>Last Activity:</strong> {userContext.lastActivity}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground ml-12'
                          : 'bg-muted border-l-4 border-l-primary mr-12'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="text-xs text-muted-foreground mb-2 font-medium">
                          {getContextHeader()}
                        </div>
                      )}
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.role === 'assistant' && (
                        <div className="text-xs text-muted-foreground mt-2 opacity-75">
                          Remember: This is supportive guidance, not professional therapy
                        </div>
                      )}
                    </div>

                    {message.role === 'user' && (
                      <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                ))}

                {sendingMessage && (
                  <div className="flex gap-3 justify-start">
                    <div className="bg-primary/10 p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="max-w-[80%] bg-muted border-l-4 border-l-primary rounded-lg p-4 mr-12">
                      <div className="text-xs text-muted-foreground mb-2 font-medium">
                        {getContextHeader()}
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input area - fixed at bottom */}
      <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2 items-start">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share your thoughts and feelings..."
            className="flex-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary resize-y min-h-[40px] max-h-40"
            disabled={sendingMessage}
            rows={1}
          />
          <Button 
            type="submit" 
            disabled={sendingMessage || !input.trim()}
            size="icon"
          >
            {sendingMessage ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          🔒 Your personalized support space • For emergencies, contact professional services
        </p>
      </div>
    </div>
  );
};
