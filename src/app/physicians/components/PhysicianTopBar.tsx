interface Props {
    search: string;
    onSearchChange: (v: string) => void;
    filteredCount: number;
    selectedCount: number;
    theme: string;
    onThemeToggle: () => void;
    onSaveClick: () => void;
}

export default function PhysicianTopBar({
    search, onSearchChange, filteredCount, selectedCount,
    theme, onThemeToggle, onSaveClick,
    }: Props) {
    return (
        <header style={{
        background: "var(--color-background-primary)",
        borderBottom: "0.5px solid var(--color-border-tertiary)",
        padding: "16px 28px", display: "flex", alignItems: "center", gap: 16,
        }}>
        <div style={{ flex: 1, position: "relative" }}>
            <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            color: "var(--color-text-tertiary)", pointerEvents: "none" }}
            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input type="text" placeholder="Search by name, NPI, affiliation, specialty..."
            value={search} onChange={(e) => onSearchChange(e.target.value)}
            style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: "var(--border-radius-md)",
                border: "0.5px solid var(--color-border-secondary)",
                background: "var(--color-background-secondary)",
                color: "var(--color-text-primary)", fontSize: 14, boxSizing: "border-box" }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
            background: "var(--color-background-secondary)", borderRadius: "var(--border-radius-md)",
            border: "0.5px solid var(--color-border-tertiary)", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
            <span style={{ fontWeight: 500, color: "var(--color-text-primary)" }}>
                {filteredCount.toLocaleString()}
            </span> physicians
            </span>
            {selectedCount > 0 && (
            <>
                <span style={{ color: "var(--color-border-secondary)" }}>—</span>
                <span style={{ fontSize: 14, color: "#0F6E56", fontWeight: 500 }}>{selectedCount} selected</span>
            </>
            )}
        </div>

        {selectedCount > 0 && (
            <button onClick={onSaveClick} style={{
            padding: "8px 18px", background: "#0F6E56", color: "white",
            border: "none", borderRadius: "var(--border-radius-md)",
            fontSize: 14, fontWeight: 500, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
            }}>
            + Save &amp; Add to Campaign
            </button>
        )}

        <button onClick={onThemeToggle} style={{
            width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
            background: "var(--color-background-secondary)",
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-md)", cursor: "pointer",
            color: "var(--color-text-secondary)", flexShrink: 0,
        }}>
            {theme === "light" ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            )}
        </button>
        </header>
    );
}