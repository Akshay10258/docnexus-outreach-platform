import { CAMPAIGN_STATUS_COLORS, CAMPAIGN_TYPE_LABELS } from "@/app/constants/campaigns";
import type { Campaign } from "@/app/types/campaign";

interface Props {
    campaign: Campaign;
    launching: boolean;
    theme: string;
    onThemeToggle: () => void;
    onBack: () => void;
    onLaunch: () => void;
}

export default function CampaignHeader({ campaign, launching, theme, onThemeToggle, onBack, onLaunch }: Props) {
    const statusColors = CAMPAIGN_STATUS_COLORS[campaign.status] ?? CAMPAIGN_STATUS_COLORS.draft;

    return (
        <header style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "var(--color-background-primary)",
        borderBottom: "0.5px solid var(--color-border-tertiary)",
        padding: "14px 28px", display: "flex", alignItems: "center", gap: 12,
        }}>
        <button onClick={onBack} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 5,
            fontSize: 14, padding: 0,
        }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
            </svg>
            Back
        </button>
        <span style={{ color: "var(--color-border-tertiary)" }}>|</span>

        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>
            {campaign.name}
            </span>
            <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "3px 10px", borderRadius: 99,
            background: statusColors.bg, fontSize: 12, fontWeight: 500, color: statusColors.color,
            }}>
            <span style={{
                width: 6, height: 6, borderRadius: "50%", background: statusColors.dot,
                ...(campaign.status === "active" ? { animation: "pulse-dot 1.5s ease-in-out infinite" } : {}),
            }} />
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </span>
            <span style={{
            padding: "3px 10px", borderRadius: 99,
            background: "var(--color-background-secondary)",
            border: "0.5px solid var(--color-border-tertiary)",
            fontSize: 12, color: "var(--color-text-tertiary)",
            }}>
            {CAMPAIGN_TYPE_LABELS[campaign.type] ?? campaign.type}
            </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {campaign.status === "draft" && (
            <button onClick={onLaunch} disabled={launching} style={{
                padding: "7px 16px", fontSize: 14, fontWeight: 500,
                background: "#0F6E56", color: "white", border: "none",
                borderRadius: "var(--border-radius-md)",
                cursor: launching ? "not-allowed" : "pointer",
            }}>
                {launching ? "Launching..." : "Launch campaign →"}
            </button>
            )}
            <button onClick={onThemeToggle} style={{
            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
            background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-md)", cursor: "pointer", color: "var(--color-text-secondary)",
            }}>
            {theme === "light" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
            )}
            </button>
        </div>
        </header>
    );
}