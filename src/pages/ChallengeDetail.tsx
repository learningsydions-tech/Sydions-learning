import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Zap, Shield, Clock } from "lucide-react";

const ChallengeDetailPage = () => {
  const { challengeId } = useParams();

  // Mock data structure for display
  const mockChallenge = {
    title: "Challenge: " + challengeId,
    description: "This is the detail page for the challenge. Here you will find instructions, submission guidelines, and discussion forums.",
    points: 500,
    difficulty: "Intermediate",
    deadline: "2024-12-31",
  };

  return (
    <div className="space-y-8">
      <Button asChild variant="outline" size="sm">
        <Link to="/challenges">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Challenges
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{mockChallenge.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2 text-primary" />
              <span>{mockChallenge.points} XP Reward</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-primary" />
              <span>Difficulty: {mockChallenge.difficulty}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              <span>Deadline: {mockChallenge.deadline}</span>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mt-4">Description</h3>
          <p className="text-muted-foreground">{mockChallenge.description}</p>

          <Button size="lg" className="w-full">Start Challenge</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChallengeDetailPage;