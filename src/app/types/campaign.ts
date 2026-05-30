export type CampaignType = "cold_outbound" | "reengagement" | "conference_followup";
export type CampaignStatus = "draft" | "active" | "completed";

export interface SequenceStep {
    stepNumber: number;
    delayDays: number;
    subjectTemplate: string;
    bodyTemplate: string;
}

export interface Campaign {
    id: string;
    name: string;
    type: CampaignType;
    status: CampaignStatus;
    createdAt: string;
    sequences: SequenceStep[];
    enrolledPhysicianIds: string[];
}