import { useState, useEffect, useRef } from "react";
import { DEFAULT_SEQUENCES } from "@/app/constants/campaigns";

interface Props {
    selectedCount: number;
    selectedIds: string[];
    onClose: () => void;
    onSuccess: (campaignId: string) => void;
}

export default function SaveCampaignModal({ selectedCount, selectedIds, onClose, onSuccess }: Props) {
    const [campaignName, setCampaignName] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { inputRef.current?.focus(); }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    const handleSave = async () => {
        if (!campaignName.trim() || saving) return;
        setSaving(true);
        setError(null);
        try {
        const res = await fetch("/api/campaigns", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            name: campaignName.trim(),
            type: "cold_outbound",
            enrolledPhysicianIds: selectedIds,
            sequences: DEFAULT_SEQUENCES,
            }),
        });
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        onSuccess(data.id);
        } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
        setSaving(false);
        }
    };

    const canSubmit = campaignName.trim().length > 0 && !saving;

    return (
        <div role="dialog" aria-modal="true" aria-labelledby="modal-title"
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
        onClick={onClose}>
        <div style={{ background: "var(--color-background-primary)",
            borderRadius: "var(--border-radius-lg)",
            border: "0.5px solid var(--color-border-secondary)",
            padding: "28px", width: 400, maxWidth: "90vw" }}
            onClick={(e) => e.stopPropagation()}>

            <h2 id="modal-title" style={{ fontSize: 17, fontWeight: 500,
            margin: "0 0 6px", color: "var(--color-text-primary)" }}>
            Add to campaign
            </h2>
            <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: "0 0 20px" }}>
            Create a new outreach campaign with{" "}
            <strong style={{ fontWeight: 500 }}>{selectedCount}</strong>{" "}
            physician{selectedCount !== 1 ? "s" : ""}.
            </p>

            <label htmlFor="campaign-name" style={{ fontSize: 13, color: "var(--color-text-tertiary)",
            display: "block", marginBottom: 6, fontWeight: 500 }}>
            CAMPAIGN NAME
            </label>
            <input ref={inputRef} id="campaign-name" type="text"
            placeholder="e.g. Q3 Oncology Outreach"
            value={campaignName}
            onChange={(e) => { setCampaignName(e.target.value); setError(null); }}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            style={{ width: "100%", padding: "9px 12px", borderRadius: "var(--border-radius-md)",
                border: `0.5px solid ${error ? "#A32D2D" : "var(--color-border-secondary)"}`,
                background: "var(--color-background-secondary)",
                color: "var(--color-text-primary)", fontSize: 14,
                boxSizing: "border-box", marginBottom: error ? 6 : 20 }} />

            {error && (
            <p style={{ fontSize: 13, color: "#A32D2D", margin: "0 0 14px" }}>{error}</p>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={onClose} style={{ padding: "8px 16px", fontSize: 14,
                background: "var(--color-background-secondary)",
                border: "0.5px solid var(--color-border-secondary)",
                borderRadius: "var(--border-radius-md)", cursor: "pointer",
                color: "var(--color-text-secondary)" }}>
                Cancel
            </button>
            <button onClick={handleSave} disabled={!canSubmit}
                style={{ padding: "8px 18px", fontSize: 14, fontWeight: 500,
                background: canSubmit ? "#0F6E56" : "var(--color-background-secondary)",
                color: canSubmit ? "white" : "var(--color-text-tertiary)",
                border: "none", borderRadius: "var(--border-radius-md)",
                cursor: canSubmit ? "pointer" : "not-allowed",
                transition: "background 0.15s, color 0.15s" }}>
                {saving ? "Creating..." : "Create campaign"}
            </button>
            </div>
        </div>
        </div>
    );
}