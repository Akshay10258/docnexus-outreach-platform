import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const specialties = await prisma.physician.findMany({ distinct: ['specialty'], select: { specialty: true }, orderBy: { specialty: 'asc' } });
        const states = await prisma.physician.findMany({ distinct: ['state'], select: { state: true }, orderBy: { state: 'asc' } });
        const affiliations = await prisma.physician.findMany({ distinct: ['affiliation'], select: { affiliation: true }, orderBy: { affiliation: 'asc' } });

        return NextResponse.json({
            specialties: ["All Specialties", ...specialties.map(s => s.specialty)],
            states: ["All States", ...states.map(s => s.state)],
            affiliations: ["All Affiliations", ...affiliations.map(s => s.affiliation)],
        });
    } catch (error) {
        console.error("Failed to fetch filter options:", error);
        return NextResponse.json({ specialties: ["All Specialties"], states: ["All States"], affiliations: ["All Affiliations"] }, { status: 500 });
    }
}
