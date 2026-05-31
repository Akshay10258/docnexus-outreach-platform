"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme";
import CampaignForm from "../components/CampaignForm";
import SequenceBuilder from "../components/SequenceBuilder";
import PreviewPanel from "../components/PreviewPanel";
import type { SequenceStep } from "@/app/types/campaign";
import type { Physician } from "@/app/types/physician";
import type { AIPhysician } from "../components/SequenceBuilder";

const DEFAULT_STEPS: SequenceStep[] = [
    {
        stepNumber: 1,
        delayDays: 0,
        subjectTemplate: "Connecting with {{specialty}} specialists at {{affiliation}}",
        bodyTemplate: `Dear Dr. {{doctor_name}},\n\nI hope this message finds you well. I'm reaching out because our team works closely with leading {{specialty}} practitioners, and I believe there's an opportunity worth discussing with your team at {{affiliation}}.\n\nWould you be open to a brief 15-minute call this week?\n\nBest regards,\n{{sender_name}}\n{{sender_title}}\n{{sender_company}}`,
    },
    {
        stepNumber: 2,
        delayDays: 3,
        subjectTemplate: "Following up — Clinical resources for {{specialty}}",
        bodyTemplate: `Dear Dr. {{doctor_name}},\n\nI wanted to follow up on my previous message. I understand you're busy, so I'll keep this brief — we've been helping {{specialty}} teams at institutions like {{affiliation}} streamline their research and clinical workflows.\n\nWould a quick call work for you?\n\nBest regards,\n{{sender_name}}\n{{sender_title}}\n{{sender_company}}`,
    },
];

export default function NewCampaignPage() {
    const router = useRouter();
    const { theme, toggle } = useTheme();

    const [name, setName] = useState("");
    const [type, setType] = useState("cold_outbound");
    const [senderName, setSenderName] = useState("");
    const [senderTitle, setSenderTitle] = useState("");
    const [senderCompany, setSenderCompany] = useState("");
    const [steps, setSteps] = useState<SequenceStep[]>(DEFAULT_STEPS);
    const [activeField, setActiveField] = useState<string | null>(null);
    const [previewStep, setPreviewStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // physician selection
    const [allPhysicians, setAllPhysicians] = useState<Physician[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [physicianSearch, setPhysicianSearch] = useState("");
    const [showPhysicianPicker, setShowPhysicianPicker] = useState(false);
    const [selectedPhysicianIdx, setSelectedPhysicianIdx] = useState(0);

    // load all physicians on mount for the picker
    useEffect(() => {
        fetch("/api/physicians")
            .then((res) => res.json())
            .then(setAllPhysicians)
            .catch(() => {});
    }, []);

    const selectedPhysicians = allPhysicians.filter((p) => selectedIds.has(p.id));

    const togglePhysician = useCallback((id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }, []);

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

    const updateStep = (i: number, s: SequenceStep) =>
        setSteps((prev) => prev.map((step, idx) => (idx === i ? s : step)));

    const addStep = () =>
        setSteps((prev) => [...prev, { stepNumber: prev.length + 1, delayDays: 7, subjectTemplate: "", bodyTemplate: "" }]);

    const removeStep = (i: number) =>
        setSteps((prev) => prev.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, stepNumber: idx + 1 })));

    const handleSave = async (launch: boolean) => {
        if (!name.trim()) { setError("Campaign name is required"); return; }
        setSaving(true);
        setError("");
        try {
        const res = await fetch("/api/campaigns", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                name: name.trim(), 
                type, 
                senderName: senderName.trim(),
                senderTitle: senderTitle.trim(),
                senderCompany: senderCompany.trim(),
                enrolledPhysicianIds: Array.from(selectedIds), 
                sequences: steps 
            }),
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (launch) await fetch(`/api/campaigns/${data.id}/launch`, { method: "PATCH" });
        router.push(`/campaigns/${data.id}`);
        } catch {
        setError("Something went wrong. Please try again.");
        } finally {
        setSaving(false);
        }
    };

    // AI physician context from selected physician
    const selectedDoc = selectedPhysicians[selectedPhysicianIdx];
    const aiPhysician: AIPhysician | undefined = selectedDoc
        ? {
            name: `${selectedDoc.firstName} ${selectedDoc.lastName}`,
            specialty: selectedDoc.specialty,
            affiliation: selectedDoc.affiliation,
            city: selectedDoc.city,
        }
        : undefined;

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "var(--font-sans)", background: "var(--color-background-tertiary)" }}>
        {/* Left — Builder */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", borderRight: "0.5px solid var(--color-border-tertiary)" }}>
            <header style={{
            position: "sticky", top: 0, zIndex: 10,
            background: "var(--color-background-primary)",
            borderBottom: "0.5px solid var(--color-border-tertiary)",
            padding: "14px 28px", display: "flex", alignItems: "center", gap: 12,
            }}>
            <button onClick={() => router.push("/campaigns")} style={{
                background: "none", border: "none", cursor: "pointer",
                color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 5,
                fontSize: 14, padding: 0,
            }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m15 18-6-6 6-6" />
                </svg>
                Back
            </button>
            <span style={{ color: "var(--color-border-tertiary)" }}>|</span>
            <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)", flex: 1 }}>
                New Campaign
            </span>
            <ThemeToggle theme={theme} onToggle={toggle} />
            </header>

            <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 24 }}>
            <CampaignForm
                name={name} type={type} error={error}
                senderName={senderName} senderTitle={senderTitle} senderCompany={senderCompany}
                onNameChange={(v) => { setName(v); setError(""); }}
                onTypeChange={setType}
                onSenderNameChange={setSenderName}
                onSenderTitleChange={setSenderTitle}
                onSenderCompanyChange={setSenderCompany}
            />

            {/* Physician enrollment section */}
            <div style={{
                background: "var(--color-background-primary)",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: "var(--border-radius-lg)",
                padding: "16px 22px",
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", margin: 0 }}>
                        Enroll physicians
                    </h2>
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
                            <div key={p.id} onClick={() => setSelectedPhysicianIdx(i)} style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "4px 10px 4px 6px", borderRadius: 99,
                                border: `0.5px solid ${selectedPhysicianIdx === i ? "#1D9E75" : "var(--color-border-secondary)"}`,
                                background: selectedPhysicianIdx === i ? "#E1F5EE" : "var(--color-background-secondary)",
                                cursor: "pointer", transition: "all 0.15s",
                            }}>
                                <div style={{ width: 20, height: 20, borderRadius: "50%",
                                    background: selectedPhysicianIdx === i ? "#0F6E56" : "var(--color-background-tertiary)",
                                    color: selectedPhysicianIdx === i ? "white" : "var(--color-text-tertiary)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 9, fontWeight: 500, flexShrink: 0 }}>
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
                                <button onClick={(e) => { e.stopPropagation(); togglePhysician(p.id); }} style={{
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
                        No physicians enrolled yet. Click &quot;Add physicians&quot; to search and select.
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
                                    const isSelected = selectedIds.has(p.id);
                                    return (
                                        <div key={p.id} onClick={() => togglePhysician(p.id)}
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
                            {selectedIds.size} of {allPhysicians.length} selected
                        </div>
                    </div>
                )}
            </div>

            <SequenceBuilder
                steps={steps} activeField={activeField}
                campaignName={name} campaignType={type}
                physician={aiPhysician}
                onStepChange={updateStep} onAddStep={addStep}
                onRemoveStep={removeStep} onActiveFieldChange={setActiveField}
            />
            <div style={{ display: "flex", gap: 10, paddingBottom: 28 }}>
                <button onClick={() => handleSave(false)} disabled={saving} style={{
                flex: 1, padding: "10px", borderRadius: "var(--border-radius-md)",
                border: "0.5px solid var(--color-border-secondary)",
                background: "var(--color-background-secondary)",
                cursor: "pointer", fontSize: 14, fontWeight: 500,
                color: "var(--color-text-secondary)",
                }}>
                Save as draft
                </button>
                <button onClick={() => handleSave(true)} disabled={saving} style={{
                flex: 2, padding: "10px", borderRadius: "var(--border-radius-md)", border: "none",
                background: saving ? "var(--color-background-secondary)" : "#0F6E56",
                cursor: saving ? "not-allowed" : "pointer",
                fontSize: 14, fontWeight: 500,
                color: saving ? "var(--color-text-tertiary)" : "white",
                }}>
                {saving ? "Saving..." : "Launch campaign →"}
                </button>
            </div>
            </div>
        </div>

        {/* Right — Preview with physician selector */}
        <PreviewPanel
            steps={steps} previewStep={previewStep}
            onPreviewStepChange={setPreviewStep}
            physicians={selectedPhysicians}
            selectedPhysicianIndex={selectedPhysicianIdx}
            onPhysicianChange={setSelectedPhysicianIdx}
            senderName={senderName}
            senderTitle={senderTitle}
            senderCompany={senderCompany}
        />
        </div>
    );
    }

    function ThemeToggle({ theme, onToggle }: { theme: string; onToggle: () => void }) {
    return (
        <button onClick={onToggle} style={{
        width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-md)", cursor: "pointer", color: "var(--color-text-secondary)",
        }}>
        {theme === "light" ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
        ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
        )}
        </button>
    );
}