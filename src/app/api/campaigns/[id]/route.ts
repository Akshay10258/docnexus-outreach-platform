import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// this file handles API requests to /api/campaigns/[id], allowing for retrieving campaign details with GET
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
    ) {
    const campaign = await prisma.campaign.findUnique({
        where: { id: params.id },
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