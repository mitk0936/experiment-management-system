"use client";

import { useState } from "react";
import { Button } from "@/presentation/common/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/presentation/common/components/ui/table";
import { AddExperimentButton } from "./add-experiment-button";
import { TypographyH1 } from "@/presentation/common/components/ui/typography";

export default function ExperimentsPage() {
  const [experiments, setExperiments] = useState([
    { id: 1, title: "Physics Experiment", category: "Physics", date: "2024-06-15" },
    { id: 2, title: "Chemical Reaction Analysis", category: "Chemistry", date: "2024-06-10" },
    { id: 3, title: "Biology DNA Study", category: "Biology", date: "2024-06-05" },
  ]);

  function handleAddExperiment() {
    console.log("Trigger add experiment modal or form");
  }

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <TypographyH1>Experiments</TypographyH1>
        <AddExperimentButton onClick={handleAddExperiment} />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date Conducted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiments.map((exp) => (
              <TableRow key={exp.id}>
                <TableCell>{exp.title}</TableCell>
                <TableCell>{exp.category}</TableCell>
                <TableCell>{exp.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
