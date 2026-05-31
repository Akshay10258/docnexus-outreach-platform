import { memo, useState } from "react";
import { getSpecialtyColors, getInitials, getExperience } from "@/app/constants/physician";
import type { Physician } from "@/app/types/physician";

interface Props {
    physician: Physician;
    isSelected: boolean;
    onToggle: (id: string) => void;
}

function PhysicianCard({ physician: p, isSelected, onToggle }: Props) {
    const [showHistory, setShowHistory] = useState(false);
    const { color, bg } = getSpecialtyColors(p.specialty);
    const exp = getExperience(p.npiRegistrationYear);
    const initials = getInitials(p.firstName, p.lastName);
    const hasHistory = p.history && p.history.length > 0;

    return (
        <div style={{
            background: "var(--color-background-primary)",
            borderRadius: "var(--border-radius-lg)",
            border: `0.5px solid ${isSelected ? "#1D9E75" : "var(--color-border-tertiary)"}`,
            boxShadow: isSelected ? "0 0 0 2px #E1F5EE" : "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
            overflow: "hidden"
        }}>
            <div
            role="row" aria-selected={isSelected}
            onClick={() => onToggle(p.id)}
            style={{
                display: "flex", alignItems: "center", gap: 16, padding: "14px 18px",
                cursor: "pointer",
            }}
            >
        <input type="checkbox" checked={isSelected}
            onChange={() => onToggle(p.id)} onClick={(e) => e.stopPropagation()}
            aria-label={`Select Dr. ${p.firstName} ${p.lastName}`}
            style={{ accentColor: "#0F6E56", cursor: "pointer", flexShrink: 0 }} />

        <div style={{ width: 44, height: 44, borderRadius: "50%", background: bg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 500, color, flexShrink: 0 }}>
            {initials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>
                Dr. {p.firstName} {p.lastName}
            </span>
            {p.boardCertified && <Badge color="#0F6E56" bg="#E1F5EE">Board Certified</Badge>}
            {!p.acceptingPatients && <Badge color="#A32D2D" bg="#FDE8E8">Not Accepting</Badge>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 3, flexWrap: "wrap" }}>
            <Badge color={color} bg={bg}>{p.specialty}</Badge>
            {p.subSpecialty && (
                <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>· {p.subSpecialty}</span>
            )}
            </div>
        </div>

        <div style={{ width: 180, flexShrink: 0 }}>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0, fontWeight: 500 }}>
            {p.affiliation}
            </p>
            <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "2px 0 0" }}>
            {p.city}, {p.state}
            </p>
        </div>

        <div style={{ width: 180, flexShrink: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
            {p.activeCampaignCount ? (
                <span style={{ fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 6, background: "#FAEEDA", color: "#854F0B", border: "0.5px solid #E5C392", whiteSpace: "nowrap" }}>
                    ⚠️ Active in {p.activeCampaignCount} Campaign{p.activeCampaignCount > 1 ? "s" : ""}
                </span>
            ) : null}
        </div>

        <div style={{ textAlign: "right", width: 80, flexShrink: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>{exp} yrs</p>
            <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "2px 0 0" }}>experience</p>
        </div>

        <div style={{ textAlign: "right", width: 90, flexShrink: 0 }}>
            <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: 0, letterSpacing: "0.04em" }}>NPI</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)",
            margin: "2px 0 0", fontFamily: "var(--font-mono)" }}>{p.npi}</p>
        </div>

        <div style={{ borderLeft: "0.5px solid var(--color-border-tertiary)", paddingLeft: 16, display: "flex", alignItems: "center" }}>
            <button onClick={(e) => { e.stopPropagation(); setShowHistory(!showHistory); }} style={{
                border: "none", cursor: "pointer", padding: "6px 12px",
                borderRadius: "var(--border-radius-sm)", color: showHistory ? "#0F6E56" : "var(--color-text-secondary)",
                fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 6,
                background: showHistory ? "#E1F5EE" : "var(--color-background-secondary)",
            }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                </svg>
                History {hasHistory ? `(${p.history!.length})` : ""}
            </button>
        </div>
        </div>

        {/* History Dropdown Section */}
        {showHistory && (
            <div style={{
                borderTop: "0.5px solid var(--color-border-tertiary)",
                background: "var(--color-background-secondary)",
                padding: "16px 24px",
            }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", margin: "0 0 12px 0" }}>
                    Campaign Engagement History
                </h4>
                
                {hasHistory ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {p.history!.map((campaign) => (
                            <div key={campaign.id} style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "10px 14px", background: "var(--color-background-primary)",
                                borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
                                        background: campaign.status === 'completed' ? '#E1F5EE' : campaign.status === 'active' ? '#E6F0FD' : '#F3F4F6',
                                        color: campaign.status === 'completed' ? '#0F6E56' : campaign.status === 'active' ? '#1D4ED8' : '#6B7280',
                                        textTransform: "uppercase"
                                    }}>
                                        {campaign.status}
                                    </span>
                                    <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
                                        {campaign.name}
                                    </span>
                                </div>
                                <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
                                    {new Date(campaign.date).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", margin: 0 }}>
                        No past campaign interactions found for this physician.
                    </p>
                )}
            </div>
        )}
        </div>
    );
}

function Badge({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
    return (
        <span style={{ fontSize: 11, fontWeight: 500, padding: "2px 7px",
        borderRadius: 99, background: bg, color }}>
        {children}
        </span>
    );
}

export default memo(PhysicianCard);