import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockUsers = [
  {
    id: 1,
    name: "CyberNinja",
    avatarUrl: "/placeholder.svg",
    lastMessage: "Hey, did you see the new CTF challenge?",
    lastMessageTime: "10:40 AM",
    online: true,
  },
  {
    id: 2,
    name: "CodeWizard",
    avatarUrl: "/placeholder.svg",
    lastMessage: "I'm stuck on the last part of the algorithm.",
    lastMessageTime: "9:15 AM",
    online: false,
  },
  {
    id: 3,
    name: "PixelPerfect",
    avatarUrl: "/placeholder.svg",
    lastMessage: "Can you give me feedback on this design?",
    lastMessageTime: "Yesterday",
    online: true,
  },
];

const mockMessages = {
  1: [
    { sender: "CyberNinja", text: "Hey, did you see the new CTF challenge?", time: "10:40 AM" },
    { sender: "me", text: "Not yet, is it interesting?", time: "10:41 AM" },
    { sender: "CyberNinja", text: "Yeah, it's a tough one. Involves some advanced SQL injection.", time: "10:42 AM" },
  ],
  2: [
    { sender: "CodeWizard", text: "I'm stuck on the last part of the algorithm.", time: "9:15 AM" },
    { sender: "me", text: "Which one? Maybe I can help.", time: "9:16 AM" },
  ],
  3: [
    { sender: "PixelPerfect", text: "Can you give me feedback on this design?", time: "Yesterday" },
  ],
};

const MessagesPage = () => {
  const [selectedUser, setSelectedUser] = React.useState(mockUsers[0]);

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={30}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Chats</h2>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-10" />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                      selectedUser?.id === user.id
                        ? "bg-muted"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => setSelectedUser(user)}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      {user.online && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-background" />}
                    </Avatar>
                    <div className="flex-1 truncate">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.lastMessage}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{user.lastMessageTime}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          {selectedUser ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.name} />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.online ? "Online" : "Offline"}</p>
                </div>
              </div>
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {mockMessages[selectedUser.id].map((msg, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-end gap-3",
                        msg.sender === "me" ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.sender !== "me" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={selectedUser.avatarUrl} />
                          <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg",
                          msg.sender === "me"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
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
                  <Input placeholder="Type a message..." className="pr-12" />
                  <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select a conversation to start chatting</p>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default MessagesPage;