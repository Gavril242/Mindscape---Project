
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useChatContext } from '@/hooks/useChatContext';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { ChatMessages } from '@/components/chat/ChatMessages';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const Chat = () => {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  
  const {
    sessions,
    currentSession,
    setCurrentSession,
    messages,
    userContext,
    loading,
    sendingMessage,
    createNewChat,
    deleteChat,
    sendMessage
  } = useChatContext();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="text-muted-foreground">Please sign in to access the chat.</p>
        </div>
      </div>
    );
  }

  return (
    <ResizablePanelGroup 
      direction="horizontal" 
      className="h-screen w-full"
    >
      <ResizablePanel
        defaultSize={20}
        minSize={15}
        maxSize={30}
        collapsible
        collapsedSize={0}
        className="hidden md:block min-w-[200px]"
      >
        <ChatSidebar 
          sessions={sessions}
          currentSession={currentSession}
          onNewChat={createNewChat}
          onSelectChat={setCurrentSession}
          onDeleteChat={deleteChat}
        />
      </ResizablePanel>
      <ResizableHandle withHandle className="hidden md:flex" />
      <ResizablePanel defaultSize={80}>
        <ChatMessages 
          messages={messages}
          userContext={userContext}
          loading={loading}
          sendingMessage={sendingMessage}
          input={input}
          setInput={setInput}
          onSendMessage={sendMessage}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Chat;
