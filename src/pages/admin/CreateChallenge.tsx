import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { useSession } from "@/contexts/SessionContext";

const CreateChallengePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("solo");
  const [difficulty, setDifficulty] = useState("beginner");
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [maxPoints, setMaxPoints] = useState(100);
  const [participationRewardCoins, setParticipationRewardCoins] = useState(0);
  const [completionRewardCoins, setCompletionRewardCoins] = useState(0);

  const createChallengeMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user.id) throw new Error("User not authenticated.");
      if (!title.trim()) throw new Error("Challenge title is required.");
      if (maxPoints <= 0) throw new Error("Max points must be positive.");
      if (participationRewardCoins < 0) throw new Error("Participation reward cannot be negative.");
      if (completionRewardCoins < 0) throw new Error("Completion reward cannot be negative.");

      const { data, error } = await supabase
        .from("challenges")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          type: type,
          difficulty: difficulty,
          deadline: deadline ? deadline.toISOString() : null,
          max_points: maxPoints,
          participation_reward_coins: participationRewardCoins,
          completion_reward_coins: completionRewardCoins,
          created_by: session.user.id,
          status: 'draft', // Default status for new challenges
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      showSuccess("Challenge created successfully as a draft!");
      queryClient.invalidateQueries({ queryKey: ["adminChallenges"] });
      navigate("/admin/challenges");
    },
    onError: (error) => {
      console.error("Challenge creation failed:", error);
      showError(`Failed to create challenge: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createChallengeMutation.mutate();
  };

  const isPending = createChallengeMutation.isPending;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create New Challenge</h1>
        <p className="text-muted-foreground mt-1">
          Create a new global challenge for the community.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Challenge Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. React Masters" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your challenge requirements..."
                  className="min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isPending}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="type">Challenge Type</Label>
                  <Select 
                    defaultValue={type} 
                    onValueChange={setType}
                    disabled={isPending}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo</SelectItem>
                      <SelectItem value="guild">Guild</SelectItem>
                      <SelectItem value="tag-team">Tag-Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select 
                    defaultValue={difficulty} 
                    onValueChange={setDifficulty}
                    disabled={isPending}
                  >
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild disabled={isPending}>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deadline && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? format(deadline, "PPP") : <span>dd-mm-yyyy --:--</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deadline}
                        onSelect={setDeadline}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="points">Max Points (XP)</Label>
                  <Input 
                    id="points" 
                    type="number" 
                    placeholder="100" 
                    value={maxPoints}
                    onChange={(e) => setMaxPoints(parseInt(e.target.value) || 0)}
                    required
                    min={1}
                    disabled={isPending}
                  />
                </div>
              </div>
              
              {/* New Reward Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="participation-reward">Participation Reward (Coins)</Label>
                  <Input 
                    id="participation-reward" 
                    type="number" 
                    placeholder="0" 
                    value={participationRewardCoins}
                    onChange={(e) => setParticipationRewardCoins(parseInt(e.target.value) || 0)}
                    min={0}
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="completion-reward">Completion Reward (Coins)</Label>
                  <Input 
                    id="completion-reward" 
                    type="number" 
                    placeholder="0" 
                    value={completionRewardCoins}
                    onChange={(e) => setCompletionRewardCoins(parseInt(e.target.value) || 0)}
                    min={0}
                    disabled={isPending}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-6">
            <Button variant="outline" asChild disabled={isPending}>
              <Link to="/admin/challenges">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Challenge"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateChallengePage;