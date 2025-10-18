import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";

interface ChallengeDetail {
  id: string;
  title: string;
  description: string | null;
  type: string;
  difficulty: string;
  max_points: number;
  deadline: string | null;
  status: string;
}

const fetchChallengeDetail = async (challengeId: string): Promise<ChallengeDetail> => {
  const { data, error } = await supabase
    .from("challenges")
    .select("id, title, description, type, difficulty, max_points, deadline, status")
    .eq("id", challengeId)
    .single();

  if (error) {
    throw error;
  }

  return data as ChallengeDetail;
};

const EditChallengePage = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: initialChallenge, isLoading: isFetching, error: fetchError } = useQuery<ChallengeDetail>({
    queryKey: ["challengeDetail", challengeId],
    queryFn: () => fetchChallengeDetail(challengeId!),
    enabled: !!challengeId,
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("solo");
  const [difficulty, setDifficulty] = useState("beginner");
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [maxPoints, setMaxPoints] = useState(100);
  const [status, setStatus] = useState("draft");

  // Effect to populate state when data is fetched
  useEffect(() => {
    if (initialChallenge) {
      setTitle(initialChallenge.title);
      setDescription(initialChallenge.description || "");
      setType(initialChallenge.type);
      setDifficulty(initialChallenge.difficulty);
      setMaxPoints(initialChallenge.max_points);
      setStatus(initialChallenge.status);
      if (initialChallenge.deadline) {
        setDeadline(new Date(initialChallenge.deadline));
      }
    }
  }, [initialChallenge]);

  const updateChallengeMutation = useMutation({
    mutationFn: async () => {
      if (!challengeId) throw new Error("Challenge ID missing.");
      if (!title.trim()) throw new Error("Challenge title is required.");
      if (maxPoints <= 0) throw new Error("Max points must be positive.");

      const { error } = await supabase
        .from("challenges")
        .update({
          title: title.trim(),
          description: description.trim() || null,
          type: type,
          difficulty: difficulty,
          deadline: deadline ? deadline.toISOString() : null,
          max_points: maxPoints,
          status: status,
          // created_by and created_at are immutable
        })
        .eq("id", challengeId);

      if (error) throw error;
    },
    onSuccess: () => {
      showSuccess("Challenge updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["adminChallenges"] });
      queryClient.invalidateQueries({ queryKey: ["activeChallenges"] });
      queryClient.invalidateQueries({ queryKey: ["challengeDetail", challengeId] });
      navigate("/admin/challenges");
    },
    onError: (error) => {
      console.error("Challenge update failed:", error);
      showError(`Failed to update challenge: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateChallengeMutation.mutate();
  };

  const isPending = updateChallengeMutation.isPending;

  if (isFetching) {
    return (
      <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        Loading challenge data...
      </div>
    );
  }

  if (fetchError) {
    return <div className="text-center py-12 text-destructive">Error loading challenge: {fetchError.message}</div>;
  }
  
  if (!initialChallenge) {
    return <div className="text-center py-12 text-muted-foreground">Challenge not found.</div>;
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Edit Challenge: {initialChallenge.title}</h1>
        <p className="text-muted-foreground mt-1">
          Modify the details of this existing challenge.
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
                    value={type} 
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
                    value={difficulty} 
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={status} 
                    onValueChange={setStatus}
                    disabled={isPending}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label htmlFor="points">Max Points</Label>
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
                <div className="space-y-2 md:col-span-1">
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
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-6">
            <Button variant="outline" asChild disabled={isPending}>
              <Link to="/admin/challenges">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditChallengePage;