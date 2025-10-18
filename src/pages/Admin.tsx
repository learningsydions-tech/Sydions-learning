import React from "react";
import { Users, ClipboardList, DollarSign, Activity } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminPage = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,257",
      icon: Users,
      color: "bg-blue-600",
    },
    {
      title: "Active Challenges",
      value: "23",
      icon: Activity,
      color: "bg-green-600",
    },
    {
      title: "Total Submissions",
      value: "5,890",
      icon: ClipboardList,
      color: "bg-indigo-600",
    },
    {
      title: "Total Revenue",
      value: "$12,450",
      icon: DollarSign,
      color: "bg-amber-600",
    },
  ];

  const recentActivities = [
    { user: "CyberNinja", action: "Submitted to 'SQL Injection'", time: "5m ago" },
    { user: "CodeWizard", action: "Joined 'Code Wizards' guild", time: "1h ago" },
    { user: "PixelPerfect", action: "Purchased 'Cyber Samurai Frame'", time: "3h ago" },
    { user: "DataDynamo", action: "Created new challenge 'Data Hackathon'", time: "8h ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">
          Overview of platform activity and management tools.
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconColorClass={stat.color}
          />
        ))}
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>A log of recent user activities on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{activity.user}</TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{activity.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;