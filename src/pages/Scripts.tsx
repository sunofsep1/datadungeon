import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText } from "lucide-react";

interface Script {
  id: string;
  title: string;
  content: string;
}

export default function Scripts() {
  const [scripts] = useState<Script[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Scripts & Dialogues"
        description="Manage your call scripts and conversation templates"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Script
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-popover border-border">
              <DialogHeader>
                <DialogTitle>Create New Script</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Script Title</Label>
                  <Input placeholder="e.g., Cold Call Introduction" className="bg-input" />
                </div>
                <div className="space-y-2">
                  <Label>Script Content</Label>
                  <Textarea 
                    placeholder="Write your script here..." 
                    className="bg-input min-h-[200px]" 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>Save Script</Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {scripts.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-card rounded-lg border border-border p-12 mt-8">
          <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-6">No scripts created yet</p>
          <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4" />
            Create Your First Script
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scripts.map((script) => (
            <div key={script.id} className="p-4 bg-card rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
              <h3 className="font-medium text-foreground">{script.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{script.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
