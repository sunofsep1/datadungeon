import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, TrendingUp, Megaphone, Calendar, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const recentActivity = [
  { type: "contact", message: "New contact added: John Smith", time: "2 hours ago" },
  { type: "deal", message: "Deal moved to Qualified: Property Sale", time: "3 hours ago" },
  { type: "campaign", message: "Campaign started: Q1 Outreach", time: "5 hours ago" },
  { type: "appointment", message: "Meeting scheduled with Sarah Johnson", time: "1 day ago" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Modal states
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [dealDialogOpen, setDealDialogOpen] = useState(false);
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  
  // Form states
  const [newContact, setNewContact] = useState({ name: "", email: "", phone: "" });
  const [newDeal, setNewDeal] = useState({ title: "", value: "", stage: "prospect" });
  const [newCampaign, setNewCampaign] = useState({ name: "", type: "email", description: "" });
  const [newAppointment, setNewAppointment] = useState({ title: "", date: "", time: "", location: "" });

  // Dynamic stats (in real app, these would come from a shared state/database)
  const stats = [
    { label: "Total Contacts", value: 6, change: "+12%", positive: true },
    { label: "Active Deals", value: 0, change: "0%", positive: true },
    { label: "Campaigns", value: 0, change: "0%", positive: true },
    { label: "Appointments", value: 0, change: "0%", positive: true },
  ];

  const handleAddContact = () => {
    if (!newContact.name.trim()) {
      toast({ title: "Error", description: "Please enter a contact name", variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: "Contact added! View in Contacts page." });
    setNewContact({ name: "", email: "", phone: "" });
    setContactDialogOpen(false);
    navigate("/contacts");
  };

  const handleAddDeal = () => {
    if (!newDeal.title.trim()) {
      toast({ title: "Error", description: "Please enter a deal title", variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: "Deal added! View in Pipeline." });
    setNewDeal({ title: "", value: "", stage: "prospect" });
    setDealDialogOpen(false);
    navigate("/pipeline");
  };

  const handleStartCampaign = () => {
    if (!newCampaign.name.trim()) {
      toast({ title: "Error", description: "Please enter a campaign name", variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: "Campaign started! View in Campaigns." });
    setNewCampaign({ name: "", type: "email", description: "" });
    setCampaignDialogOpen(false);
    navigate("/campaigns");
  };

  const handleScheduleAppointment = () => {
    if (!newAppointment.title.trim()) {
      toast({ title: "Error", description: "Please enter appointment title", variant: "destructive" });
      return;
    }
    if (!newAppointment.date) {
      toast({ title: "Error", description: "Please select a date", variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: "Appointment scheduled!" });
    setNewAppointment({ title: "", date: "", time: "", location: "" });
    setAppointmentDialogOpen(false);
    navigate("/appointments");
  };

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
            <button 
              onClick={() => setContactDialogOpen(true)}
              className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Add Contact</span>
            </button>
            <button 
              onClick={() => setDealDialogOpen(true)}
              className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="text-sm font-medium">New Deal</span>
            </button>
            <button 
              onClick={() => setCampaignDialogOpen(true)}
              className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Megaphone className="w-5 h-5 text-warning" />
              <span className="text-sm font-medium">Start Campaign</span>
            </button>
            <button 
              onClick={() => setAppointmentDialogOpen(true)}
              className="flex items-center gap-3 p-4 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
            >
              <Calendar className="w-5 h-5 text-info" />
              <span className="text-sm font-medium">Schedule</span>
            </button>
          </div>
        </Card>
      </div>

      {/* Add Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-popover border-border">
          <DialogHeader>
            <DialogTitle>Quick Add Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input 
                placeholder="Contact name" 
                className="bg-input"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                placeholder="email@example.com" 
                className="bg-input"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input 
                placeholder="0400 000 000" 
                className="bg-input"
                value={newContact.phone}
                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setContactDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddContact}>Add Contact</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Deal Dialog */}
      <Dialog open={dealDialogOpen} onOpenChange={setDealDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-popover border-border">
          <DialogHeader>
            <DialogTitle>New Deal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Deal Title *</Label>
              <Input 
                placeholder="Deal title" 
                className="bg-input"
                value={newDeal.title}
                onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input 
                type="number" 
                placeholder="0" 
                className="bg-input"
                value={newDeal.value}
                onChange={(e) => setNewDeal({ ...newDeal, value: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Stage</Label>
              <Select 
                value={newDeal.stage}
                onValueChange={(value) => setNewDeal({ ...newDeal, stage: value })}
              >
                <SelectTrigger className="bg-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="under-offer">Under Offer</SelectItem>
                  <SelectItem value="due-diligence">Due Diligence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setDealDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDeal}>Add Deal</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Start Campaign Dialog */}
      <Dialog open={campaignDialogOpen} onOpenChange={setCampaignDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-popover border-border">
          <DialogHeader>
            <DialogTitle>Start Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Campaign Name *</Label>
              <Input 
                placeholder="Campaign name" 
                className="bg-input"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select 
                value={newCampaign.type}
                onValueChange={(value) => setNewCampaign({ ...newCampaign, type: value })}
              >
                <SelectTrigger className="bg-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                placeholder="Campaign description..." 
                className="bg-input min-h-[80px]"
                value={newCampaign.description}
                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setCampaignDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleStartCampaign}>Start Campaign</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Appointment Dialog */}
      <Dialog open={appointmentDialogOpen} onOpenChange={setAppointmentDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-popover border-border">
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input 
                placeholder="Appointment title" 
                className="bg-input"
                value={newAppointment.title}
                onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input 
                  type="date" 
                  className="bg-input"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input 
                  type="time" 
                  className="bg-input"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input 
                placeholder="Meeting location" 
                className="bg-input"
                value={newAppointment.location}
                onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setAppointmentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleScheduleAppointment}>Schedule</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
