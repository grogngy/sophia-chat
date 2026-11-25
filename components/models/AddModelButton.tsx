"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddModelDialog } from "@/components/admin/AddModelDialog";
import { Plus } from "lucide-react";

export function AddModelButton() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setShowAddDialog(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Model
      </Button>

      <AddModelDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </>
  );
}
