import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/campaigns/[id] — fetch a campaign with its sequences
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
    ) {
    const { id } = await context.params;
    const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: { sequences: true },
    });

    if (!campaign) {
        return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({
        ...campaign,
        enrolledPhysicianIds: campaign.enrolledPhysicianIds
        ? campaign.enrolledPhysicianIds.split(",")
        : [],
    });
}

// PUT /api/campaigns/[id] — update campaign details and sequences
export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await req.json();
        const { name, type, sequences, senderName, senderTitle, senderCompany } = body;

        // Input validation
        if (!name || !type) {
            return NextResponse.json({ error: "Campaign name and type are required" }, { status: 400 });
        }
        if (!Array.isArray(sequences)) {
            return NextResponse.json({ error: "Sequences must be an array" }, { status: 400 });
        }

        // Verify existence before deletion/update
        const existing = await prisma.campaign.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
        }

        // Transactional update: delete old sequences and recreate with updated ones
        await prisma.sequenceStep.deleteMany({ where: { campaignId: id } });

        const campaign = await prisma.campaign.update({
            where: { id },
            data: {
                name,
                type,
                senderName,
                senderTitle,
                senderCompany,
                sequences: {
                    create: sequences.map((s: any, i: number) => ({
                        stepNumber: i + 1,
                        delayDays: s.delayDays || 0,
                        subjectTemplate: s.subjectTemplate || "",
                        bodyTemplate: s.bodyTemplate || "",
                    })),
                },
            },
            include: { sequences: true },
        });

        return NextResponse.json({
            ...campaign,
            enrolledPhysicianIds: campaign.enrolledPhysicianIds
                ? campaign.enrolledPhysicianIds.split(",")
                : [],
        });
    } catch (error) {
        console.error("Error updating campaign:", error);
        return NextResponse.json({ error: "Internal server error during update" }, { status: 500 });
    }
}