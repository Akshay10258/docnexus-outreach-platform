import type { SequenceStep, CampaignType } from "@/app/types/campaign";

export const CAMPAIGN_TYPES: { value: CampaignType; label: string; desc: string }[] = [
    { value: "cold_outbound", label: "Cold Outreach", desc: "For initial contact" },
    { value: "reengagement", label: "Re-engagement", desc: "For previous contacts" },
    { value: "conference_followup", label: "Conference Follow-up", desc: "Post-event outreach" },
];

export const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
    cold_outbound: "Cold Outreach",
    reengagement: "Re-engagement",
    conference_followup: "Conference Follow-up",
};

export const CAMPAIGN_STATUS_LABELS: Record<string, string> = {
    draft: "Draft",
    active: "Active",
    completed: "Completed",
};

export const CAMPAIGN_STATUS_COLORS: Record<string, { color: string; bg: string; dot: string }> = {
    draft:     { color: "#854F0B", bg: "#FAEEDA", dot: "#854F0B" },
    active:    { color: "#0F6E56", bg: "#E1F5EE", dot: "#0F6E56" },
    completed: { color: "#185FA5", bg: "#E6F1FB", dot: "#185FA5" },
};

export const DEFAULT_SEQUENCES: SequenceStep[] = [
    {
        stepNumber: 1,
        delayDays: 0,
        subjectTemplate: "Introduction from DocNexus — {{specialty}} Outreach",
        bodyTemplate:
        "Dear Dr. {{doctor_name}},\n\nI wanted to reach out regarding our latest insights relevant to {{specialty}} practitioners at {{affiliation}}.\n\nWould you be open to a brief conversation?\n\nBest regards,\nDocNexus Team",
    },
    {
        stepNumber: 2,
        delayDays: 3,
        subjectTemplate: "Following up — DocNexus for {{specialty}}",
        bodyTemplate:
        "Dear Dr. {{doctor_name}},\n\nJust following up on my previous message. I'd love to connect with you about how DocNexus can support your practice at {{affiliation}}.\n\nBest regards,\nDocNexus Team",
    },
];

export const TEMPLATE_VARIABLES = ["{{doctor_name}}", "{{specialty}}", "{{affiliation}}", "{{city}}", "{{state}}"];