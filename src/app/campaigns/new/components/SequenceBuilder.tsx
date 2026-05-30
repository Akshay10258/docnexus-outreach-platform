import { TEMPLATE_VARIABLES } from "@/app/constants/campaigns";
import type { SequenceStep } from "@/app/types/campaign";

interface Props {
  steps: SequenceStep[];
  activeField: string | null;
  onStepChange: (i: number, s: SequenceStep) => void;
  onAddStep: () => void;
  onRemoveStep: (i: number) => void;
  onActiveFieldChange: (f: string | null) => void;
}

export default function SequenceBuilder({
  steps, activeField, onStepChange, onAddStep, onRemoveStep, onActiveFieldChange,
}: Props) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h2 style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
          Outreach sequence
        </h2>
        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{steps.length} steps</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {steps.map((step, i) => (
          <div key={i}>
            {i > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
                <div style={{ flex: 1, height: "0.5px", background: "var(--color-border-tertiary)" }} />
                <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>
                  {step.delayDays} day{step.delayDays !== 1 ? "s" : ""} later if no reply
                </span>
                <div style={{ flex: 1, height: "0.5px", background: "var(--color-border-tertiary)" }} />
              </div>
            )}
            <StepEditor
              step={step} index={i} total={steps.length}
              activeField={activeField}
              onChange={(s) => onStepChange(i, s)}
              onRemove={() => onRemoveStep(i)}
              onActiveFieldChange={onActiveFieldChange}
            />
          </div>
        ))}
      </div>

      <button onClick={onAddStep} style={{
        marginTop: 12, width: "100%", padding: "10px",
        borderRadius: "var(--border-radius-md)",
        border: "0.5px dashed var(--color-border-secondary)",
        background: "transparent", cursor: "pointer",
        fontSize: 14, color: "var(--color-text-secondary)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add follow-up step
      </button>
    </div>
  );
}

// co-located — only used inside SequenceBuilder
function StepEditor({ step, index, total, activeField, onChange, onRemove, onActiveFieldChange }: {
  step: SequenceStep; index: number; total: number;
  activeField: string | null;
  onChange: (s: SequenceStep) => void;
  onRemove: () => void;
  onActiveFieldChange: (f: string | null) => void;
}) {
  const insertVar = (varKey: string) => {
    const field = activeField === `${index}-subject` ? "subjectTemplate" : "bodyTemplate";
    onChange({ ...step, [field]: step[field] + varKey });
  };

  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-lg)", overflow: "hidden",
    }}>
      {/* Step header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px", borderBottom: "0.5px solid var(--color-border-tertiary)",
        background: "var(--color-background-secondary)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#0F6E56",
            color: "white", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 500, flexShrink: 0 }}>
            {index + 1}
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>
            {index === 0 ? "Initial email" : "Follow-up email"}
          </span>
          {index > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>after</span>
              <input type="number" min={1} value={step.delayDays}
                onChange={(e) => onChange({ ...step, delayDays: parseInt(e.target.value) || 1 })}
                style={{ width: 44, padding: "3px 6px", textAlign: "center",
                  borderRadius: "var(--border-radius-md)",
                  border: "0.5px solid var(--color-border-secondary)",
                  background: "var(--color-background-primary)",
                  color: "var(--color-text-primary)", fontSize: 13 }} />
              <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>days if no reply</span>
            </div>
          )}
        </div>
        {total > 2 && (
          <button onClick={onRemove} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--color-text-tertiary)", padding: 4,
            display: "flex", alignItems: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={labelStyle}>SUBJECT LINE</label>
          <input type="text" value={step.subjectTemplate}
            onChange={(e) => onChange({ ...step, subjectTemplate: e.target.value })}
            onFocus={() => onActiveFieldChange(`${index}-subject`)}
            placeholder="e.g. Connecting with {{specialty}} specialists at {{affiliation}}"
            style={{
              width: "100%", padding: "8px 12px", borderRadius: "var(--border-radius-md)",
              border: `0.5px solid ${activeField === `${index}-subject` ? "#1D9E75" : "var(--color-border-secondary)"}`,
              background: "var(--color-background-secondary)",
              color: "var(--color-text-primary)", fontSize: 14,
              boxSizing: "border-box", outline: "none",
            }} />
        </div>

        <div>
          <label style={labelStyle}>EMAIL BODY</label>
          <textarea value={step.bodyTemplate}
            onChange={(e) => onChange({ ...step, bodyTemplate: e.target.value })}
            onFocus={() => onActiveFieldChange(`${index}-body`)}
            rows={6}
            placeholder={"Dear Dr. {{doctor_name}},\n\nI wanted to reach out regarding..."}
            style={{
              width: "100%", padding: "8px 12px", borderRadius: "var(--border-radius-md)",
              border: `0.5px solid ${activeField === `${index}-body` ? "#1D9E75" : "var(--color-border-secondary)"}`,
              background: "var(--color-background-secondary)",
              color: "var(--color-text-primary)", fontSize: 14,
              boxSizing: "border-box", resize: "vertical",
              fontFamily: "var(--font-sans)", lineHeight: 1.6, outline: "none",
            }} />
        </div>

        <div>
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", fontWeight: 500 }}>INSERT:</span>
          <div style={{ display: "inline-flex", flexWrap: "wrap", gap: 6, marginTop: 4, marginLeft: 8 }}>
            {TEMPLATE_VARIABLES.map((v) => (
              <button key={v} onClick={() => insertVar(v)} style={{
                padding: "3px 10px", fontSize: 12, fontWeight: 500, borderRadius: 99,
                background: "#E1F5EE", color: "#0F6E56", border: "0.5px solid #9FE1CB",
                cursor: "pointer", fontFamily: "var(--font-mono)",
              }}>
                {v}
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
  display: "block", marginBottom: 5, fontWeight: 500, letterSpacing: "0.06em",
};