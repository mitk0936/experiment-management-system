import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/presentation/common/components/ui/table";
import { useExperiments } from "../hooks/useExperiments";
import { File, Loader2, MoreVertical, Pencil, Trash2 } from "lucide-react";
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

export function ExperimentsTable() {
  const { data: session } = useSession();
  const [requestedToDeleteItemId, setRequestedToDeleteItemId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: experiments = [], isLoading } = useExperiments();
  const { mutate: deleteExperiment } = useDeleteExperiment();

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => {
          deleteExperiment(
            { id: requestedToDeleteItemId as string },
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Experiment Name</TableHead>
            <TableHead>Field</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Loading Inidicator
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                <Loader2 className="animate-spin mx-auto text-gray-500" size={24} />
                <p className="mt-2 text-sm text-gray-500">Loading experiments...</p>
              </TableCell>
            </TableRow>
          ) : experiments.length === 0 ? (
            // No Data UI
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                <p className="text-gray-500">No experiments found.</p>
              </TableCell>
            </TableRow>
          ) : (
            // Actual Table Data
            experiments.map((exp) => (
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
                      <DropdownMenuItem>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <File className="w-4 h-4 mr-2" />
                        Attach Files
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={exp.userId !== session?.user?.id}
                        onClick={() => {
                          setIsDeleteDialogOpen(true);
                          setRequestedToDeleteItemId(exp.id as string);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
