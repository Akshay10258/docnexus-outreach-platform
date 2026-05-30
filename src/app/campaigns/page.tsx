"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme";
import Link from "next/link";
import AppSidebar from "@/app/components/AppSidebar";
import CampaignList from "./components/CampaignList";
import type { Campaign } from "@/app/types/campaign";

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const { theme, toggle } = useTheme();

    useEffect(() => {
        fetch("/api/campaigns")
        .then((r) => r.json())
        .then(setCampaigns)
        .catch(() => setCampaigns([]))
        .finally(() => setLoading(false));
    }, []);

    return (
        <div style={{ display: "flex", height: "100vh", fontFamily: "var(--font-sans)", background: "var(--color-background-tertiary)" }}>
        <AppSidebar activePath="/campaigns" />

        <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <header style={{
            background: "var(--color-background-primary)",
            borderBottom: "0.5px solid var(--color-border-tertiary)",
            padding: "16px 28px", display: "flex", alignItems: "center", gap: 12,
            }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)", flex: 1 }}>
                Campaigns
            </span>
            <Link href="/campaigns/new" style={{
                padding: "8px 16px", background: "#0F6E56", color: "white",
                borderRadius: "var(--border-radius-md)", fontSize: 14, fontWeight: 500,
                textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
            }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
                </svg>
                New Campaign
            </Link>
            <ThemeToggle theme={theme} onToggle={toggle} />
            </header>

            <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
            <CampaignList campaigns={campaigns} loading={loading} />
            </div>
        </main>

        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
        </div>
    );
    }

    // co-located — only used in header areas throughout this page
    function ThemeToggle({ theme, onToggle }: { theme: string; onToggle: () => void }) {
    return (
        <button onClick={onToggle} style={{
        width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--color-background-secondary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-md)", cursor: "pointer",
        color: "var(--color-text-secondary)",
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