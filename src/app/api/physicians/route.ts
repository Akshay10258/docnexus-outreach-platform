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
        ...(npiYear && { npiRegistrationYear: parseInt(npiYear) }),
        },
    });

    return NextResponse.json(physicians);
}
