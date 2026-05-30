import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// this file handles API requests to /api/campaigns/[id]/launch,launching the campaign (setting status to "active") with PATCH
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
    ) {
    const campaign = await prisma.campaign.update({
        where: { id: params.id },
        data: { status: "active" },
    });

    return NextResponse.json(campaign);
}