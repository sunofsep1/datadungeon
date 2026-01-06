import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { AvatarCircle } from "@/components/ui/avatar-circle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Download, Calendar, DollarSign, Users, Eye, Pencil, Trash2 } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  status: "planning" | "active" | "completed" | "cancelled";
  type: "outreach" | "nurture" | "retention";
  startDate: string;
  budget: number;
  contacts: number;
}

const mockCampaigns: Campaign[] = [
  { id: "1", name: "Ask me any real estate question???", status: "planning", type: "outreach", startDate: "2026-02-09", budget: 5500, contacts: 100 },
  { id: "2", name: "Cash Giveaway", status: "planning", type: "outreach", startDate: "2026-01-18", budget: 3000, contacts: 200 },
];

export default function Campaigns() {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const stats = {
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === "active").length,
    planning: campaigns.filter((c) => c.status === "planning").length,
    completed: campaigns.filter((c) => c.status === "completed").length,
    cancelled: campaigns.filter((c) => c.status === "cancelled").length,
  };

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Campaign"
        description="Manage and track all your campaigns"
        actions={
          <div className="flex gap-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-popover border-border max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Campaign</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="overview" className="mt-4">
                  <TabsList className="grid grid-cols-2 bg-muted">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="timeline">4-Week Timeline</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Campaign Title *</Label>
                      <Input placeholder="Enter campaign title" className="bg-input" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea placeholder="Describe your campaign..." className="bg-input" />
                    </div>
                    <div className="p-4 bg-card rounded-lg border border-border space-y-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-destructive" />
                        <Label className="text-sm font-medium">Targets</Label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Contacts</Label>
                          <Input type="number" defaultValue="100" className="bg-input" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Conversions</Label>
                          <Input type="number" defaultValue="25" className="bg-input" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-card rounded-lg border border-border space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-info" />
                        <Label className="text-sm font-medium">Timeline</Label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Start Date</Label>
                          <Input type="date" className="bg-input" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">End Date</Label>
                          <Input type="date" className="bg-input" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Duration (days)</Label>
                        <Input type="number" defaultValue="14" className="bg-input" />
                      </div>
                    </div>
                    <div className="p-4 bg-card rounded-lg border border-border space-y-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-warning" />
                        <Label className="text-sm font-medium">Budget</Label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Total Budget</Label>
                          <Input type="number" placeholder="0" className="bg-input" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Budget Type</Label>
                          <Select defaultValue="custom">
                            <SelectTrigger className="bg-input">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="custom">Custom</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Campaign Type</Label>
                        <Select defaultValue="outreach">
                          <SelectTrigger className="bg-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="outreach">Outreach</SelectItem>
                            <SelectItem value="nurture">Nurture</SelectItem>
                            <SelectItem value="retention">Retention</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select defaultValue="planning">
                          <SelectTrigger className="bg-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="timeline" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Campaign Duration</Label>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">2 Weeks</Button>
                        <Button className="flex-1">4 Weeks</Button>
                        <Button variant="outline" className="flex-1">6 Weeks</Button>
                      </div>
                    </div>
                    {/* Week cards */}
                    {[1, 2, 3, 4].map((week) => (
                      <div key={week} className="p-4 bg-card rounded-lg border border-border space-y-3">
                        <h4 className="text-sm font-medium text-warning">Week {week}: {week === 1 ? "Launch Week" : week === 2 ? "Build Momentum" : week === 3 ? "Peak Performance" : "Close & Follow-up"}</h4>
                        <StatusBadge variant="planning">{week === 1 ? "Initial Outreach" : week === 2 ? "Volume & Consistency" : week === 3 ? "Maximum Conversions" : "Deal Closure"}</StatusBadge>
                        <div className="grid grid-cols-3 gap-3 mt-3">
                          <div className="text-center p-3 bg-secondary rounded-lg">
                            <div className="text-xl font-bold">{50 + week * 10}</div>
                            <div className="text-xs text-muted-foreground">CALLS</div>
                          </div>
                          <div className="text-center p-3 bg-secondary rounded-lg">
                            <div className="text-xl font-bold">{40 + week * 5}</div>
                            <div className="text-xs text-muted-foreground">ENTRIES</div>
                          </div>
                          <div className="text-center p-3 bg-secondary rounded-lg">
                            <div className="text-xl font-bold">{5 + week * 2}</div>
                            <div className="text-xs text-muted-foreground">LEADS</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Save Campaign</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard value={stats.total} label="Total" variant="total" />
        <StatCard value={stats.active} label="Active" variant="active" />
        <StatCard value={stats.planning} label="Planning" variant="planning" />
        <StatCard value={stats.completed} label="Completed" variant="completed" />
        <StatCard value={stats.cancelled} label="Cancelled" variant="cancelled" />
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[160px] bg-card border-border">
            <SelectValue placeholder="All Campaigns" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaigns List */}
      <div className="space-y-3">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="campaign-row">
            <div className="flex items-center gap-4 flex-1">
              <AvatarCircle name={campaign.name} size="lg" />
              <div>
                <p className="font-medium text-foreground">{campaign.name}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {campaign.startDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    ${campaign.budget.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {campaign.contacts} contacts
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <StatusBadge variant="outreach">{campaign.type.toUpperCase()}</StatusBadge>
              <StatusBadge variant={campaign.status}>{campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}</StatusBadge>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
