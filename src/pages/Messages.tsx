import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockConversations = [
  {
    id: 1,
    name: "karthik",
    avatarFallback: "K",
    lastMessage: "Hiii",
    lastMessageTime: "07:45 PM",
  },
  {
    id: 2,
    name: "CyberNinja",
    avatarFallback: "CN",
    lastMessage: "See you then!",
    lastMessageTime: "Yesterday",
  },
];

const mockMessages = {
  1: [
    { sender: "me", text: "Hi", time: "07:13 PM" },
    { sender: "karthik", text: "Hello", time: "07:35 PM" },
    { sender: "me", text: "Hey", time: "07:39 PM" },
    { sender: "karthik", text: "Hiii", time: "07:45 PM" },
  ],
  2: [
    { sender: "CyberNinja", text: "Let's team up for the next CTF.", time: "Yesterday" },
    { sender: "me", text: "Sounds good!", time: "Yesterday" },
    { sender: "CyberNinja", text: "See you then!", time: "Yesterday" },
  ],
};

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = React.useState(mockConversations[0]);

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal" className="h-full rounded-none border-x">
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="text-2xl font-bold">Messages</h2>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {mockConversations.map((convo) => (
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
                ))}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70}>
          {selectedConversation ? (
            <div className="flex flex-col h-full bg-background">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {mockMessages[selectedConversation.id].map((msg, index) => (
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