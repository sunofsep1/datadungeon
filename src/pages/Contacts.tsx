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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Phone, Mail, MapPin, Eye, Printer, Trash2, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  status: "hot" | "warm" | "cold" | "entered";
  phone: string;
  email: string;
  location: string;
  suburb: string;
  propertyAddress: string;
  lastContact: string;
  score: number;
  // Discovery
  nepqQuestion1: string;
  nepqAnswer1: string;
  nepqQuestion2: string;
  nepqAnswer2: string;
  propertySituation: string;
  // Story
  callNarrative: string;
  callDuration: number;
  additionalNotes: string;
  // Pipeline
  callStatus: string;
  callbackDate: string;
  nextAction: string;
  valuationInterest: boolean;
  valuationScheduled: boolean;
  followUpCount: number;
  // Entry
  entryRequirements: boolean[];
  instagram: string;
  facebook: string;
}

const defaultEntryRequirements = [
  "Complete discovery phone call",
  "Answer both NEPQ questions honestly",
  "Provide full property address",
  "Share valid phone number",
  "Provide email address",
  "Follow on Instagram",
  "Follow on Facebook",
  "Express property situation openly",
  "Confirm contact details",
  "Agree to terms & conditions",
];

const createEmptyContact = (): Omit<Contact, 'id'> => ({
  name: "",
  status: "entered",
  phone: "",
  email: "",
  location: "",
  suburb: "",
  propertyAddress: "",
  lastContact: new Date().toISOString().split('T')[0],
  score: 5,
  nepqQuestion1: "",
  nepqAnswer1: "",
  nepqQuestion2: "",
  nepqAnswer2: "",
  propertySituation: "",
  callNarrative: "",
  callDuration: 0,
  additionalNotes: "",
  callStatus: "pending",
  callbackDate: "",
  nextAction: "",
  valuationInterest: false,
  valuationScheduled: false,
  followUpCount: 0,
  entryRequirements: Array(10).fill(false),
  instagram: "",
  facebook: "",
});

const mockContacts: Contact[] = [
  { 
    id: "1", 
    name: "Greg Leigh", 
    status: "hot", 
    phone: "0466 805 992", 
    email: "greg@example.com", 
    location: "Thornlands",
    suburb: "Thornlands",
    propertyAddress: "123 Main St",
    lastContact: "2026-01-02", 
    score: 5,
    nepqQuestion1: "",
    nepqAnswer1: "",
    nepqQuestion2: "",
    nepqAnswer2: "",
    propertySituation: "",
    callNarrative: "",
    callDuration: 0,
    additionalNotes: "",
    callStatus: "completed",
    callbackDate: "",
    nextAction: "",
    valuationInterest: true,
    valuationScheduled: false,
    followUpCount: 2,
    entryRequirements: [true, true, true, true, true, false, false, true, true, true],
    instagram: "",
    facebook: "",
  },
  { 
    id: "2", 
    name: "Sarah Johnson", 
    status: "warm", 
    phone: "0412 345 678", 
    email: "sarah.j@example.com", 
    location: "Brisbane",
    suburb: "Brisbane",
    propertyAddress: "456 Oak Ave",
    lastContact: "2026-01-01", 
    score: 7,
    nepqQuestion1: "",
    nepqAnswer1: "",
    nepqQuestion2: "",
    nepqAnswer2: "",
    propertySituation: "",
    callNarrative: "",
    callDuration: 0,
    additionalNotes: "",
    callStatus: "pending",
    callbackDate: "",
    nextAction: "",
    valuationInterest: false,
    valuationScheduled: false,
    followUpCount: 1,
    entryRequirements: Array(10).fill(false),
    instagram: "",
    facebook: "",
  },
  { 
    id: "3", 
    name: "Michael Chen", 
    status: "cold", 
    phone: "0423 456 789", 
    email: "m.chen@example.com", 
    location: "Gold Coast",
    suburb: "Gold Coast",
    propertyAddress: "789 Beach Blvd",
    lastContact: "2025-12-28", 
    score: 4,
    nepqQuestion1: "",
    nepqAnswer1: "",
    nepqQuestion2: "",
    nepqAnswer2: "",
    propertySituation: "",
    callNarrative: "",
    callDuration: 0,
    additionalNotes: "",
    callStatus: "missed",
    callbackDate: "",
    nextAction: "",
    valuationInterest: false,
    valuationScheduled: false,
    followUpCount: 0,
    entryRequirements: Array(10).fill(false),
    instagram: "",
    facebook: "",
  },
  { 
    id: "4", 
    name: "Contact Seller", 
    status: "entered", 
    phone: "0466 809 552", 
    email: "selling@selling.com", 
    location: "Thornlands",
    suburb: "Thornlands",
    propertyAddress: "321 Park St",
    lastContact: "2026-01-02", 
    score: 9,
    nepqQuestion1: "",
    nepqAnswer1: "",
    nepqQuestion2: "",
    nepqAnswer2: "",
    propertySituation: "",
    callNarrative: "",
    callDuration: 0,
    additionalNotes: "",
    callStatus: "scheduled",
    callbackDate: "",
    nextAction: "",
    valuationInterest: true,
    valuationScheduled: true,
    followUpCount: 3,
    entryRequirements: Array(10).fill(true),
    instagram: "",
    facebook: "",
  },
  { 
    id: "5", 
    name: "Peter Paul", 
    status: "warm", 
    phone: "0400 900 900", 
    email: "peter@paul.com", 
    location: "Thornlands",
    suburb: "Thornlands",
    propertyAddress: "555 Sunset Dr",
    lastContact: "2026-01-05", 
    score: 5,
    nepqQuestion1: "",
    nepqAnswer1: "",
    nepqQuestion2: "",
    nepqAnswer2: "",
    propertySituation: "",
    callNarrative: "",
    callDuration: 0,
    additionalNotes: "",
    callStatus: "pending",
    callbackDate: "",
    nextAction: "",
    valuationInterest: false,
    valuationScheduled: false,
    followUpCount: 0,
    entryRequirements: Array(10).fill(false),
    instagram: "",
    facebook: "",
  },
];

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>(createEmptyContact());
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

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

  const completedRequirements = newContact.entryRequirements.filter(Boolean).length;

  const handleAddContact = () => {
    if (!newContact.name.trim()) {
      toast({ title: "Error", description: "Please enter a contact name", variant: "destructive" });
      return;
    }
    const contact: Contact = {
      ...newContact,
      id: Date.now().toString(),
    };
    setContacts([...contacts, contact]);
    setNewContact(createEmptyContact());
    setIsDialogOpen(false);
    toast({ title: "Success", description: "Contact added successfully" });
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    toast({ title: "Deleted", description: "Contact removed successfully" });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailOpen(true);
  };

  const updateEntryRequirement = (index: number, checked: boolean) => {
    const updated = [...newContact.entryRequirements];
    updated[index] = checked;
    setNewContact({ ...newContact, entryRequirements: updated });
  };

  return (
    <div className="animate-fade-in print:bg-white print:text-black">
      <PageHeader
        title="Contacts"
        description="Manage your CRM pipeline"
        actions={
          <div className="flex gap-2 flex-wrap">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Contact</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-popover border-border max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Contact</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="basic" className="mt-4">
                  <TabsList className="grid grid-cols-5 bg-muted">
                    <TabsTrigger value="basic" className="text-xs sm:text-sm">Basic</TabsTrigger>
                    <TabsTrigger value="discovery" className="text-xs sm:text-sm">Discovery</TabsTrigger>
                    <TabsTrigger value="story" className="text-xs sm:text-sm">Story</TabsTrigger>
                    <TabsTrigger value="pipeline" className="text-xs sm:text-sm">Pipeline</TabsTrigger>
                    <TabsTrigger value="entry" className="text-xs sm:text-sm">Entry ({completedRequirements}/10)</TabsTrigger>
                  </TabsList>
                  
                  {/* Basic Tab */}
                  <TabsContent value="basic" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Full Name *</Label>
                      <Input 
                        placeholder="Enter contact name" 
                        className="bg-input"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input 
                          placeholder="email@example.com" 
                          className="bg-input"
                          value={newContact.email}
                          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input 
                          placeholder="0400 000 000" 
                          className="bg-input"
                          value={newContact.phone}
                          onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Property Address</Label>
                      <Input 
                        placeholder="123 Main Street" 
                        className="bg-input"
                        value={newContact.propertyAddress}
                        onChange={(e) => setNewContact({ ...newContact, propertyAddress: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Suburb</Label>
                      <Input 
                        placeholder="Suburb name" 
                        className="bg-input"
                        value={newContact.suburb}
                        onChange={(e) => setNewContact({ ...newContact, suburb: e.target.value, location: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Lead Status</Label>
                        <Select 
                          value={newContact.status} 
                          onValueChange={(value: "hot" | "warm" | "cold" | "entered") => setNewContact({ ...newContact, status: value })}
                        >
                          <SelectTrigger className="bg-input">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entered">Entered</SelectItem>
                            <SelectItem value="cold">Cold</SelectItem>
                            <SelectItem value="warm">Warm</SelectItem>
                            <SelectItem value="hot">Hot</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Lead Score (1-10)</Label>
                        <Input 
                          type="number" 
                          min="1" 
                          max="10" 
                          className="bg-input"
                          value={newContact.score}
                          onChange={(e) => setNewContact({ ...newContact, score: parseInt(e.target.value) || 5 })}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Discovery Tab */}
                  <TabsContent value="discovery" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>NEPQ Question 1</Label>
                      <Input 
                        placeholder="Enter first NEPQ question" 
                        className="bg-input"
                        value={newContact.nepqQuestion1}
                        onChange={(e) => setNewContact({ ...newContact, nepqQuestion1: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>NEPQ Answer 1</Label>
                      <Textarea 
                        placeholder="Enter answer to first NEPQ question" 
                        className="bg-input min-h-[80px]"
                        value={newContact.nepqAnswer1}
                        onChange={(e) => setNewContact({ ...newContact, nepqAnswer1: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>NEPQ Question 2</Label>
                      <Input 
                        placeholder="Enter second NEPQ question" 
                        className="bg-input"
                        value={newContact.nepqQuestion2}
                        onChange={(e) => setNewContact({ ...newContact, nepqQuestion2: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>NEPQ Answer 2</Label>
                      <Textarea 
                        placeholder="Enter answer to second NEPQ question" 
                        className="bg-input min-h-[80px]"
                        value={newContact.nepqAnswer2}
                        onChange={(e) => setNewContact({ ...newContact, nepqAnswer2: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Property Situation</Label>
                      <Textarea 
                        placeholder="Describe the contact's property situation..." 
                        className="bg-input min-h-[100px]"
                        value={newContact.propertySituation}
                        onChange={(e) => setNewContact({ ...newContact, propertySituation: e.target.value })}
                      />
                    </div>
                  </TabsContent>

                  {/* Story Tab */}
                  <TabsContent value="story" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Complete Call Narrative</Label>
                      <p className="text-xs text-muted-foreground">Write the full story of the call conversation from start to finish</p>
                      <Textarea 
                        placeholder="Full call story: How the conversation went, their reactions, key moments, exact quotes, transitions, objections raised and how you handled them, emotional shifts, etc..." 
                        className="bg-input min-h-[150px]"
                        value={newContact.callNarrative}
                        onChange={(e) => setNewContact({ ...newContact, callNarrative: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Call Duration (minutes)</Label>
                      <Input 
                        type="number" 
                        placeholder="Duration in minutes" 
                        className="bg-input"
                        value={newContact.callDuration || ""}
                        onChange={(e) => setNewContact({ ...newContact, callDuration: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Additional Notes</Label>
                      <Textarea 
                        placeholder="Any other observations or notes..." 
                        className="bg-input min-h-[100px]"
                        value={newContact.additionalNotes}
                        onChange={(e) => setNewContact({ ...newContact, additionalNotes: e.target.value })}
                      />
                    </div>
                  </TabsContent>

                  {/* Pipeline Tab */}
                  <TabsContent value="pipeline" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Call Status</Label>
                      <Select 
                        value={newContact.callStatus}
                        onValueChange={(value) => setNewContact({ ...newContact, callStatus: value })}
                      >
                        <SelectTrigger className="bg-input">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="missed">Missed</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Callback Date</Label>
                      <Input 
                        type="date" 
                        className="bg-input"
                        value={newContact.callbackDate}
                        onChange={(e) => setNewContact({ ...newContact, callbackDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Next Action / Nurture Plan</Label>
                      <p className="text-xs text-muted-foreground">What's the next step for this prospect? Follow-up strategy, nurture plan...</p>
                      <Textarea 
                        placeholder="Describe the next action or nurture plan..." 
                        className="bg-input min-h-[80px]"
                        value={newContact.nextAction}
                        onChange={(e) => setNewContact({ ...newContact, nextAction: e.target.value })}
                      />
                    </div>
                    <div className="p-4 bg-info/10 rounded-lg border border-info/30 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-info">🏠</span>
                        <Label className="text-sm font-medium">Valuation Pipeline</Label>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="valuation-interest"
                            checked={newContact.valuationInterest}
                            onCheckedChange={(checked) => setNewContact({ ...newContact, valuationInterest: checked as boolean })}
                          />
                          <Label htmlFor="valuation-interest" className="text-sm">Valuation Interest</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="valuation-scheduled"
                            checked={newContact.valuationScheduled}
                            onCheckedChange={(checked) => setNewContact({ ...newContact, valuationScheduled: checked as boolean })}
                          />
                          <Label htmlFor="valuation-scheduled" className="text-sm">Valuation Scheduled</Label>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Follow-up Count</Label>
                        <Input 
                          type="number" 
                          min="0"
                          className="bg-input"
                          value={newContact.followUpCount}
                          onChange={(e) => setNewContact({ ...newContact, followUpCount: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Contact Date</Label>
                        <Input 
                          type="date" 
                          className="bg-input"
                          value={newContact.lastContact}
                          onChange={(e) => setNewContact({ ...newContact, lastContact: e.target.value })}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Entry Tab */}
                  <TabsContent value="entry" className="space-y-4 mt-4">
                    <div>
                      <h3 className="font-semibold mb-1">Entry Requirements</h3>
                      <p className="text-sm text-success">{completedRequirements}/10 Complete</p>
                    </div>
                    <div className="space-y-2">
                      {defaultEntryRequirements.map((requirement, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                          <Checkbox 
                            id={`req-${index}`}
                            checked={newContact.entryRequirements[index]}
                            onCheckedChange={(checked) => updateEntryRequirement(index, checked as boolean)}
                          />
                          <Label htmlFor={`req-${index}`} className="text-sm flex-1 cursor-pointer">
                            {index + 1}. {requirement}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="instagram-check" />
                          <Label htmlFor="instagram-check">Instagram</Label>
                        </div>
                        <Input 
                          placeholder="Username" 
                          className="bg-input"
                          value={newContact.instagram}
                          onChange={(e) => setNewContact({ ...newContact, instagram: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="facebook-check" />
                          <Label htmlFor="facebook-check">Facebook</Label>
                        </div>
                        <Input 
                          placeholder="Profile name" 
                          className="bg-input"
                          value={newContact.facebook}
                          onChange={(e) => setNewContact({ ...newContact, facebook: e.target.value })}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddContact}>Save Contact</Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="gap-2 print:hidden">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="outline" className="gap-2 print:hidden">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-6 print:grid-cols-5 print:gap-2">
        <StatCard value={stats.total} label="Total" variant="total" />
        <StatCard value={stats.hot} label="Hot" variant="cancelled" icon="🔥" />
        <StatCard value={stats.warm} label="Warm" variant="planning" icon="🌡️" />
        <StatCard value={stats.cold} label="Cold" variant="active" icon="❄️" />
        <StatCard value={stats.entered} label="Entries" variant="completed" icon="✓" />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 print:hidden">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or suburb..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] sm:w-[160px] bg-card border-border">
              <SelectValue placeholder="All Segments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              <SelectItem value="hot">Hot</SelectItem>
              <SelectItem value="warm">Warm</SelectItem>
              <SelectItem value="cold">Cold</SelectItem>
              <SelectItem value="entered">Entered</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handlePrint} className="print:hidden">
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Contacts List */}
      <div className="space-y-3 print:space-y-2">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="contact-row flex-col sm:flex-row gap-4 print:flex-row print:p-2 print:border print:border-gray-300">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <AvatarCircle name={contact.name} size="lg" />
              <div className="flex-1 sm:flex-none">
                <p className="font-medium text-foreground print:text-black">{contact.name}</p>
                <StatusBadge variant={contact.status}>{contact.status.toUpperCase()}</StatusBadge>
              </div>
              <div className="text-right sm:hidden">
                <span className="text-2xl font-bold text-foreground print:text-black">{contact.score}</span>
                <span className="text-xs text-muted-foreground">/10</span>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 sm:bg-transparent p-2 sm:p-0 rounded print:bg-transparent">
                <MapPin className="w-4 h-4 shrink-0 text-destructive" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider block text-muted-foreground">Location</span>
                  <span className="text-foreground print:text-black">{contact.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 sm:bg-transparent p-2 sm:p-0 rounded print:bg-transparent">
                <Phone className="w-4 h-4 shrink-0 text-success" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider block text-muted-foreground">Phone</span>
                  <span className="text-foreground print:text-black">{contact.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground bg-secondary/50 sm:bg-transparent p-2 sm:p-0 rounded print:bg-transparent">
                <Mail className="w-4 h-4 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider block text-muted-foreground">Email</span>
                  <span className="text-foreground print:text-black truncate">{contact.email}</span>
                </div>
              </div>
              {contact.lastContact && (
                <div className="hidden sm:flex items-center gap-2 text-muted-foreground print:flex">
                  <div className="w-4 h-4 rounded-full bg-warning/30 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider block text-muted-foreground">Last Contact</span>
                    <span className="text-foreground print:text-black">{contact.lastContact}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden sm:block text-right print:block">
              <span className="text-2xl font-bold text-foreground print:text-black">{contact.score}</span>
              <span className="text-xs text-muted-foreground">/10</span>
            </div>
            
            <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-0 border-border print:hidden">
              <Button 
                variant="default" 
                size="sm" 
                className="flex-1 sm:flex-none gap-1"
                onClick={() => handleViewContact(contact)}
              >
                <Eye className="w-4 h-4" />
                <span className="sm:hidden">View Details</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleDeleteContact(contact.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px] bg-popover border-border max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedContact && <AvatarCircle name={selectedContact.name} size="lg" />}
              <div>
                <p>{selectedContact?.name}</p>
                {selectedContact && <StatusBadge variant={selectedContact.status}>{selectedContact.status.toUpperCase()}</StatusBadge>}
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <Tabs defaultValue="info" className="mt-4">
              <TabsList className="grid grid-cols-4 bg-muted">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="discovery">Discovery</TabsTrigger>
                <TabsTrigger value="story">Story</TabsTrigger>
                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Phone</p>
                    <p className="text-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4 text-success" />
                      {selectedContact.phone || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Email</p>
                    <p className="text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {selectedContact.email || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Location</p>
                    <p className="text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-destructive" />
                      {selectedContact.location || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Property Address</p>
                    <p className="text-foreground">{selectedContact.propertyAddress || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Lead Score</p>
                    <p className="text-foreground text-2xl font-bold">{selectedContact.score}/10</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Last Contact</p>
                    <p className="text-foreground">{selectedContact.lastContact || "N/A"}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">Entry Requirements</p>
                  <p className="text-foreground">{selectedContact.entryRequirements.filter(Boolean).length}/10 completed</p>
                </div>
              </TabsContent>
              
              <TabsContent value="discovery" className="space-y-4 mt-4">
                {selectedContact.nepqQuestion1 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Q: {selectedContact.nepqQuestion1}</p>
                    <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-lg">{selectedContact.nepqAnswer1 || "No answer recorded"}</p>
                  </div>
                )}
                {selectedContact.nepqQuestion2 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Q: {selectedContact.nepqQuestion2}</p>
                    <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-lg">{selectedContact.nepqAnswer2 || "No answer recorded"}</p>
                  </div>
                )}
                {selectedContact.propertySituation && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase">Property Situation</p>
                    <p className="text-sm text-foreground bg-secondary p-3 rounded-lg">{selectedContact.propertySituation}</p>
                  </div>
                )}
                {!selectedContact.nepqQuestion1 && !selectedContact.nepqQuestion2 && !selectedContact.propertySituation && (
                  <p className="text-muted-foreground text-center py-8">No discovery data recorded</p>
                )}
              </TabsContent>
              
              <TabsContent value="story" className="space-y-4 mt-4">
                {selectedContact.callNarrative ? (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase">Call Narrative</p>
                    <p className="text-sm text-foreground bg-secondary p-3 rounded-lg whitespace-pre-wrap">{selectedContact.callNarrative}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No call narrative recorded</p>
                )}
                {selectedContact.callDuration > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Call Duration</p>
                    <p className="text-foreground">{selectedContact.callDuration} minutes</p>
                  </div>
                )}
                {selectedContact.additionalNotes && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase">Additional Notes</p>
                    <p className="text-sm text-foreground bg-secondary p-3 rounded-lg">{selectedContact.additionalNotes}</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pipeline" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Call Status</p>
                    <p className="text-foreground capitalize">{selectedContact.callStatus || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Follow-up Count</p>
                    <p className="text-foreground">{selectedContact.followUpCount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Callback Date</p>
                    <p className="text-foreground">{selectedContact.callbackDate || "Not scheduled"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase">Next Action</p>
                    <p className="text-foreground">{selectedContact.nextAction || "None"}</p>
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${selectedContact.valuationInterest ? 'bg-success' : 'bg-muted'}`} />
                    <span className="text-sm">Valuation Interest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${selectedContact.valuationScheduled ? 'bg-success' : 'bg-muted'}`} />
                    <span className="text-sm">Valuation Scheduled</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
