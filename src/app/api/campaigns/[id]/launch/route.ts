import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// this file handles API requests to /api/campaigns/[id]/launch,launching the campaign (setting status to "active") with PATCH
export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        
        // Ensure the campaign actually exists before launching
        const existing = await prisma.campaign.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
        }

        const campaign = await prisma.campaign.update({
            where: { id },
            data: { status: "active" },
        });

        return NextResponse.json(campaign);
    } catch (error) {
        console.error("Error launching campaign:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}