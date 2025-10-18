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
  // Default to a professional blue if no icon color class is provided
  const defaultIconClass = "bg-blue-100 text-blue-600";
  
  return (
    <Card className="bg-card border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="flex items-center p-4 space-x-4">
        <div className={cn("p-3 rounded-lg", iconColorClass || defaultIconClass)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;