import {NextResponse,NextRequest} from "next/server";
import { prisma } from "@/lib/prisma";

// this file handles API requests to /api/campaigns, allowing for creating new campaigns with POST
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {name, type, enrolledPhysicianIds, sequences, senderName, senderTitle, senderCompany} = body;

        // input validation
        if (!name || !type) {
            return NextResponse.json({ error: "Campaign name and type are required" }, { status: 400 });
        }
        if (!Array.isArray(sequences) || sequences.length === 0) {
            return NextResponse.json({ error: "At least one sequence step is required" }, { status: 400 });
        }
        if (!Array.isArray(enrolledPhysicianIds)) {
            return NextResponse.json({ error: "enrolledPhysicianIds must be an array" }, { status: 400 });
        }

        const campaign = await prisma.campaign.create({
            data:{
                name,
                type,
                status:"draft",
                senderName,
                senderTitle,
                senderCompany,
                enrolledPhysicianIds: enrolledPhysicianIds.join(","),
                sequences:{
                    create: sequences.map((s:any, i:number) => ({
                        stepNumber: i + 1,
                        delayDays: s.delayDays || 0,
                        subjectTemplate: s.subjectTemplate || "",
                        bodyTemplate: s.bodyTemplate || "",
                    })),
                },
            },
            include: { sequences: true },
        });

        return NextResponse.json(campaign, { status: 201 });
    } catch (error) {
        console.error("Error creating campaign:", error);
        return NextResponse.json({ error: "Internal server error during campaign creation" }, { status: 500 });
    }
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