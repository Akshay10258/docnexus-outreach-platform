import {NextRequest, NextResponse} from "next/server";
import { prisma } from "@/lib/prisma";

// this file handles API requests to /api/physicians, allowing for filtering by specialty, state, affiliation, and NPI registration year via query parameters
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const specialty = searchParams.get("specialty");
    const state = searchParams.get("state");
    const affiliation = searchParams.get("affiliation");
    const npiYear = searchParams.get("npiRegistrationYear");

    const physicians = await prisma.physician.findMany({
        where: {
            ...(specialty && { specialty }),
            ...(state && { state }),
            ...(affiliation && { affiliation }),
            ...(npiYear && { npiRegistrationYear: { gte: parseInt(npiYear) } }),
        },
    });

    // Fetch active campaigns to map enrollment
    const campaigns = await prisma.campaign.findMany({
        where: { status: "active" },
        select: { enrolledPhysicianIds: true },
    });

    // Build a map of physicianId -> count of active campaigns
    const enrollmentCounts: Record<string, number> = {};
    campaigns.forEach((c) => {
        if (!c.enrolledPhysicianIds) return;
        const ids = c.enrolledPhysicianIds.split(",");
        ids.forEach((id) => {
            enrollmentCounts[id] = (enrollmentCounts[id] || 0) + 1;
        });
    });

    const physiciansWithCounts = physicians.map((p) => ({
        ...p,
        activeCampaignCount: enrollmentCounts[p.id] || 0,
    }));

    return NextResponse.json(physiciansWithCounts);
}
