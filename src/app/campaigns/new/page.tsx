"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme";
import CampaignForm from "../components/CampaignForm";
import SequenceBuilder from "../components/SequenceBuilder";
import PreviewPanel from "../components/PreviewPanel";
import PhysicianEnrollmentSection from "../components/PhysicianEnrollmentSection";
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

    const updateStep = (i: number, s: SequenceStep) =>
        setSteps((prev) => prev.map((step, idx) => (idx === i ? s : step)));

    const addStep = () =>
        setSteps((prev) => [...prev, { stepNumber: prev.length + 1, delayDays: 7, subjectTemplate: "", bodyTemplate: "" }]);

    const removeStep = (i: number) =>
        setSteps((prev) => prev.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, stepNumber: idx + 1 })));

    const handleSave = async (launch: boolean) => {
        if (!name.trim()) { setError("Campaign name is required"); return; }
        if (!senderName.trim()) { setError("Sender name is required"); return; }
        if (!senderTitle.trim()) { setError("Sender title is required"); return; }
        if (!senderCompany.trim()) { setError("Sender company is required"); return; }
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
                onSenderNameChange={(v) => { setSenderName(v); setError(""); }}
                onSenderTitleChange={(v) => { setSenderTitle(v); setError(""); }}
                onSenderCompanyChange={(v) => { setSenderCompany(v); setError(""); }}
            />

            <PhysicianEnrollmentSection
                allPhysicians={allPhysicians}
                selectedPhysicians={selectedPhysicians}
                selectedPhysicianIdx={selectedPhysicianIdx}
                onTogglePhysician={togglePhysician}
                onSelectPhysicianIdx={setSelectedPhysicianIdx}
            />

            <SequenceBuilder
                steps={steps} activeField={activeField}
                campaignName={name} campaignType={type}
                physician={aiPhysician}
                onStepChange={updateStep} onAddStep={addStep}
                onRemoveStep={removeStep} onActiveFieldChange={setActiveField}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 28 }}>
                {error && (
                    <div style={{ padding: "10px 14px", background: "#FDE8E8", border: "0.5px solid #F9C9C9", borderRadius: "var(--border-radius-md)", color: "#A32D2D", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                        ⚠️ Please fix the following error before saving: {error}
                    </div>
                )}
                <div style={{ display: "flex", gap: 10 }}>
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