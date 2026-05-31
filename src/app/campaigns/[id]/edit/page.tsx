"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme";
import CampaignForm from "../../components/CampaignForm";
import SequenceBuilder from "../../components/SequenceBuilder";
import PreviewPanel from "../../components/PreviewPanel";
import PhysicianEnrollmentSection from "../../components/PhysicianEnrollmentSection";
import type { SequenceStep } from "@/app/types/campaign";
import type { Physician } from "@/app/types/physician";
import type { AIPhysician } from "../../components/SequenceBuilder";

export default function EditCampaignPage() {
    const params = useParams();
    const router = useRouter();
    const { theme, toggle } = useTheme();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [type, setType] = useState("cold_outbound");
    const [senderName, setSenderName] = useState("");
    const [senderTitle, setSenderTitle] = useState("");
    const [senderCompany, setSenderCompany] = useState("");
    const [steps, setSteps] = useState<SequenceStep[]>([]);
    const [activeField, setActiveField] = useState<string | null>(null);
    const [previewStep, setPreviewStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // enrolled physicians and selection
    const [physicians, setPhysicians] = useState<Physician[]>([]);
    const [selectedPhysicianIdx, setSelectedPhysicianIdx] = useState(0);
    
    // picker states
    const [allPhysicians, setAllPhysicians] = useState<Physician[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`/api/campaigns/${id}`);
                if (!res.ok) throw new Error("Not found");
                const campaign = await res.json();

                setName(campaign.name);
                setType(campaign.type);
                if (campaign.senderName) setSenderName(campaign.senderName);
                if (campaign.senderTitle) setSenderTitle(campaign.senderTitle);
                if (campaign.senderCompany) setSenderCompany(campaign.senderCompany);
                setSteps(
                    campaign.sequences
                        .sort((a: SequenceStep, b: SequenceStep) => a.stepNumber - b.stepNumber)
                        .map((s: SequenceStep) => ({
                            stepNumber: s.stepNumber,
                            delayDays: s.delayDays,
                            subjectTemplate: s.subjectTemplate,
                            bodyTemplate: s.bodyTemplate,
                        }))
                );

                // load enrolled physicians
                const rawIds = campaign.enrolledPhysicianIds;
                const idsArray = Array.isArray(rawIds) 
                    ? rawIds.map(id => String(id).trim()) 
                    : (typeof rawIds === "string" && rawIds.trim().length > 0 ? rawIds.split(",").map(id => id.trim()) : []);
                
                const allRes = await fetch("/api/physicians", { cache: "no-store" });
                const all: Physician[] = await allRes.json();
                setAllPhysicians(all);
                
                if (idsArray.length > 0 && idsArray[0] !== "") {
                    setPhysicians(all.filter((p) => idsArray.includes(p.id)));
                }
            } catch {
                router.push("/campaigns");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, router]);

    const togglePhysician = (id: string) => {
        setPhysicians((prev) => {
            if (prev.some(p => p.id === id)) {
                return prev.filter(p => p.id !== id);
            }
            const doc = allPhysicians.find(p => p.id === id);
            return doc ? [...prev, doc] : prev;
        });
    };

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
            const res = await fetch(`/api/campaigns/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    type,
                    senderName: senderName.trim(),
                    senderTitle: senderTitle.trim(),
                    senderCompany: senderCompany.trim(),
                    enrolledPhysicianIds: physicians.map(p => p.id),
                    sequences: steps
                }),
            });
            if (!res.ok) throw new Error("Failed");
            if (launch) await fetch(`/api/campaigns/${id}/launch`, { method: "PATCH" });
            router.push(`/campaigns/${id}`);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    // build AI physician context from the currently selected enrolled physician
    const selectedDoc = physicians[selectedPhysicianIdx];
    const aiPhysician: AIPhysician | undefined = selectedDoc
        ? {
            name: `${selectedDoc.firstName} ${selectedDoc.lastName}`,
            specialty: selectedDoc.specialty,
            affiliation: selectedDoc.affiliation,
            city: selectedDoc.city,
        }
        : undefined;

    if (loading) {
        return (
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                height: "100vh", background: "var(--color-background-tertiary)", fontFamily: "var(--font-sans)"
            }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        border: "2px solid #E1F5EE", borderTop: "2px solid #0F6E56",
                        animation: "spin 0.8s linear infinite"
                    }} />
                    <span style={{ fontSize: 14, color: "var(--color-text-tertiary)" }}>Loading campaign...</span>
                </div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

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
                    <button onClick={() => router.push(`/campaigns/${id}`)} style={{
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
                        Edit Campaign
                    </span>
                    {physicians.length > 0 && (
                        <span style={{
                            fontSize: 12, color: "var(--color-text-tertiary)", background: "var(--color-background-secondary)",
                            padding: "4px 10px", borderRadius: 99, border: "0.5px solid var(--color-border-tertiary)"
                        }}>
                            {physicians.length} physician{physicians.length !== 1 ? "s" : ""} enrolled
                        </span>
                    )}
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

                    {/* Enrolled physicians summary */}
                    <PhysicianEnrollmentSection
                        allPhysicians={allPhysicians}
                        selectedPhysicians={physicians}
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
                            Save changes
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
                physicians={physicians}
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
