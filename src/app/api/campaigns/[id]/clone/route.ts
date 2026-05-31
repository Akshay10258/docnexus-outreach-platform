import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/campaigns/[id]/clone — duplicate an existing campaign
export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        // Fetch the original campaign with its sequences
        const existingCampaign = await prisma.campaign.findUnique({
            where: { id },
            include: { sequences: true },
        });

        if (!existingCampaign) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
        }

        // Create the duplicate campaign
        const clonedCampaign = await prisma.campaign.create({
            data: {
                name: `${existingCampaign.name} (Copy)`,
                type: existingCampaign.type,
                status: "draft",
                senderName: existingCampaign.senderName,
                senderTitle: existingCampaign.senderTitle,
                senderCompany: existingCampaign.senderCompany,
                enrolledPhysicianIds: "", // Don't copy enrolled physicians
                sequences: {
                    create: existingCampaign.sequences.map((s) => ({
                        stepNumber: s.stepNumber,
                        delayDays: s.delayDays,
                        subjectTemplate: s.subjectTemplate,
                        bodyTemplate: s.bodyTemplate,
                    })),
                },
            },
            include: { sequences: true },
        });

        return NextResponse.json(clonedCampaign, { status: 201 });
    } catch (error) {
        console.error("Error cloning campaign:", error);
        return NextResponse.json({ error: "Internal server error during campaign cloning" }, { status: 500 });
    }
}
