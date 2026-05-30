const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props {
    data: number[];
    campaignStatus: string;
}

export default function ActivityChart({ data, campaignStatus }: Props) {
    const max = Math.max(...data, 1);
    const barColor = campaignStatus === "active" ? "#1D9E75"
        : campaignStatus === "completed" ? "#378ADD" : "#B4B2A9";

    return (
        <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)", padding: "18px 20px",
        }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
            Outreach activity
            </p>
            <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Last 7 days</span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80, padding: "0 4px" }}>
            {data.map((val, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                width: "100%", borderRadius: "3px 3px 0 0",
                height: `${Math.round((val / max) * 64)}px`,
                background: barColor, transition: "height 0.3s ease",
                minHeight: val > 0 ? 4 : 0,
                }} />
                <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{DAYS[i]}</span>
            </div>
            ))}
        </div>

        {campaignStatus === "draft" && (
            <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", textAlign: "center", marginTop: 8 }}>
            Launch campaign to start tracking activity
            </p>
        )}
        </div>
    );
}