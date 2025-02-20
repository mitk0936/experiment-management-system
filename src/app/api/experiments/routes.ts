// "use server";

// import { NextResponse } from "next/server";
// import { z } from "zod";
// // import { db } from "@/lib/db";

// // Experiment Schema
// const ExperimentSchema = z.object({
//   name: z.string().min(3, { message: "Name must be at least 3 characters" }),
//   description: z.string().optional(),
//   field: z.enum(["Physics", "Chemistry", "Biology", "Engineering"]),
//   status: z.enum(["Pending", "Ongoing", "Completed"]),
//   dateConducted: z.string().refine((val) => new Date(val) <= new Date(), {
//     message: "Date cannot be in the future",
//   }),
// });

// // Error Handler
// function handleError(error: any) {
//   console.error("Experiment API Error:", error);
//   return NextResponse.json(
//     { success: false, message: "An error occurred. Please try again." },
//     { status: 500 },
//   );
// }

// // Create Experiment (POST /api/experiments)
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const validation = ExperimentSchema.safeParse(body);
//     if (!validation.success) {
//       return NextResponse.json(
//         { success: false, errors: validation.error.format() },
//         { status: 400 },
//       );
//     }

//     const experiment = await db.experiment.create({ data: validation.data });
//     return NextResponse.json({ success: true, experiment });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// // Get All Experiments (GET /api/experiments)
// export async function GET() {
//   try {
//     const experiments = await db.experiment.findMany();
//     return NextResponse.json({ success: true, experiments });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// // Update Experiment (PUT /api/experiments/:id)
// export async function PUT(req: Request) {
//   try {
//     const { id, ...data } = await req.json();
//     const validation = ExperimentSchema.safeParse(data);
//     if (!validation.success) {
//       return NextResponse.json(
//         { success: false, errors: validation.error.format() },
//         { status: 400 },
//       );
//     }

//     const updatedExperiment = await db.experiment.update({
//       where: { id },
//       data: validation.data,
//     });

//     return NextResponse.json({ success: true, experiment: updatedExperiment });
//   } catch (error) {
//     return handleError(error);
//   }
// }

// // Delete Experiment (DELETE /api/experiments/:id)
// export async function DELETE(req: Request) {
//   try {
//     const { id } = await req.json();
//     await db.experiment.delete({ where: { id } });
//     return NextResponse.json({ success: true, message: "Experiment deleted successfully." });
//   } catch (error) {
//     return handleError(error);
//   }
// }
