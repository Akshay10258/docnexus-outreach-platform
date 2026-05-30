import { useRouter } from "next/navigation";
import Link from "next/link";
import { CAMPAIGN_STATUS_COLORS, CAMPAIGN_TYPE_LABELS } from "@/app/constants/campaigns";
import type { Campaign } from "@/app/types/campaign";

interface Props {
    campaigns: Campaign[];
    loading: boolean;
}

export default function CampaignList({ campaigns, loading }: Props) {
    const router = useRouter();

    if (loading) {
        return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: 72, borderRadius: "var(--border-radius-lg)",
                background: "var(--color-background-secondary)",
                animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
        </div>
        );
    }

    if (campaigns.length === 0) {
        return (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 15, color: "var(--color-text-tertiary)", margin: "0 0 12px" }}>
            No campaigns yet
            </p>
            <Link href="/campaigns/new" style={{ fontSize: 14, color: "#0F6E56", fontWeight: 500 }}>
            Create your first campaign →
            </Link>
        </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {campaigns.map((c) => {
            const colors = CAMPAIGN_STATUS_COLORS[c.status] ?? CAMPAIGN_STATUS_COLORS.draft;
            const enrolled = Array.isArray(c.enrolledPhysicianIds) ? c.enrolledPhysicianIds.length : 0;
            return (
            <div key={c.id} onClick={() => router.push(`/campaigns/${c.id}`)} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "16px 20px", background: "var(--color-background-primary)",
                borderRadius: "var(--border-radius-lg)",
                border: "0.5px solid var(--color-border-tertiary)",
                cursor: "pointer",
            }}>
                <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
                    {c.name}
                </p>
                <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", margin: "3px 0 0" }}>
                    {CAMPAIGN_TYPE_LABELS[c.type] ?? c.type} · {enrolled} physician{enrolled !== 1 ? "s" : ""} ·{" "}
                    {new Date(c.createdAt).toLocaleDateString()}
                </p>
                </div>
                <span style={{
                padding: "3px 10px", borderRadius: 99,
                background: colors.bg, color: colors.color,
                fontSize: 12, fontWeight: 500,
                }}>
                {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" style={{ color: "var(--color-text-tertiary)" }}>
                <path d="m9 18 6-6-6-6" />
                </svg>
            </div>
            );
        })}
        </div>
    );
}