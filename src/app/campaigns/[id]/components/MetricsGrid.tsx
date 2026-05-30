interface Metrics {
  enrolled: number; sent: number; openRate: number; replies: number; meetings: number;
}

export default function MetricsGrid({ metrics }: { metrics: Metrics }) {
  const items = [
    { label: "Physicians Enrolled", value: metrics.enrolled, suffix: "" },
    { label: "Messages Sent",       value: metrics.sent,     suffix: "" },
    { label: "Open Rate",           value: metrics.openRate, suffix: "%" },
    { label: "Replies",             value: metrics.replies,  suffix: "" },
    { label: "Meetings Booked",     value: metrics.meetings, suffix: "" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
      {items.map((m) => (
        <div key={m.label} style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)", padding: "16px 18px",
        }}>
          <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "0 0 6px", fontWeight: 500 }}>
            {m.label}
          </p>
          <p style={{ fontSize: 25, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
            {m.value}{m.suffix}
          </p>
        </div>
      ))}
    </div>
  );
}