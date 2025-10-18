import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, iconColorClass }) => {
  return (
    <Card className="bg-card border-none shadow-lg transition-shadow hover:shadow-xl">
      <CardContent className="flex items-center p-4 space-x-4">
        <div className={cn("p-3 rounded-lg", iconColorClass)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;