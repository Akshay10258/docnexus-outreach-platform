import type { SequenceStep } from "@/app/types/campaign";
import type { Physician } from "@/app/types/physician";

// default sample physician used when no enrolled physicians are available
const DEFAULT_PHYSICIAN = {
  doctor_name: "Sarah Johnson",
  first_name: "Sarah",
  specialty: "Oncology",
  affiliation: "Mayo Clinic",
  city: "Rochester",
  email: "sarah.johnson@example.com",
};

export interface PreviewPhysician {
  doctor_name: string;
  first_name: string;
  specialty: string;
  affiliation: string;
  city: string;
  email: string;
}

// convert a Physician from the database into a PreviewPhysician
export function toPreviewPhysician(p: Physician): PreviewPhysician {
  return {
    doctor_name: `${p.firstName} ${p.lastName}`,
    first_name: p.firstName,
    specialty: p.specialty,
    affiliation: p.affiliation,
    city: p.city,
    email: p.email,
  };
}

interface Props {
  steps: SequenceStep[];
  previewStep: number;
  onPreviewStepChange: (i: number) => void;
  physicians?: Physician[];
  selectedPhysicianIndex?: number;
  onPhysicianChange?: (index: number) => void;
  senderName?: string;
  senderTitle?: string;
  senderCompany?: string;
}

export default function PreviewPanel({ 
  steps, previewStep, onPreviewStepChange, physicians, selectedPhysicianIndex = 0, onPhysicianChange,
  senderName = "", senderTitle = "", senderCompany = ""
}: Props) {
  const current = steps[previewStep];

  // use the selected enrolled physician or fall back to default sample
  const hasPhysicians = physicians && physicians.length > 0;
  const doc = hasPhysicians
    ? toPreviewPhysician(physicians[selectedPhysicianIndex] || physicians[0])
    : DEFAULT_PHYSICIAN;

  const initials = doc.doctor_name.split(" ").map((n) => n[0]).join("").toUpperCase();

  function fillPreview(template: string) {
    return template
      .replace(/{{doctor_name}}/g, doc.doctor_name)
      .replace(/{{first_name}}/g, doc.first_name)
      .replace(/{{specialty}}/g, doc.specialty)
      .replace(/{{affiliation}}/g, doc.affiliation)
      .replace(/{{city}}/g, doc.city)
      .replace(/{{sender_name}}/g, senderName || "[Your Name]")
      .replace(/{{sender_title}}/g, senderTitle || "[Your Title]")
      .replace(/{{sender_company}}/g, senderCompany || "[Your Company]");
  }

  return (
    <div style={{
      width: 380, minWidth: 380,
      background: "var(--color-background-secondary)",
      display: "flex", flexDirection: "column", overflowY: "auto",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)",
        background: "var(--color-background-primary)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-tertiary)",
          margin: "0 0 8px", letterSpacing: "0.06em" }}>PREVIEW</p>
        <div style={{ display: "flex", gap: 6 }}>
          {steps.map((_, i) => (
            <button key={i} onClick={() => onPreviewStepChange(i)} style={{
              padding: "4px 12px", fontSize: 12, fontWeight: 500, borderRadius: 99,
              border: `0.5px solid ${previewStep === i ? "#1D9E75" : "var(--color-border-secondary)"}`,
              background: previewStep === i ? "#E1F5EE" : "var(--color-background-secondary)",
              color: previewStep === i ? "#0F6E56" : "var(--color-text-secondary)",
              cursor: "pointer",
            }}>
              Step {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Preview as — with physician selector when multiple are enrolled */}
      <div style={{ padding: "16px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: 0, fontWeight: 500 }}>
            PREVIEW AS
          </p>
          {hasPhysicians && physicians.length > 1 && (
            <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
              {selectedPhysicianIndex + 1} of {physicians.length}
            </span>
          )}
        </div>

        {/* Physician selector — shows when multiple enrolled physicians exist */}
        {hasPhysicians && physicians.length > 1 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E1F5EE",
                color: "#0F6E56", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 500, flexShrink: 0 }}>{initials}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
                  Dr. {doc.doctor_name}
                </p>
                <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: 0 }}>
                  {doc.specialty} · {doc.affiliation}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
              {physicians.map((p, i) => (
                <button key={p.id} onClick={() => onPhysicianChange?.(i)} style={{
                  padding: "4px 10px", fontSize: 11, fontWeight: 500, borderRadius: 99,
                  border: `0.5px solid ${selectedPhysicianIndex === i ? "#1D9E75" : "var(--color-border-secondary)"}`,
                  background: selectedPhysicianIndex === i ? "#E1F5EE" : "var(--color-background-primary)",
                  color: selectedPhysicianIndex === i ? "#0F6E56" : "var(--color-text-secondary)",
                  cursor: "pointer", transition: "all 0.15s",
                }}>
                  {p.firstName} {p.lastName[0]}.
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E1F5EE",
              color: "#0F6E56", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 500 }}>{initials}</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
                Dr. {doc.doctor_name}
              </p>
              <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: 0 }}>
                {doc.specialty} · {doc.affiliation}
              </p>
            </div>
          </div>
        )}

        {!hasPhysicians && (
          <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: "8px 0 0", fontStyle: "italic" }}>
            Sample physician — enroll physicians to preview with real data
          </p>
        )}
      </div>

      {/* Email mock */}
      <div style={{ padding: "20px", flex: 1 }}>
        <div style={{
          background: "var(--color-background-primary)",
          borderRadius: "var(--border-radius-lg)",
          border: "0.5px solid var(--color-border-tertiary)", overflow: "hidden",
        }}>
          {/* Chrome bar */}
          <div style={{ padding: "12px 16px", borderBottom: "0.5px solid var(--color-border-tertiary)",
            background: "var(--color-background-secondary)" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {["#F09595", "#FAC775", "#97C459"].map((c) => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", minWidth: 24 }}>To:</span>
              <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                {doc.email}
              </span>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
              <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", minWidth: 24 }}>Sub:</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)" }}>
                {current?.subjectTemplate
                  ? fillPreview(current.subjectTemplate)
                  : <span style={{ color: "var(--color-text-tertiary)", fontStyle: "italic" }}>No subject yet</span>}
              </span>
            </div>
          </div>
          <div style={{ padding: "16px", fontSize: 13, color: "var(--color-text-secondary)",
            lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {current?.bodyTemplate
              ? fillPreview(current.bodyTemplate)
              : <span style={{ color: "var(--color-text-tertiary)", fontStyle: "italic" }}>
                  Start writing to see preview...
                </span>}
          </div>
        </div>

        {previewStep > 0 && (
          <div style={{ marginTop: 12, padding: "10px 14px", background: "#FAEEDA",
            borderRadius: "var(--border-radius-md)", border: "0.5px solid #FAC775" }}>
            <p style={{ fontSize: 12, color: "#854F0B", margin: 0, fontWeight: 500 }}>
              Sends {steps[previewStep]?.delayDays} day{steps[previewStep]?.delayDays !== 1 ? "s" : ""} after step {previewStep} if no reply
            </p>
          </div>
        )}
      </div>
    </div>
  );
}