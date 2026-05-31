import { useState } from "react";
import { TEMPLATE_VARIABLES } from "@/app/constants/campaigns";
import type { SequenceStep } from "@/app/types/campaign";

export interface AIPhysician {
  name: string;
  specialty: string;
  affiliation: string;
  city: string;
}

interface Props {
  steps: SequenceStep[];
  activeField: string | null;
  campaignName: string;
  campaignType: string;
  physician?: AIPhysician;
  onStepChange: (i: number, s: SequenceStep) => void;
  onAddStep: () => void;
  onRemoveStep: (i: number) => void;
  onActiveFieldChange: (f: string | null) => void;
}

export default function SequenceBuilder({
  steps, activeField, campaignName, campaignType, physician, onStepChange, onAddStep, onRemoveStep, onActiveFieldChange,
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
              campaignName={campaignName}
              campaignType={campaignType}
              physician={physician}
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
function StepEditor({ step, index, total, activeField, campaignName, campaignType, physician, onChange, onRemove, onActiveFieldChange }: {
  step: SequenceStep; index: number; total: number;
  activeField: string | null;
  campaignName: string;
  campaignType: string;
  physician?: AIPhysician;
  onChange: (s: SequenceStep) => void;
  onRemove: () => void;
  onActiveFieldChange: (f: string | null) => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState("");

  const insertVar = (varKey: string) => {
    const field = activeField === `${index}-subject` ? "subjectTemplate" : "bodyTemplate";
    onChange({ ...step, [field]: step[field] + varKey });
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setAiError("");
    try {
      const res = await fetch("/api/generate-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignName: campaignName || "Healthcare Outreach",
          campaignType,
          stepNumber: index + 1,
          currentSubject: step.subjectTemplate,
          currentBody: step.bodyTemplate,
          physician: physician || {
            name: "Sarah Johnson",
            specialty: "Oncology",
            affiliation: "Mayo Clinic",
            city: "Rochester",
          },
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      onChange({ ...step, subjectTemplate: data.subjectTemplate, bodyTemplate: data.bodyTemplate });
    } catch {
      setAiError("AI generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };
  
  //validate the template variables so to prevent them from not getting resolved in the final mail
  const checkVariables = (text: string) => {
    const regex = /\{\{([^}]+)\}\}/g;
    let match;
    const invalidVars: string[] = [];
    while ((match = regex.exec(text)) !== null) {
      if (!TEMPLATE_VARIABLES.includes(`{{${match[1]}}}`)) {
        invalidVars.push(match[0]);
      }
    }
    return invalidVars;
  };

  const invalidSubjectVars = checkVariables(step.subjectTemplate);
  const invalidBodyVars = checkVariables(step.bodyTemplate);

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
          {invalidSubjectVars.length > 0 && (
            <p style={{ fontSize: 12, color: "#A32D2D", margin: "6px 0 0", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m10.29 3.86-7.5 13A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.71-3.14l-7.5-13a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Invalid variable(s): {invalidSubjectVars.join(", ")}
            </p>
          )}
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
          {invalidBodyVars.length > 0 && (
            <p style={{ fontSize: 12, color: "#A32D2D", margin: "6px 0 0", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m10.29 3.86-7.5 13A2 2 0 0 0 4.5 20h15a2 2 0 0 0 1.71-3.14l-7.5-13a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Invalid variable(s): {invalidBodyVars.join(", ")}
            </p>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
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
          <button onClick={handleGenerate} disabled={generating} style={{
            padding: "6px 14px", fontSize: 12, fontWeight: 600, borderRadius: 99,
            background: generating ? "var(--color-background-secondary)" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: generating ? "var(--color-text-tertiary)" : "white",
            border: "none", cursor: generating ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.2s", opacity: generating ? 0.7 : 1,
          }}>
            {generating ? (
              <>
                <span style={{ display: "inline-block", width: 12, height: 12, border: "2px solid #ccc",
                  borderTop: "2px solid #764ba2", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Generating…
              </>
            ) : (
              <>
                ✨ Generate with AI
              </>
            )}
          </button>
        </div>
        {aiError && (
          <p style={{ fontSize: 12, color: "#E24B4A", margin: "4px 0 0" }}>{aiError}</p>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 12, color: "var(--color-text-tertiary)",
  display: "block", marginBottom: 5, fontWeight: 500, letterSpacing: "0.06em",
};