import {NextResponse,NextRequest} from "next/server";
import { prisma } from "@/lib/prisma";

// this file handles API requests to /api/campaigns, allowing for creating new campaigns with POST
export async function POST(req: NextRequest) {
    const body = await req.json();

    const {name,type,enrolledPhysicianIds,sequences} = body;

    const campaign = await prisma.campaign.create({
        data:{
            name,
            type,
            status:"draft",
            enrolledPhysicianIds:enrolledPhysicianIds.join(","),
            sequences:{
                create: sequences.map((s:any,i:number) => ({
                    stepNumber: i + 1,
                    delayDays: s.delayDays,
                    subjectTemplate: s.subjectTemplate,
                    bodyTemplate: s.bodyTemplate,
                })),
            },
        },
        include: { sequences: true },
    });

    return NextResponse.json(campaign, { status: 201 });
}
