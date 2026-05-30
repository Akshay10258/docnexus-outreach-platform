import { CAMPAIGN_TYPES } from "@/app/constants/campaigns";

interface Props {
  name: string;
  type: string;
  error: string;
  onNameChange: (v: string) => void;
  onTypeChange: (v: string) => void;
}

export default function CampaignForm({ name, type, error, onNameChange, onTypeChange }: Props) {
  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-lg)",
      padding: "20px 22px",
    }}>
      <h2 style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", margin: "0 0 16px" }}>
        Campaign details
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={labelStyle}>CAMPAIGN NAME</label>
          <input type="text" value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Q3 Oncology Northeast Outreach"
            style={{
              width: "100%", padding: "9px 12px", borderRadius: "var(--border-radius-md)",
              border: `0.5px solid ${error ? "#E24B4A" : "var(--color-border-secondary)"}`,
              background: "var(--color-background-secondary)",
              color: "var(--color-text-primary)", fontSize: 14,
              boxSizing: "border-box", outline: "none",
            }} />
          {error && <p style={{ fontSize: 12, color: "#E24B4A", margin: "4px 0 0" }}>{error}</p>}
        </div>

        <div>
          <label style={labelStyle}>CAMPAIGN TYPE</label>
          <div style={{ display: "flex", gap: 8 }}>
            {CAMPAIGN_TYPES.map((t) => (
              <button key={t.value} onClick={() => onTypeChange(t.value)} style={{
                flex: 1, padding: "10px 12px", textAlign: "left",
                borderRadius: "var(--border-radius-md)",
                border: `0.5px solid ${type === t.value ? "#1D9E75" : "var(--color-border-secondary)"}`,
                background: type === t.value ? "#E1F5EE" : "var(--color-background-secondary)",
                cursor: "pointer", transition: "all 0.15s",
              }}>
                <p style={{ fontSize: 13, fontWeight: 500, margin: 0,
                  color: type === t.value ? "#0F6E56" : "var(--color-text-primary)" }}>
                  {t.label}
                </p>
                <p style={{ fontSize: 12, margin: "2px 0 0",
                  color: type === t.value ? "#1D9E75" : "var(--color-text-tertiary)" }}>
                  {t.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 12, color: "var(--color-text-tertiary)",
  display: "block", marginBottom: 5,
  fontWeight: 500, letterSpacing: "0.06em",
};