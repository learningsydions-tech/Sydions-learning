import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Code, Palette, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const totalSteps = 3;

const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Finish onboarding and redirect to the dashboard
      console.log("Onboarding complete:", { username, interests, skillLevel });
      navigate("/");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Sydions!</CardTitle>
          <CardDescription>Let's get your profile set up in a few quick steps.</CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent className="min-h-[250px]">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Step 1: Choose your username</h3>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="e.g., cyber_warrior"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">This is how other users will see you.</p>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Step 2: What are your interests?</h3>
              <p className="text-sm text-muted-foreground">Select all that apply. This will help us recommend challenges for you.</p>
              <ToggleGroup
                type="multiple"
                variant="outline"
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                value={interests}
                onValueChange={(value) => setInterests(value)}
              >
                <ToggleGroupItem value="security" className="flex flex-col h-24">
                  <Shield className="w-8 h-8 mb-2" />
                  <span>Security</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="development" className="flex flex-col h-24">
                  <Code className="w-8 h-8 mb-2" />
                  <span>Development</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="design" className="flex flex-col h-24">
                  <Palette className="w-8 h-8 mb-2" />
                  <span>Design</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Step 3: What's your skill level?</h3>
              <p className="text-sm text-muted-foreground">This helps us tailor the difficulty of challenges.</p>
              <RadioGroup value={skillLevel} onValueChange={setSkillLevel} className="space-y-2">
                <Label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted/50 has-[:checked]:bg-muted has-[:checked]:border-primary">
                  <RadioGroupItem value="beginner" id="beginner" className="sr-only" />
                  <div>
                    <p className="font-semibold">Beginner</p>
                    <p className="text-sm text-muted-foreground">Just starting my journey.</p>
                  </div>
                </Label>
                <Label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted/50 has-[:checked]:bg-muted has-[:checked]:border-primary">
                  <RadioGroupItem value="intermediate" id="intermediate" className="sr-only" />
                  <div>
                    <p className="font-semibold">Intermediate</p>
                    <p className="text-sm text-muted-foreground">I have some experience and want to learn more.</p>
                  </div>
                </Label>
                <Label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-muted/50 has-[:checked]:bg-muted has-[:checked]:border-primary">
                  <RadioGroupItem value="advanced" id="advanced" className="sr-only" />
                  <div>
                    <p className="font-semibold">Advanced</p>
                    <p className="text-sm text-muted-foreground">I'm experienced and looking for a challenge.</p>
                  </div>
                </Label>
              </RadioGroup>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            Back
          </Button>
          <Button onClick={handleNext}>
            {step === totalSteps ? "Finish Setup" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OnboardingPage;