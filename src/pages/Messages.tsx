import React, { useEffect, useState } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/contexts/SessionContext";

interface Message {
  sender: "me" | "other";
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  avatarFallback: string;
  lastMessage: string;
  lastMessageTime: string;
  messages: Message[];
}

// Mock fetch function using existing profiles
const fetchConversations = async (userId: string): Promise<Conversation[]> => {
  // In a real app, this would query a 'conversations' table.
  // For now, we fetch a few random profiles to simulate conversations.
  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, avatar_url")
    .neq("id", userId)
    .limit(5); // Increased limit for better mock data

  if (error) {
    console.error("Failed to load conversations:", error);
    return [];
  }

  return (data || []).map((p, index) => {
    const name = [p.first_name, p.last_name].filter(Boolean).join(" ") || `Chat User ${index + 1}`;
    const fallback = name.slice(0, 2).toUpperCase();
    
    return {
      id: p.id,
      name: name,
      avatarFallback: fallback,
      lastMessage: index % 2 === 0 ? "Hey, ready for the challenge?" : "See you then!",
      lastMessageTime: index % 2 === 0 ? "07:45 PM" : "Yesterday",
      messages: [
        { sender: "other", text: "Hello!", time: "07:13 PM" },
        { sender: "me", text: "Hey, what's up?", time: "07:35 PM" },
        { sender: "other", text: "Just checking in.", time: "07:39 PM" },
        { sender: "me", text: index % 2 === 0 ? "Ready when you are!" : "Sounds good!", time: "07:45 PM" },
      ],
    };
  });
};

const MessagesPage = () => {
  const { session, loading: sessionLoading } = useSession();
  const userId = session?.user?.id;
  
  const { data: conversations, isLoading } = useQuery<Conversation[]>({
    queryKey: ["conversations", userId],
    queryFn: () => fetchConversations(userId!),
    enabled: !!userId && !sessionLoading,
  });

  const [selectedConversation, setSelectedConversation] = useState<Conversation | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Set initial selected conversation once data loads
  useEffect(() => {
    if (conversations && conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);
  
  const filteredConversations = conversations?.filter(convo => 
    convo.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading || sessionLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal" className="h-full rounded-none border-x">
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b space-y-4">
              <h2 className="text-2xl font-bold">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((convo) => (
                    <div
                      key={convo.id}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors",
                        selectedConversation?.id === convo.id
                          ? "bg-muted"
                          : "hover:bg-muted/50"
                      )}
                      onClick={() => setSelectedConversation(convo)}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{convo.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 truncate">
                        <p className="font-semibold">{convo.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{convo.lastMessageTime}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          {selectedConversation ? (
            <div className="flex flex-col h-full bg-background">
              <div className="p-4 border-b flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{selectedConversation.avatarFallback}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{selectedConversation.name}</h3>
              </div>
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {selectedConversation.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-end gap-3 w-full",
                        msg.sender === "me" ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.sender !== "me" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{selectedConversation.avatarFallback}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg flex flex-col",
                           msg.sender === "me" ? "bg-primary text-primary-foreground items-end" : "bg-muted items-start"
                        )}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={cn("text-xs mt-1", msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="relative">
                  <Input placeholder="Type your message..." className="pr-14" />
                  <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select a conversation</p>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default MessagesPage;