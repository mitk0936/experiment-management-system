"use client";

import { Button } from "@/presentation/common/components/ui/button";
import { Plus } from "lucide-react";

export function AddExperimentButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} className="flex items-center gap-2">
      <Plus size={16} />
      <span>Add New Experiment</span>
    </Button>
  );
}
