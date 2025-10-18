import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import ChallengeCard from "@/components/ChallengeCard";

const mockChallenges = [
  {
    title: "Secure Authentication System",
    description: "Design and implement a secure authentication system for a web application, including password hashing and session management.",
    tags: ["Security", "Web", "Backend"],
    prize: "$1,200",
    imageUrl: "/placeholder.svg",
  },
  {
    title: "E-commerce UI/UX Redesign",
    description: "Redesign the user interface and experience for an e-commerce platform to improve conversion rates and user satisfaction.",
    tags: ["Design", "UI/UX", "Frontend"],
    prize: "$2,500",
    imageUrl: "/placeholder.svg",
  },
  {
    title: "Real-time Chat Application",
    description: "Build a real-time chat application using WebSockets, allowing users to communicate instantly in public or private channels.",
    tags: ["Development", "WebSockets", "Fullstack"],
    prize: "$1,800",
    imageUrl: "/placeholder.svg",
  },
  {
    title: "Cloud Infrastructure Automation",
    description: "Automate the deployment and management of cloud infrastructure using tools like Terraform and Ansible.",
    tags: ["DevOps", "Cloud", "Automation"],
    prize: "$3,000",
    imageUrl: "/placeholder.svg",
  },
  {
    title: "Mobile App Performance Optimization",
    description: "Identify and resolve performance bottlenecks in a native mobile application to improve load times and responsiveness.",
    tags: ["Mobile", "Performance", "Optimization"],
    prize: "$1,500",
    imageUrl: "/placeholder.svg",
  },
  {
    title: "Data Visualization Dashboard",
    description: "Create an interactive data visualization dashboard to display complex datasets in an intuitive and insightful manner.",
    tags: ["Data", "Visualization", "Frontend"],
    prize: "$2,000",
    imageUrl: "/placeholder.svg",
  },
];

const filterCategories = ["All", "Security", "Development", "Design", "Data", "Mobile"];

const ExplorePage = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Explore Challenges</h1>
        <p className="text-muted-foreground mt-1">
          Find exciting challenges to test your skills and earn rewards.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search challenges..."
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {filterCategories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge.title}
            title={challenge.title}
            description={challenge.description}
            tags={challenge.tags}
            prize={challenge.prize}
            imageUrl={challenge.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;