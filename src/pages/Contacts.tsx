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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Phone, Mail, MapPin, Eye, Pencil, Trash2 } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  status: "hot" | "warm" | "cold" | "entered";
  phone: string;
  email: string;
  location: string;
  lastContact: string;
  score: number;
}

const mockContacts: Contact[] = [
  { id: "1", name: "Greg Leigh", status: "hot", phone: "0466 805 992", email: "greg@example.com", location: "Thornlands", lastContact: "2026-01-02", score: 5 },
  { id: "2", name: "Sarah Johnson", status: "warm", phone: "0412 345 678", email: "sarah.j@example.com", location: "Brisbane", lastContact: "2026-01-01", score: 7 },
  { id: "3", name: "Michael Chen", status: "cold", phone: "0423 456 789", email: "m.chen@example.com", location: "Gold Coast", lastContact: "2025-12-28", score: 4 },
  { id: "4", name: "Contact Seller", status: "entered", phone: "0434 567 890", email: "seller@example.com", location: "Sydney", lastContact: "2025-12-25", score: 3 },
];

export default function Contacts() {
  const [contacts] = useState<Contact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const stats = {
    total: contacts.length,
    hot: contacts.filter((c) => c.status === "hot").length,
    warm: contacts.filter((c) => c.status === "warm").length,
    cold: contacts.filter((c) => c.status === "cold").length,
    entered: contacts.filter((c) => c.status === "entered").length,
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Contacts"
        description="Manage your contacts and leads"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-popover border-border">
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="basic" className="mt-4">
                <TabsList className="grid grid-cols-4 bg-muted">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="discovery">Discovery</TabsTrigger>
                  <TabsTrigger value="story">Story</TabsTrigger>
                  <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input placeholder="John" className="bg-input" />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input placeholder="Smith" className="bg-input" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input placeholder="0400 000 000" className="bg-input" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input placeholder="john@example.com" className="bg-input" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input placeholder="Brisbane, QLD" className="bg-input" />
                  </div>
                </TabsContent>
                <TabsContent value="pipeline" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Call Status</Label>
                    <Select>
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Follow-up Count</Label>
                      <Input type="number" placeholder="0" className="bg-input" />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Contact Date</Label>
                      <Input type="date" className="bg-input" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>Save Contact</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard value={stats.total} label="Total" variant="total" />
        <StatCard value={stats.hot} label="Hot" variant="cancelled" />
        <StatCard value={stats.warm} label="Warm" variant="planning" />
        <StatCard value={stats.cold} label="Cold" variant="active" />
        <StatCard value={stats.entered} label="Entered" variant="completed" />
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[160px] bg-card border-border">
            <SelectValue placeholder="All Segments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Segments</SelectItem>
            <SelectItem value="hot">Hot</SelectItem>
            <SelectItem value="warm">Warm</SelectItem>
            <SelectItem value="cold">Cold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contacts List */}
      <div className="space-y-3">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="contact-row">
            <AvatarCircle name={contact.name} size="lg" />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              <div>
                <p className="font-medium text-foreground">{contact.name}</p>
                <StatusBadge variant={contact.status}>{contact.status.toUpperCase()}</StatusBadge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {contact.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                {contact.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                {contact.email}
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <span className="text-2xl font-bold text-foreground">{contact.score}</span>
                <span className="text-xs">/10</span>
              </div>
            </div>
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
        ))}
      </div>
    </div>
  );
}
