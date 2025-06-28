
import { useRef, useEffect } from 'react';
import { MessageSquare, Send, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSound } from '@/components/SoundContext';
import { useAuth } from '@/context/AuthContext';
import { useUserContext } from '@/hooks/useUserContext';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  session_id?: string;
  created_at?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
  input: string;
  setInput: (input: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatMessages = ({ 
  messages, 
  loading, 
  input, 
  setInput, 
  onSendMessage,
  messagesEndRef 
}: ChatMessagesProps) => {
  const { currentAmbientSound } = useSound();
  const { user } = useAuth();
  const { userContext } = useUserContext();
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, messagesEndRef]);
  
  // Get ambient sound display name
  const getAmbientSoundName = () => {
    if (!currentAmbientSound) return null;
    
    const soundNames: Record<string, string> = {
      rain: 'Rain',
      ocean: 'Ocean',
      forest: 'Forest',
      fireplace: 'Fireplace'
    };
    
    return soundNames[currentAmbientSound] || currentAmbientSound;
  };

  // Get context header for AI messages
  const getContextHeader = () => {
    if (!userContext) return '💙 Mental Health Support';
    
    const mood = userContext.settings.mood;
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
    
    const emoji = moodEmojis[mood] || '💙';
    const moodText = mood !== 'neutral' ? ` Patient is feeling ${mood}` : '';
    
    return `${emoji} Mental Health Support${moodText}`;
  };
  
  return (
    <div className="flex-1 flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="h-12 w-12 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Mental Health Support Chat</h3>
            <p className="text-muted-foreground max-w-sm mb-4">
              Welcome to your personalized safe space. Share your thoughts and feelings - I'm here to listen and support you with understanding of your unique journey.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg text-sm max-w-md mb-4">
              <h4 className="font-semibold mb-2">🔒 Your Privacy & Personalization</h4>
              <p className="text-muted-foreground mb-2">
                This is your supportive conversation space. I understand your preferences and can adapt to your communication style.
              </p>
              {userContext && (
                <div className="text-xs space-y-1 mt-2 p-2 bg-white/50 dark:bg-black/20 rounded">
                  <p><strong>Current Mood:</strong> {userContext.settings.mood}</p>
                  <p><strong>Communication Style:</strong> {userContext.settings.communicationStyle}</p>
                  {userContext.settings.therapyGoals.length > 0 && (
                    <p><strong>Focus Areas:</strong> {userContext.settings.therapyGoals.join(', ')}</p>
                  )}
                </div>
              )}
            </div>
            
            {currentAmbientSound && (
              <div className="mt-6 p-3 bg-primary/10 rounded-lg text-center max-w-sm">
                <p className="text-sm">
                  <span className="font-semibold">{getAmbientSoundName()} Ambience:</span> Notice how the background atmosphere can help create a calming environment
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id || index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted border-l-4 border-l-blue-500'
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
                      Remember: This is personalized supportive guidance, not professional therapy
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] space-y-2 bg-muted rounded-lg p-4">
                  <div className="text-xs text-muted-foreground mb-2 font-medium">
                    {getContextHeader()}
                  </div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      
      <div className="border-t p-4">
        <form onSubmit={onSendMessage} className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share your thoughts and feelings..."
            className="flex-1 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <span className="animate-spin">●</span>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-2">
          🔒 Personalized safe space powered by AI • For crisis support, contact emergency services
        </p>
      </div>
    </div>
  );
};

export default ChatMessages;
