"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme";
import PhysicianSidebar from "./components/PhysicianSidebar";
import PhysicianTopBar from "./components/PhysicianTopBar";
import PhysicianList from "./components/PhysicianList";
import SaveCampaignModal from "./components/SaveCampaignModal";
import type { Physician } from "@/app/types/physician";

export default function PhysiciansPage() {
    const router = useRouter();
    const { theme, toggle } = useTheme();

    // server-filtered data
    const [physicians, setPhysicians] = useState<Physician[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // server-side filter params (trigger refetch)
    const [specialty, setSpecialty] = useState("All Specialties");
    const [state, setState] = useState("All States");
    const [affiliation, setAffiliation] = useState("All Affiliations");
    const [minYear, setMinYear] = useState("");

    // client-side filters (no refetch)
    const [search, setSearch] = useState("");
    const [acceptingOnly, setAcceptingOnly] = useState(false);
    const [boardOnly, setBoardOnly] = useState(false);

    // selection
    const [selected, setSelected] = useState<Set<string>>(new Set());

    // modal
    const [showSaveModal, setShowSaveModal] = useState(false);

    const fetchPhysicians = useCallback(async () => {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (specialty !== "All Specialties") params.set("specialty", specialty);
        if (state !== "All States") params.set("state", state);
        if (affiliation !== "All Affiliations") params.set("affiliation", affiliation);
        if (minYear) params.set("npiRegistrationYear", minYear);

        try {
        const res = await fetch(`/api/physicians?${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setPhysicians(await res.json());
        } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load physicians");
        setPhysicians([]);
        } finally {
        setLoading(false);
        }
    }, [specialty, state, affiliation, minYear]);

    useEffect(() => { fetchPhysicians(); }, [fetchPhysicians]);

    // client-side filtering (search + checkboxes)
    const filtered = physicians.filter((p) => {
        const q = search.toLowerCase();
        return (
        (!q ||
            p.firstName.toLowerCase().includes(q) ||
            p.lastName.toLowerCase().includes(q) ||
            p.affiliation.toLowerCase().includes(q) ||
            p.specialty.toLowerCase().includes(q) ||
            p.npi.includes(q)) &&
        (!acceptingOnly || p.acceptingPatients) &&
        (!boardOnly || p.boardCertified)
        );
    });

    const hasFilters =
        specialty !== "All Specialties" || state !== "All States" || affiliation !== "All Affiliations" ||
        minYear !== "" || acceptingOnly || boardOnly || search !== "";

    const clearFilters = () => {
        setSpecialty("All Specialties"); setState("All States"); setAffiliation("All Affiliations");
        setMinYear(""); setAcceptingOnly(false); setBoardOnly(false); setSearch("");
    };

    const toggleSelect = (id: string) =>
        setSelected((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
        });

    const toggleAll = () =>
        setSelected(selected.size === filtered.length
        ? new Set()
        : new Set(filtered.map((p) => p.id))
        );

    const handleCampaignSuccess = (id: string) => {
        setShowSaveModal(false);
        setSelected(new Set());
        router.push(`/campaigns/${id}`);
    };

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "var(--font-sans)", background: "var(--color-background-tertiary)" }}>
        <PhysicianSidebar
            specialty={specialty} state={state} minYear={minYear} affiliation={affiliation}
            acceptingOnly={acceptingOnly} boardOnly={boardOnly}
            hasFilters={hasFilters}
            onSpecialtyChange={setSpecialty} onStateChange={setState} onAffiliationChange={setAffiliation}
            onMinYearChange={setMinYear} onAcceptingChange={setAcceptingOnly}
            onBoardChange={setBoardOnly} onClearFilters={clearFilters}
        />

        <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <PhysicianTopBar
            search={search} onSearchChange={setSearch}
            filteredCount={filtered.length} selectedCount={selected.size}
            theme={theme} onThemeToggle={toggle}
            onSaveClick={() => setShowSaveModal(true)}
            />
            <PhysicianList
            physicians={filtered} loading={loading} error={error}
            selected={selected}
            isAllSelected={filtered.length > 0 && selected.size === filtered.length}
            onToggleSelect={toggleSelect} onToggleAll={toggleAll}
            onClearSelection={() => setSelected(new Set())}
            onClearFilters={clearFilters}
            onSaveClick={() => setShowSaveModal(true)}
            />
        </main>

        {showSaveModal && (
            <SaveCampaignModal
            selectedCount={selected.size}
            selectedIds={Array.from(selected)}
            onClose={() => setShowSaveModal(false)}
            onSuccess={handleCampaignSuccess}
            />
        )}
        </div>
    );
}