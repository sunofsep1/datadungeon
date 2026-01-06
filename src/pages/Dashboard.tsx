import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/stat-card";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, Megaphone, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  { label: "Total Contacts", value: 156, change: "+12%", positive: true },
  { label: "Active Deals", value: 23, change: "+5%", positive: true },
  { label: "Campaigns", value: 8, change: "-2%", positive: false },
  { label: "Appointments", value: 12, change: "+8%", positive: true },
];

const recentActivity = [
  { type: "contact", message: "New contact added: John Smith", time: "2 hours ago" },
  { type: "deal", message: "Deal moved to Qualified: Property Sale", time: "3 hours ago" },
  { type: "campaign", message: "Campaign started: Q1 Outreach", time: "5 hours ago" },
  { type: "appointment", message: "Meeting scheduled with Sarah Johnson", time: "1 day ago" },
];

export default function Dashboard() {
  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Dashboard" 
        description="Welcome back! Here's an overview of your CRM."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.positive ? 'text-success' : 'text-destructive'}`}>
                {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Add Contact</span>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="text-sm font-medium">New Deal</span>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
              <Megaphone className="w-5 h-5 text-warning" />
              <span className="text-sm font-medium">Start Campaign</span>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
              <Calendar className="w-5 h-5 text-info" />
              <span className="text-sm font-medium">Schedule</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
