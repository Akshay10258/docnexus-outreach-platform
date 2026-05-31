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

    // Fetch all campaigns to map enrollment and history
    const campaigns = await prisma.campaign.findMany({
        select: { id: true, name: true, status: true, enrolledPhysicianIds: true, createdAt: true },
        orderBy: { createdAt: 'desc' }
    });

    // Build maps of physicianId -> count and history
    const enrollmentCounts: Record<string, number> = {};
    const histories: Record<string, { id: string; name: string; status: string; date: string }[]> = {};

    campaigns.forEach((c) => {
        if (!c.enrolledPhysicianIds) return;
        const ids = c.enrolledPhysicianIds.split(",").map(id => id.trim());
        ids.forEach((id) => {
            if (!id) return;
            // Count active ones
            if (c.status === "active") {
                enrollmentCounts[id] = (enrollmentCounts[id] || 0) + 1;
            }
            // Add to history
            if (!histories[id]) histories[id] = [];
            histories[id].push({
                id: c.id,
                name: c.name,
                status: c.status,
                date: c.createdAt.toISOString()
            });
        });
    });

    const physiciansWithCounts = physicians.map((p) => ({
        ...p,
        activeCampaignCount: enrollmentCounts[p.id] || 0,
        history: histories[p.id] || [],
    }));

    return NextResponse.json(physiciansWithCounts);
}
