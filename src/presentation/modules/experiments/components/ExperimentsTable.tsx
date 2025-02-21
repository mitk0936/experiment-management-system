import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/presentation/common/components/ui/table";
import { useExperiments } from "../hooks/useExperiments";
import { Loader2 } from "lucide-react";
import { formatUserLocaleDate } from "@/presentation/common/lib/date";

export function ExperimentsTable() {
  const { data: experiments = [], isLoading } = useExperiments(); // Assuming `isLoading` exists

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Experiment Name</TableHead>
            <TableHead>Field</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Loading Inidicator
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
                <Loader2 className="animate-spin mx-auto text-gray-500" size={24} />
                <p className="mt-2 text-sm text-gray-500">Loading experiments...</p>
              </TableCell>
            </TableRow>
          ) : experiments.length === 0 ? (
            // No Data UI
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
