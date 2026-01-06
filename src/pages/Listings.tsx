import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, MapPin, Pencil, Trash2, Bed, Bath, Maximize } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Listing {
  id: string;
  address: string;
  suburb: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  landSize: number;
  propertyType: "house" | "apartment" | "townhouse" | "land";
  status: "active" | "pending" | "sold" | "withdrawn";
  description: string;
}

const mockListings: Listing[] = [
  {
    id: "1",
    address: "33/30-46 Edina Street",
    suburb: "Thornlands",
    price: 750000,
    bedrooms: 2,
    bathrooms: 2,
    landSize: 120,
    propertyType: "apartment",
    status: "active",
    description: "Beautiful apartment with modern finishes",
  },
];

const createEmptyListing = (): Omit<Listing, 'id'> => ({
  address: "",
  suburb: "",
  price: 0,
  bedrooms: 0,
  bathrooms: 0,
  landSize: 0,
  propertyType: "house",
  status: "active",
  description: "",
});

export default function Listings() {
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newListing, setNewListing] = useState<Omit<Listing, 'id'>>(createEmptyListing());
  const { toast } = useToast();

  const handleAddListing = () => {
    if (!newListing.address.trim()) {
      toast({ title: "Error", description: "Please enter an address", variant: "destructive" });
      return;
    }
    const listing: Listing = {
      ...newListing,
      id: Date.now().toString(),
    };
    setListings([...listings, listing]);
    setNewListing(createEmptyListing());
    setIsDialogOpen(false);
    toast({ title: "Success", description: "Property added successfully" });
  };

  const handleDeleteListing = (id: string) => {
    setListings(listings.filter(l => l.id !== id));
    toast({ title: "Deleted", description: "Property removed successfully" });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Properties & Listings"
        description="Manage your property portfolio"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Property</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-popover border-border max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Property</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Address *</Label>
                  <Input 
                    placeholder="Enter property address" 
                    className="bg-input"
                    value={newListing.address}
                    onChange={(e) => setNewListing({ ...newListing, address: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Suburb *</Label>
                    <Input 
                      placeholder="Suburb name" 
                      className="bg-input"
                      value={newListing.suburb}
                      onChange={(e) => setNewListing({ ...newListing, suburb: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Price *</Label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      className="bg-input"
                      value={newListing.price || ""}
                      onChange={(e) => setNewListing({ ...newListing, price: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      className="bg-input"
                      value={newListing.bedrooms || ""}
                      onChange={(e) => setNewListing({ ...newListing, bedrooms: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bathrooms</Label>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      className="bg-input"
                      value={newListing.bathrooms || ""}
                      onChange={(e) => setNewListing({ ...newListing, bathrooms: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Land Size (m²)</Label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    className="bg-input"
                    value={newListing.landSize || ""}
                    onChange={(e) => setNewListing({ ...newListing, landSize: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Property Type</Label>
                    <Select 
                      value={newListing.propertyType}
                      onValueChange={(value: Listing['propertyType']) => setNewListing({ ...newListing, propertyType: value })}
                    >
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select 
                      value={newListing.status}
                      onValueChange={(value: Listing['status']) => setNewListing({ ...newListing, status: value })}
                    >
                      <SelectTrigger className="bg-input">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                        <SelectItem value="withdrawn">Withdrawn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Property description..." 
                    className="bg-input min-h-[100px]"
                    value={newListing.description}
                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddListing}>Save Property</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {listings.map((listing) => (
          <div key={listing.id} className="bg-card rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <StatusBadge variant={listing.status === "active" ? "active" : listing.status === "sold" ? "completed" : "planning"}>
                {listing.status.toUpperCase()}
              </StatusBadge>
              <StatusBadge variant="outreach">
                {listing.propertyType.toUpperCase()}
              </StatusBadge>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{listing.address}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-destructive" />
                {listing.suburb}
              </p>
            </div>
            <p className="text-xl font-bold text-success">
              $ ${listing.price.toLocaleString()}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                {listing.bedrooms} bed
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                {listing.bathrooms} bath
              </span>
              <span className="flex items-center gap-1">
                <Maximize className="w-4 h-4" />
                {listing.landSize}m²
              </span>
            </div>
            <div className="flex gap-2 pt-2 border-t border-border">
              <Button variant="outline" size="sm" className="flex-1 gap-1">
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 gap-1 text-destructive hover:text-destructive"
                onClick={() => handleDeleteListing(listing.id)}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {listings.length === 0 && (
        <div className="flex flex-col items-center justify-center bg-card rounded-lg border border-border p-12 mt-8">
          <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-6">No properties added yet</p>
          <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Your First Property
          </Button>
        </div>
      )}
    </div>
  );
}
