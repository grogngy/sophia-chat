"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChatState } from "@/contexts/ChatStateContext";

export function ChatHeader() {
  const router = useRouter();
  const { messages } = useChatState();

  const handleNewConversation = () => {
    // Navigate to /chat with new parameter to force a new conversation
    router.push("/chat?new=true");
  };

  // Only show the header if there are messages (active conversation)
  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-14 lg:top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="w-full max-w-4xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Chat con Sophia</h1>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleNewConversation}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Chat
          </Button>
        </div>
      </div>
    </div>
  );
}