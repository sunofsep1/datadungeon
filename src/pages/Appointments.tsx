import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar, Clock, User, MapPin, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  title: string;
  contactName: string;
  date: string;
  time: string;
  location: string;
  type: "valuation" | "meeting" | "call" | "inspection";
  notes: string;
}

const mockAppointments: Appointment[] = [];

const createEmptyAppointment = (): Omit<Appointment, 'id'> => ({
  title: "",
  contactName: "",
  date: "",
  time: "",
  location: "",
  type: "meeting",
  notes: "",
});

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Omit<Appointment, 'id'>>(createEmptyAppointment());
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddAppointment = () => {
    if (!newAppointment.title.trim()) {
      toast({ title: "Error", description: "Please enter a title", variant: "destructive" });
      return;
    }
    if (!newAppointment.date) {
      toast({ title: "Error", description: "Please select a date", variant: "destructive" });
      return;
    }

    if (editingId) {
      setAppointments(appointments.map(a => 
        a.id === editingId ? { ...newAppointment, id: editingId } : a
      ));
      toast({ title: "Success", description: "Appointment updated successfully" });
    } else {
      const appointment: Appointment = {
        ...newAppointment,
        id: Date.now().toString(),
      };
      setAppointments([...appointments, appointment]);
      toast({ title: "Success", description: "Appointment scheduled successfully" });
    }
    
    setNewAppointment(createEmptyAppointment());
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (appointment: Appointment) => {
    setNewAppointment({
      title: appointment.title,
      contactName: appointment.contactName,
      date: appointment.date,
      time: appointment.time,
      location: appointment.location,
      type: appointment.type,
      notes: appointment.notes,
    });
    setEditingId(appointment.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
    toast({ title: "Deleted", description: "Appointment removed successfully" });
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setNewAppointment(createEmptyAppointment());
      setEditingId(null);
    }
  };

  const getTypeColor = (type: Appointment['type']) => {
    switch (type) {
      case "valuation": return "bg-primary/20 text-primary";
      case "meeting": return "bg-success/20 text-success";
      case "call": return "bg-warning/20 text-warning";
      case "inspection": return "bg-info/20 text-info";
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Appointments"
        description="Manage your scheduled meetings and appointments"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Schedule Appointment</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-popover border-border max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Appointment" : "Schedule Appointment"}</DialogTitle>
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
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input 
                    placeholder="Contact name" 
                    className="bg-input"
                    value={newAppointment.contactName}
                    onChange={(e) => setNewAppointment({ ...newAppointment, contactName: e.target.value })}
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
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select 
                    value={newAppointment.type}
                    onValueChange={(value: Appointment['type']) => setNewAppointment({ ...newAppointment, type: value })}
                  >
                    <SelectTrigger className="bg-input">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="valuation">Valuation</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea 
                    placeholder="Additional notes..." 
                    className="bg-input min-h-[80px]"
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => handleDialogChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAppointment}>
                  {editingId ? "Update" : "Schedule"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {appointments.length > 0 ? (
        <div className="space-y-3 mt-6">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-card rounded-lg border border-border p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{appointment.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(appointment.type)}`}>
                      {appointment.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-muted-foreground">
                    {appointment.contactName && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {appointment.contactName}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {appointment.date}
                    </div>
                    {appointment.time && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appointment.time}
                      </div>
                    )}
                    {appointment.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {appointment.location}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(appointment)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(appointment.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-card rounded-lg border border-border p-12 mt-8">
          <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-6">No appointments scheduled yet</p>
          <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Schedule Your First Appointment
          </Button>
        </div>
      )}
    </div>
  );
}
