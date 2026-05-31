import {NextResponse,NextRequest} from "next/server";
import { prisma } from "@/lib/prisma";

// this file handles API requests to /api/campaigns, allowing for creating new campaigns with POST
export async function POST(req: NextRequest) {
    const body = await req.json();

    const {name,type,enrolledPhysicianIds,sequences,senderName,senderTitle,senderCompany} = body;

    const campaign = await prisma.campaign.create({
        data:{
            name,
            type,
            status:"draft",
            senderName,
            senderTitle,
            senderCompany,
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

export async function GET() {
    const campaigns = await prisma.campaign.findMany({
        orderBy: { createdAt: "desc" },
        include: { sequences: true },
    });
    return NextResponse.json(campaigns.map((c) => ({
        ...c,
        enrolledPhysicianIds: c.enrolledPhysicianIds ? c.enrolledPhysicianIds.split(",") : [],
    })));
}