import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight } from "lucide-react";

interface GuildCardProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  imageUrl: string;
  tags: string[];
}

const GuildCard: React.FC<GuildCardProps> = ({ id, name, description, memberCount, imageUrl, tags }) => {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg flex flex-col">
      <CardHeader className="p-0">
        <img src={imageUrl} alt={name} className="w-full h-40 object-cover" />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-2">{name}</CardTitle>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="w-4 h-4 mr-2" />
          <span>{memberCount} members</span>
        </div>
        <Button size="sm" variant="outline" asChild>
          <Link to={`/guilds/${id}`}>
            View Guild <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GuildCard;