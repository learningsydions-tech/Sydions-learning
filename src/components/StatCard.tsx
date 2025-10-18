import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColorClass?: string;
}

const StatCard = ({ title, value, icon: Icon, iconColorClass }: StatCardProps) => {
  // Default to a colorful gradient if no icon color class is provided
  const defaultIconClass = "bg-gradient-primary text-white";
  
  return (
    // Updated card with colorful enhancements
    <Card className="bg-card border-none shadow-lg transition-all duration-300 hover:shadow-xl card-colorful">
      <CardContent className="flex items-center p-4 space-x-4">
        {/* Enhanced icon container with gradient background */}
        <div className={cn("p-3 rounded-lg", iconColorClass || defaultIconClass)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {value}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;