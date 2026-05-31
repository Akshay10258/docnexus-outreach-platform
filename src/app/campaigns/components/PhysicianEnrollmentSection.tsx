import { useState } from "react";
import type { Physician } from "@/app/types/physician";

interface Props {
    allPhysicians: Physician[];
    selectedPhysicians: Physician[];
    selectedPhysicianIdx: number;
    onTogglePhysician: (id: string) => void;
    onSelectPhysicianIdx: (index: number) => void;
}

export default function PhysicianEnrollmentSection({
    allPhysicians,
    selectedPhysicians,
    selectedPhysicianIdx,
    onTogglePhysician,
    onSelectPhysicianIdx
}: Props) {
    const [showPhysicianPicker, setShowPhysicianPicker] = useState(false);
    const [physicianSearch, setPhysicianSearch] = useState("");

    const filteredPhysicians = allPhysicians.filter((p) => {
        const q = physicianSearch.toLowerCase();
        if (!q) return true;
        return (
            p.firstName.toLowerCase().includes(q) ||
            p.lastName.toLowerCase().includes(q) ||
            p.specialty.toLowerCase().includes(q) ||
            p.affiliation.toLowerCase().includes(q)
        );
    });

    return (
        <div style={{
            background: "var(--color-background-primary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-lg)",
            padding: "16px 22px",
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: selectedPhysicians.length > 0 ? 12 : 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
                        Enrolled physicians
                    </h2>
                    {selectedPhysicians.length > 0 && (
                        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
                            {selectedPhysicians.length} selected
                        </span>
                    )}
                </div>
                <button onClick={() => setShowPhysicianPicker(!showPhysicianPicker)} style={{
                    padding: "5px 12px", fontSize: 12, fontWeight: 500, borderRadius: 99,
                    background: showPhysicianPicker ? "#FCEBEB" : "#E1F5EE",
                    color: showPhysicianPicker ? "#A32D2D" : "#0F6E56",
                    border: `0.5px solid ${showPhysicianPicker ? "#E8A4A4" : "#9FE1CB"}`,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                }}>
                    {showPhysicianPicker ? (
                        <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                            Close
                        </>
                    ) : (
                        <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            Add physicians
                        </>
                    )}
                </button>
            </div>
            
            {/* Selected physicians chips */}
            {selectedPhysicians.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: showPhysicianPicker ? 12 : 0 }}>
                    {selectedPhysicians.map((p, i) => (
                        <div key={p.id} onClick={() => onSelectPhysicianIdx(i)}
                            style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "4px 10px 4px 6px", borderRadius: 99,
                                border: `0.5px solid ${selectedPhysicianIdx === i ? "#1D9E75" : "var(--color-border-secondary)"}`,
                                background: selectedPhysicianIdx === i ? "#E1F5EE" : "var(--color-background-secondary)",
                                cursor: "pointer", transition: "all 0.15s",
                            }}>
                            <div style={{
                                width: 20, height: 20, borderRadius: "50%",
                                background: selectedPhysicianIdx === i ? "#0F6E56" : "var(--color-background-tertiary)",
                                color: selectedPhysicianIdx === i ? "white" : "var(--color-text-tertiary)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 9, fontWeight: 500, flexShrink: 0
                            }}>
                                {p.firstName[0]}{p.lastName[0]}
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 500,
                                color: selectedPhysicianIdx === i ? "#0F6E56" : "var(--color-text-secondary)" }}>
                                Dr. {p.firstName} {p.lastName[0]}.
                            </span>
                            <span style={{ fontSize: 11,
                                color: selectedPhysicianIdx === i ? "#1D9E75" : "var(--color-text-tertiary)" }}>
                                {p.specialty}
                            </span>
                            <button onClick={(e) => { e.stopPropagation(); onTogglePhysician(p.id); }} style={{
                                background: "none", border: "none", cursor: "pointer", padding: 0, marginLeft: 2,
                                color: "var(--color-text-tertiary)", display: "flex", alignItems: "center",
                            }}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            {selectedPhysicians.length === 0 && !showPhysicianPicker && (
                <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", margin: 0 }}>
                    No physicians enrolled yet. Click "Add physicians" to search and select.
                </p>
            )}

            {/* Expandable physician picker */}
            {showPhysicianPicker && (
                <div style={{
                    border: "0.5px solid var(--color-border-tertiary)",
                    borderRadius: "var(--border-radius-md)",
                    overflow: "hidden",
                }}>
                    <div style={{ padding: "8px 12px", background: "var(--color-background-secondary)",
                        borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                        <input
                            type="text"
                            placeholder="Search by name, specialty, or affiliation..."
                            value={physicianSearch}
                            onChange={(e) => setPhysicianSearch(e.target.value)}
                            style={{
                                width: "100%", padding: "6px 10px", borderRadius: "var(--border-radius-md)",
                                border: "0.5px solid var(--color-border-secondary)",
                                background: "var(--color-background-primary)",
                                color: "var(--color-text-primary)", fontSize: 13,
                                boxSizing: "border-box", outline: "none",
                            }}
                        />
                    </div>
                    <div style={{ maxHeight: 220, overflowY: "auto" }}>
                        {filteredPhysicians.length === 0 ? (
                            <p style={{ padding: "16px", textAlign: "center", fontSize: 13,
                                color: "var(--color-text-tertiary)", margin: 0 }}>
                                No physicians found
                            </p>
                        ) : (
                            filteredPhysicians.map((p) => {
                                const isSelected = selectedPhysicians.some(doc => doc.id === p.id);
                                return (
                                    <div key={p.id} onClick={() => onTogglePhysician(p.id)}
                                        style={{
                                            display: "flex", alignItems: "center", gap: 10,
                                            padding: "8px 14px", cursor: "pointer",
                                            borderBottom: "0.5px solid var(--color-border-tertiary)",
                                            background: isSelected ? "#E1F5EE" : "var(--color-background-primary)",
                                            transition: "background 0.1s",
                                        }}>
                                        {/* Checkbox */}
                                        <div style={{
                                            width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                                            border: `1.5px solid ${isSelected ? "#0F6E56" : "var(--color-border-secondary)"}`,
                                            background: isSelected ? "#0F6E56" : "transparent",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            {isSelected && (
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                                    <path d="M20 6 9 17l-5-5" />
                                                </svg>
                                            )}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: 13, fontWeight: 500, margin: 0,
                                                color: isSelected ? "#0F6E56" : "var(--color-text-primary)" }}>
                                                Dr. {p.firstName} {p.lastName}
                                            </p>
                                            <p style={{ fontSize: 11, margin: 0,
                                                color: isSelected ? "#1D9E75" : "var(--color-text-tertiary)" }}>
                                                {p.specialty} · {p.affiliation} · {p.city}, {p.state}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div style={{ padding: "8px 14px", background: "var(--color-background-secondary)",
                        borderTop: "0.5px solid var(--color-border-tertiary)",
                        fontSize: 12, color: "var(--color-text-tertiary)" }}>
                        {selectedPhysicians.length} of {allPhysicians.length} selected
                    </div>
                </div>
            )}
        </div>
    );
}
