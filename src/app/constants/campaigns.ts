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
        subjectTemplate: "Connecting with {{specialty}} specialists at {{affiliation}}",
        bodyTemplate:
        "Dear Dr. {{doctor_name}},\n\nI hope this message finds you well. I'm reaching out because our team works closely with leading {{specialty}} practitioners, and I believe there's an opportunity worth discussing with your team at {{affiliation}}.\n\nWould you be open to a brief 15-minute call this week?\n\nBest regards,\n{{sender_name}}\n{{sender_title}}\n{{sender_company}}",
    },
    {
        stepNumber: 2,
        delayDays: 3,
        subjectTemplate: "Following up — Clinical resources for {{specialty}}",
        bodyTemplate:
        "Dear Dr. {{doctor_name}},\n\nI wanted to follow up on my previous message. I understand you're busy, so I'll keep this brief — we've been helping {{specialty}} teams at institutions like {{affiliation}} streamline their research and clinical workflows.\n\nWould a quick call work for you?\n\nBest regards,\n{{sender_name}}\n{{sender_title}}\n{{sender_company}}",
    },
];

export const TEMPLATE_VARIABLES = ["{{doctor_name}}", "{{specialty}}", "{{affiliation}}", "{{city}}", "{{state}}", "{{sender_name}}", "{{sender_title}}", "{{sender_company}}"];