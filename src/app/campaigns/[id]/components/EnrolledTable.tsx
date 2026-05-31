import type { Physician } from "@/app/types/physician";

const CONTACT_STATUSES = ["Contacted", "Replied", "Bounced", "Pending"] as const;
type ContactStatus = typeof CONTACT_STATUSES[number];

const STATUS_COLORS: Record<ContactStatus, { bg: string; text: string }> = {
    Contacted: { bg: "#E6F1FB", text: "#185FA5" },
    Replied:   { bg: "#E1F5EE", text: "#0F6E56" },
    Bounced:   { bg: "#FCEBEB", text: "#A32D2D" },
    Pending:   { bg: "#F1EFE8", text: "#5F5E5A" },
};

function seededRandom(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function getMockContactStatus(physicianId: string, campaignStatus: string, isRecentlyLaunched?: boolean): ContactStatus {
    if (campaignStatus === "draft") return "Pending";
    if (isRecentlyLaunched) return "Contacted";
    const r = seededRandom(physicianId.charCodeAt(0) + physicianId.charCodeAt(1));
    if (campaignStatus === "active") {
        if (r < 0.5) return "Contacted";
        if (r < 0.75) return "Replied";
        if (r < 0.85) return "Bounced";
        return "Pending";
    }
    if (r < 0.6) return "Replied";
    if (r < 0.85) return "Contacted";
    return "Bounced";
}

interface Props {
    physicians: Physician[];
    enrolled: number;
    campaignStatus: string;
    isRecentlyLaunched?: boolean;
    onBrowse: () => void;
}

export default function EnrolledTable({ physicians, enrolled, campaignStatus, isRecentlyLaunched, onBrowse }: Props) {
  // contact status summary counts
  const counts = physicians.reduce((acc, p) => {
    const s = getMockContactStatus(p.id, campaignStatus, isRecentlyLaunched);
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {} as Record<ContactStatus, number>);

  return (
    <>
      {/* Summary pills — only when active/completed */}
      {physicians.length > 0 && campaignStatus !== "draft" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {(["Contacted", "Replied", "Bounced"] as ContactStatus[]).map((s) => (
            <div key={s} style={{
              background: STATUS_COLORS[s].bg, borderRadius: "var(--border-radius-md)",
              padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: STATUS_COLORS[s].text }}>{s}</span>
              <span style={{ fontSize: 21, fontWeight: 500, color: STATUS_COLORS[s].text }}>{counts[s] ?? 0}</span>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)", overflow: "hidden",
      }}>
        <div style={{ padding: "14px 20px", borderBottom: "0.5px solid var(--color-border-tertiary)",
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
            Enrolled physicians
          </p>
          <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>{enrolled} total</span>
        </div>

        {physicians.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "var(--color-text-tertiary)", margin: 0 }}>
              No physicians enrolled in this campaign yet.
            </p>
            <button onClick={onBrowse} style={{ marginTop: 10, fontSize: 14, color: "#0F6E56",
              background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
              Browse physicians →
            </button>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                  {["Physician", "Specialty", "Affiliation", "Location", "Status"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left",
                      fontSize: 12, fontWeight: 500, color: "var(--color-text-tertiary)",
                      letterSpacing: "0.05em", background: "var(--color-background-secondary)" }}>
                      {h.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {physicians.map((p, i) => {
                  const status = getMockContactStatus(p.id, campaignStatus, isRecentlyLaunched);
                  const colors = STATUS_COLORS[status];
                  return (
                    <tr key={p.id} style={{
                      borderBottom: i < physicians.length - 1
                        ? "0.5px solid var(--color-border-tertiary)" : "none",
                    }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%",
                            background: "#E1F5EE", color: "#0F6E56",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 500, flexShrink: 0 }}>
                            {p.firstName[0]}{p.lastName[0]}
                          </div>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
                              Dr. {p.firstName} {p.lastName}
                            </p>
                            <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: 0 }}>
                              {p.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", color: "var(--color-text-secondary)", fontSize: 13 }}>
                        {p.specialty}
                      </td>
                      <td style={{ padding: "12px 16px", color: "var(--color-text-secondary)", fontSize: 13 }}>
                        {p.affiliation}
                      </td>
                      <td style={{ padding: "12px 16px", color: "var(--color-text-secondary)", fontSize: 13 }}>
                        {p.city}, {p.state}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ padding: "3px 10px", borderRadius: 99,
                          background: colors.bg, color: colors.text,
                          fontSize: 12, fontWeight: 500 }}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}