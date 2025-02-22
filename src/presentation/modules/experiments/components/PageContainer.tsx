"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { AddExperimentButton } from "./AddExperimentButton";
import { TypographyH1 } from "@/presentation/common/components/ui/typography";
import { AddExperiment } from "./forms/AddExperiment";
import Modal from "@/presentation/common/components/composite/Modal";
import { toast } from "sonner";
import { ExperimentsTable } from "./ExperimentsTable";
import { SessionProvider } from "next-auth/react";

export function PageContainer() {
  const [isAddExperimentsDialogOpen, setIsAddExperimentsDialogOpen] = useState(false);
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <div className="w-full mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <TypographyH1>Experiments</TypographyH1>

            {/* Add new experiment, button and Modal */}
            <Modal
              open={isAddExperimentsDialogOpen}
              onOpenChange={setIsAddExperimentsDialogOpen}
              trigger={<AddExperimentButton onClick={() => setIsAddExperimentsDialogOpen(true)} />}
              title="Add New Experiment"
            >
              <AddExperiment
                onError={() => {
                  toast.error("Failed to add a new Experiment");
                }}
                onComplete={() => {
                  setIsAddExperimentsDialogOpen(false);
                  toast.success("A New Experiment added.");
                }}
              />
            </Modal>
          </div>

          {/* Table */}
          <ExperimentsTable />
        </div>
      </QueryClientProvider>
    </SessionProvider>
  );
}
