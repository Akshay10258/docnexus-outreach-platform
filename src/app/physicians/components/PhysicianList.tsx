import type { Physician } from "@/app/types/physician";
import PhysicianCard from "./PhysicianCard";

interface Props {
    physicians: Physician[];
    loading: boolean;
    error: string | null;
    selected: Set<string>;
    isAllSelected: boolean;
    onToggleSelect: (id: string) => void;
    onToggleAll: () => void;
    onClearSelection: () => void;
    onClearFilters: () => void;
    onSaveClick: () => void;
}

export default function PhysicianList({
    physicians, loading, error, selected, isAllSelected,
    onToggleSelect, onToggleAll, onClearSelection, onClearFilters, onSaveClick,
    }: Props) {
    return (
        <>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>

            {!loading && !error && physicians.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
                padding: "8px 14px", background: "var(--color-background-primary)",
                borderRadius: "var(--border-radius-md)", border: "0.5px solid var(--color-border-tertiary)" }}>
                <input type="checkbox" checked={isAllSelected} onChange={onToggleAll}
                aria-label="Select all physicians"
                style={{ accentColor: "#0F6E56", cursor: "pointer" }} />
                <span style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
                {isAllSelected
                    ? `All ${physicians.length} physicians selected`
                    : `Select all ${physicians.length} physicians`}
                </span>
            </div>
            )}

            {loading && <LoadingSkeleton />}
            {!loading && error && <ErrorState message={error} />}
            {!loading && !error && physicians.length === 0 && (
            <EmptyState onClearFilters={onClearFilters} />
            )}
            {!loading && !error && physicians.length > 0 && (
            <div role="grid" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {physicians.map((p) => (
                <PhysicianCard key={p.id} physician={p}
                    isSelected={selected.has(p.id)} onToggle={onToggleSelect} />
                ))}
            </div>
            )}
        </div>

        {selected.size > 0 && (
            <SelectionBar count={selected.size} onClear={onClearSelection} onSave={onSaveClick} />
        )}

        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
        </>
    );
    }

    function LoadingSkeleton() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ height: 88, borderRadius: "var(--border-radius-lg)",
            background: "var(--color-background-secondary)",
            animation: "pulse 1.5s ease-in-out infinite" }} />
        ))}
        </div>
    );
    }

    function ErrorState({ message }: { message: string }) {
    return (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
        <p style={{ fontSize: 15, margin: 0, color: "#A32D2D" }}>Failed to load physicians</p>
        <p style={{ fontSize: 13, marginTop: 4, color: "var(--color-text-tertiary)" }}>{message}</p>
        </div>
    );
    }

    function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
    return (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--color-text-tertiary)" }}>
        <p style={{ fontSize: 15, margin: 0 }}>No physicians match your filters</p>
        <button onClick={onClearFilters} style={{ marginTop: 10, fontSize: 14, color: "#0F6E56",
            background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
            Clear filters
        </button>
        </div>
    );
    }

    function SelectionBar({ count, onClear, onSave }: {
    count: number; onClear: () => void; onSave: () => void;
    }) {
    return (
        <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", padding: "12px 28px",
        background: "var(--color-background-primary)",
        display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
            <span style={{ fontWeight: 500, color: "#0F6E56" }}>{count}</span>{" "}
            physician{count !== 1 ? "s" : ""} selected
        </span>
        <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClear} style={{ padding: "7px 14px", fontSize: 14,
            background: "var(--color-background-secondary)",
            border: "0.5px solid var(--color-border-secondary)",
            borderRadius: "var(--border-radius-md)", cursor: "pointer",
            color: "var(--color-text-secondary)" }}>
            Clear selection
            </button>
            <button onClick={onSave} style={{ padding: "7px 18px", fontSize: 14, fontWeight: 500,
            background: "#0F6E56", color: "white", border: "none",
            borderRadius: "var(--border-radius-md)", cursor: "pointer" }}>
            Save &amp; Add to Campaign →
            </button>
        </div>
        </div>
    );
}