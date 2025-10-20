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
  const defaultIconClass = "bg-primary/20 text-primary";
  
  return (
    <Card className="bg-card border-0 shadow-none">
      <CardContent className="flex items-center p-4 space-x-4">
        <div className={cn("p-3 rounded-lg", iconColorClass || defaultIconClass)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;