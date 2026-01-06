import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface Deal {
  id: string;
  title: string;
  value: number;
  probability: number;
  stage: string;
}

const stages = [
  { id: "prospect", name: "Prospect", color: "bg-blue-500" },
  { id: "qualified", name: "Qualified", color: "bg-cyan-500" },
  { id: "under-offer", name: "Under Offer", color: "bg-yellow-500" },
  { id: "due-diligence", name: "Due Diligence", color: "bg-orange-500" },
  { id: "closed-won", name: "Closed Won", color: "bg-green-500" },
  { id: "closed-lost", name: "Closed Lost", color: "bg-red-500" },
];

const mockDeals: Deal[] = [];

export default function Pipeline() {
  const [deals] = useState<Deal[]>(mockDeals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getDealsByStage = (stageId: string) => {
    return deals.filter((deal) => deal.stage === stageId);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Sales Pipeline"
        description="Track your deals"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-popover border-border">
              <DialogHeader>
                <DialogTitle>Add Deal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input placeholder="Deal title" className="bg-input" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Value *</Label>
                    <Input type="number" placeholder="0" className="bg-input" />
                  </div>
                  <div className="space-y-2">
                    <Label>Probability %</Label>
                    <Input type="number" placeholder="50" className="bg-input" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Stage</Label>
                    <Select defaultValue="prospect">
                      <SelectTrigger className="bg-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((stage) => (
                          <SelectItem key={stage.id} value={stage.id}>
                            {stage.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Expected Close Date</Label>
                    <Input type="date" className="bg-input" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea placeholder="Additional notes..." className="bg-input min-h-[100px]" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>Save Deal</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Pipeline Board */}
      <div className="grid grid-cols-6 gap-4 overflow-x-auto">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.id);
          return (
            <div key={stage.id} className="pipeline-column">
              <div className="pipeline-column-header">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{stage.name}</span>
                </div>
                <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-medium ${stage.color} text-white`}>
                  {stageDeals.length}
                </span>
              </div>
              <div className={`h-1 ${stage.color} rounded mb-4`} />
              
              {stageDeals.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No deals</p>
              ) : (
                <div className="space-y-3">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-3 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors"
                    >
                      <p className="font-medium text-foreground text-sm">{deal.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        ${deal.value.toLocaleString()} • {deal.probability}%
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
