import type { SequenceStep } from "@/app/types/campaign";

export default function SequenceOverview({ sequences }: { sequences: SequenceStep[] }) {
  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-lg)", padding: "18px 20px",
    }}>
      <p style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 14px" }}>
        Sequence — {sequences.length} steps
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sequences.map((step, i) => (
          <div key={step.stepNumber} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
              background: "#E1F5EE", color: "#0F6E56",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 500, marginTop: 1 }}>
              {i + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)",
                margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {step.subjectTemplate || "No subject"}
              </p>
              <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "2px 0 0" }}>
                {i === 0 ? "Immediately" : `After ${step.delayDays} days if no reply`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}