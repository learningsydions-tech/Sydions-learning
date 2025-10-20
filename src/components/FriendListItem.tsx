import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, UserMinus, UserPlus, UserX, XCircle } from "lucide-react";

interface FriendListItemProps {
  name: string;
  status: "Online" | "Offline";
  avatarUrl: string;
  type: "friend" | "pending" | "blocked";
}

const FriendListItem: React.FC<FriendListItemProps> = ({ name, status, avatarUrl, type }) => {
  const statusColor = status === "Online" ? "bg-green-500" : "bg-gray-400";

  const renderActions = () => {
    switch (type) {
      case "friend":
        return (
          <>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button variant="destructive" size="sm">
              <UserMinus className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </>
        );
      case "pending":
        return (
          <>
            <Button variant="default" size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Accept
            </Button>
            <Button variant="destructive" size="sm">
              <XCircle className="w-4 h-4 mr-2" />
              Decline
            </Button>
          </>
        );
      case "blocked":
        return (
          <Button variant="outline" size="sm">
            <UserX className="w-4 h-4 mr-2" />
            Unblock
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ${statusColor} border-2 border-background`} />
        </Avatar>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-muted-foreground">{status}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {renderActions()}
      </div>
    </div>
  );
};

export default FriendListItem;