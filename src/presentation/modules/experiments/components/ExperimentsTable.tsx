import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/presentation/common/components/ui/table";
import { useExperiments } from "../hooks/useExperiments";
import { Eye, File, Loader2, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { formatUserLocaleDate } from "@/presentation/common/lib/date";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/common/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/presentation/common/components/composite/ConfirmDialog";
import { useState } from "react";
import { useDeleteExperiment } from "../hooks/useDeleteExperiment";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Modal from "@/presentation/common/components/composite/Modal";
import { UpdateExperiment } from "./forms/UpdateExperiment";
import { useSearchableTable } from "@/presentation/common/hooks/useSearchableTable";
import { Input } from "@/presentation/common/components/ui/input";
import { ManageAttachments } from "./ManageAttachments";
import { ViewExperimentDetails } from "./ViewExperimentDetails";
import { IExperiment } from "@/core/types/entities";

export function ExperimentsTable() {
  const { data: session } = useSession();

  const { data: experiments = [], isLoading } = useExperiments();
  const { mutate: deleteExperiment } = useDeleteExperiment();

  const { filteredData, searchQuery, setSearchQuery } = useSearchableTable(experiments, [
    "name",
    "field",
    "status",
    "description",
  ]);

  // View Details Selected State
  const [experimentToViewDetails, setExperimentToViewDetails] = useState<IExperiment | null>(null);

  // Update Experiment Selected State
  const [experimentToUpdate, setExperimentToUpdate] = useState<IExperiment | null>(null);

  // Manage Attachments Selected State
  const [experimentToManageAttachments, setExperimentToManageAttachments] =
    useState<IExperiment | null>(null);

  // Delete Confimation Selected State
  const [experimentToDelete, setExperimentToDelete] = useState<IExperiment | null>(null);

  // TODO: Split the render into smaller components
  return (
    <>
      {/* Search Input */}
      <Input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-sm my-5"
      />
      <div className="border rounded-lg overflow-hidden shadow-sm">
        {/* View Details Experiment Dialog */}
        <Modal
          open={Boolean(experimentToViewDetails)}
          onOpenChange={() => setExperimentToViewDetails(null)}
          title="View Details for Experiment"
        >
          {experimentToViewDetails && (
            <ViewExperimentDetails experiment={experimentToViewDetails} />
          )}
        </Modal>

        {/* Update Experiment Dialog */}
        <Modal
          open={Boolean(experimentToUpdate)}
          onOpenChange={() => setExperimentToUpdate(null)}
          title="Update Experiment"
        >
          {experimentToUpdate && (
            <UpdateExperiment
              experiment={experimentToUpdate}
              onError={() => {
                toast.error("Failed to update the experiment.");
              }}
              onComplete={() => {
                setExperimentToUpdate(null);
                toast.success("Experiment was updated.");
              }}
            />
          )}
        </Modal>

        {/* Manage Attachments Dialog */}
        <Modal
          open={Boolean(experimentToManageAttachments)}
          onOpenChange={() => setExperimentToManageAttachments(null)}
          title="Manage Experiment Attachments"
        >
          {experimentToManageAttachments && (
            <ManageAttachments experimentId={experimentToManageAttachments.id} />
          )}
        </Modal>

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          open={Boolean(experimentToDelete)}
          onOpenChange={() => setExperimentToDelete(null)}
          onConfirm={() => {
            deleteExperiment(
              { id: experimentToDelete?.id as string },
              {
                onSuccess: () => {
                  toast.success("Experiment was deleted.");
                },
                onError: () => {
                  toast.error("Failed to delete experiment.");
                },
              },
            );
          }}
        />

        {/* Experiments Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Field</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              /* Loading Inidicator */
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  <Loader2 className="animate-spin mx-auto text-gray-500" size={24} />
                  <p className="mt-2 text-sm text-gray-500">Loading experiments...</p>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              /* No Experiments Message */
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  <p className="text-gray-500">No experiments found.</p>
                </TableCell>
              </TableRow>
            ) : (
              /* Actual Table Data */
              filteredData.map((exp) => {
                const userCanAccessExperiment = exp.userId === session?.user?.id;

                return (
                  <TableRow key={exp.id}>
                    <TableCell>{exp.name}</TableCell>
                    <TableCell>{exp.field}</TableCell>
                    <TableCell>{exp.status}</TableCell>
                    <TableCell>{formatUserLocaleDate(exp.dateCreated)}</TableCell>
                    <TableCell className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="w-5 h-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Experiment Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setExperimentToViewDetails(exp);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={!userCanAccessExperiment}
                            onClick={() => {
                              setExperimentToUpdate(exp);
                            }}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit Info
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={!userCanAccessExperiment}
                            onClick={() => {
                              setExperimentToManageAttachments(exp);
                            }}
                          >
                            <File className="w-4 h-4 mr-2" />
                            Manage Attachments
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={!userCanAccessExperiment}
                            onClick={() => {
                              setExperimentToDelete(exp);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
