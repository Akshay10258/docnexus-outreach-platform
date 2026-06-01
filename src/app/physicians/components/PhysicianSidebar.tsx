import Link from "next/link";

interface Props {
    specialty: string; state: string; minYear: string; affiliation: string;
    acceptingOnly: boolean; boardOnly: boolean; hasFilters: boolean;
    specialtyOptions: string[]; stateOptions: string[]; affiliationOptions: string[];
    onSpecialtyChange: (v: string) => void;
    onStateChange: (v: string) => void;
    onAffiliationChange: (v: string) => void;
    onMinYearChange: (v: string) => void;
    onAcceptingChange: (v: boolean) => void;
    onBoardChange: (v: boolean) => void;
    onClearFilters: () => void;
}

const NAV = [
    { path: "/physicians", label: "Physicians", active: true },
    { path: "/campaigns", label: "Campaigns", active: false },
    { path: "/campaigns/new", label: "New Campaign", active: false },
];

export default function PhysicianSidebar({
    specialty, state, minYear, affiliation, acceptingOnly, boardOnly, hasFilters,
    specialtyOptions, stateOptions, affiliationOptions,
    onSpecialtyChange, onStateChange, onAffiliationChange, onMinYearChange,
    onAcceptingChange, onBoardChange, onClearFilters,
    }: Props) {
    return (
        <aside style={{
        width: 260, minWidth: 260,
        background: "var(--color-background-primary)",
        borderRight: "0.5px solid var(--color-border-tertiary)",
        display: "flex", flexDirection: "column",
        padding: "24px 0", overflowY: "auto",
        }}>
        {/* Brand */}
        <div style={{ padding: "0 20px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#0F6E56",
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
            </div>
            <span style={{ fontWeight: 500, fontSize: 16, color: "var(--color-text-primary)" }}>DocNexus</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: 0,
            letterSpacing: "0.05em", textTransform: "uppercase" }}>Outreach Platform</p>
        </div>

        {/* Nav */}
        <nav style={{ padding: "0 12px", marginBottom: 24 }}>
            {NAV.map((item) => (
            <Link key={item.path} href={item.path} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 10px", borderRadius: "var(--border-radius-md)",
                background: item.active ? "#E1F5EE" : "transparent",
                color: item.active ? "#0F6E56" : "var(--color-text-secondary)",
                fontSize: 14, fontWeight: item.active ? 500 : 400,
                cursor: "pointer", marginBottom: 2, textDecoration: "none",
            }}>
                {item.label}
            </Link>
            ))}
        </nav>

        {/* Filters */}
        <div style={{ padding: "0 20px", borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-tertiary)",
                letterSpacing: "0.08em", textTransform: "uppercase" }}>Filters</span>
            {hasFilters && (
                <button onClick={onClearFilters} style={{ fontSize: 12, color: "#0F6E56",
                background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
                Clear all
                </button>
            )}
            </div>

            <FilterSelect label="SPECIALTY" value={specialty} options={specialtyOptions} onChange={onSpecialtyChange} />
            <FilterSelect label="STATE" value={state} options={stateOptions} onChange={onStateChange} />
            <FilterSelect label="AFFILIATION" value={affiliation} options={affiliationOptions} onChange={onAffiliationChange} />

            <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>NPI REGISTERED AFTER</label>
            <input type="number" placeholder="e.g. 2010" value={minYear}
                onChange={(e) => onMinYearChange(e.target.value)}
                style={inputStyle} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <FilterCheckbox label="Accepting patients only" checked={acceptingOnly} onChange={onAcceptingChange} />
            <FilterCheckbox label="Board certified only" checked={boardOnly} onChange={onBoardChange} />
            </div>
        </div>
        </aside>
    );
    }

    // co-located sub-components — only used here
    function FilterSelect({ label, value, options, onChange }: {
        label: string; value: string;
        options: readonly string[] | readonly { label: string, value: string }[]; onChange: (v: string) => void;
    }) {
        return (
            <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>{label}</label>
            <select value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
                {options.map((opt) => {
                    const optionValue = typeof opt === "string" ? opt : opt.value;
                    const optionLabel = typeof opt === "string" ? opt : opt.label;
                    return (
                        <option 
                            key={optionValue} 
                            value={optionValue} 
                            style={{ 
                            background: "var(--color-background-secondary)", 
                            color: "var(--color-text-primary)" 
                            }}
                        >
                            {optionLabel}
                        </option>
                    );
                })}
            </select>
            </div>
        );
    }

    function FilterCheckbox({ label, checked, onChange }: {
    label: string; checked: boolean; onChange: (v: boolean) => void;
    }) {
    return (
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
            style={{ accentColor: "#0F6E56" }} />
        <span style={{ fontSize: 15, color: "var(--color-text-secondary)" }}>{label}</span>
        </label>
    );
    }

    const labelStyle: React.CSSProperties = {
    fontSize: 13, color: "var(--color-text-tertiary)",
    display: "block", marginBottom: 6, fontWeight: 500,
    };
    const inputStyle: React.CSSProperties = {
    width: "100%", padding: "7px 10px", borderRadius: "var(--border-radius-md)",
    border: "0.5px solid var(--color-border-secondary)",
    background: "var(--color-background-secondary)",
    color: "var(--color-text-primary)", fontSize: 15, boxSizing: "border-box",
};
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };