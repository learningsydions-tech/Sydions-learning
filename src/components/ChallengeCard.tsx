import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ChallengeCardProps {
  title: string;
  description: string;
  tags: string[];
  prize: string;
  imageUrl: string;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ title, description, tags, prize, imageUrl }) => {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg flex flex-col">
      <CardHeader className="p-0">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-2">{title}</CardTitle>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
        <div>
          <p className="text-xs text-muted-foreground">Reward</p>
          <p className="font-bold text-lg text-primary">{prize}</p>
        </div>
        <Button size="sm">
          View Challenge <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChallengeCard;