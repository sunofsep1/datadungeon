import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Building2 } from "lucide-react";

export default function Listings() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Listings"
        description="Manage your property listings"
        actions={
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Listing
          </Button>
        }
      />

      <div className="flex flex-col items-center justify-center bg-card rounded-lg border border-border p-12 mt-8">
        <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center mb-4">
          <Building2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground mb-6">No listings added yet</p>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Your First Listing
        </Button>
      </div>
    </div>
  );
}
