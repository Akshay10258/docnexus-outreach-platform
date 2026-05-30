import { memo } from "react";
import { getSpecialtyColors, getInitials, getExperience } from "@/app/constants/physician";
import type { Physician } from "@/app/types/physician";

interface Props {
    physician: Physician;
    isSelected: boolean;
    onToggle: (id: string) => void;
}

function PhysicianCard({ physician: p, isSelected, onToggle }: Props) {
    const { color, bg } = getSpecialtyColors(p.specialty);
    const exp = getExperience(p.npiRegistrationYear);
    const initials = getInitials(p.firstName, p.lastName);

    return (
        <div
        role="row" aria-selected={isSelected}
        onClick={() => onToggle(p.id)}
        style={{
            display: "flex", alignItems: "center", gap: 16, padding: "14px 18px",
            background: "var(--color-background-primary)",
            borderRadius: "var(--border-radius-lg)",
            border: `0.5px solid ${isSelected ? "#1D9E75" : "var(--color-border-tertiary)"}`,
            cursor: "pointer",
            boxShadow: isSelected ? "0 0 0 2px #E1F5EE" : "none",
            transition: "border-color 0.15s, box-shadow 0.15s",
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
            {!p.acceptingPatients && <Badge color="#854F0B" bg="#FAEEDA">Not Accepting</Badge>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 3, flexWrap: "wrap" }}>
            <Badge color={color} bg={bg}>{p.specialty}</Badge>
            {p.subSpecialty && (
                <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>· {p.subSpecialty}</span>
            )}
            </div>
        </div>

        <div style={{ minWidth: 160, maxWidth: 200 }}>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0, fontWeight: 500 }}>
            {p.affiliation}
            </p>
            <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "2px 0 0" }}>
            {p.city}, {p.state}
            </p>
        </div>

        <div style={{ textAlign: "right", minWidth: 80 }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>{exp} yrs</p>
            <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "2px 0 0" }}>experience</p>
        </div>

        <div style={{ textAlign: "right", minWidth: 100 }}>
            <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", margin: 0, letterSpacing: "0.04em" }}>NPI</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)",
            margin: "2px 0 0", fontFamily: "var(--font-mono)" }}>{p.npi}</p>
        </div>
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