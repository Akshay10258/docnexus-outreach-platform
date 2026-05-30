"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme";
import CampaignHeader from "./components/CampaignHeader";
import MetricsGrid from "./components/MetricsGrid";
import ActivityChart from "./components/ActivityChart";
import SequenceOverview from "./components/SequenceOverview";
import EnrolledTable from "./components/EnrolledTable";
import type { Campaign } from "@/app/types/campaign";
import type { Physician } from "@/app/types/physician";

export default function CampaignDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [physicians, setPhysicians] = useState<Physician[]>([]);
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/campaigns/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data: Campaign = await res.json();
        setCampaign(data);

        if (data.enrolledPhysicianIds?.length > 0) {
          const allRes = await fetch("/api/physicians");
          const all: Physician[] = await allRes.json();
          setPhysicians(all.filter((p) => data.enrolledPhysicianIds.includes(p.id)));
        }
      } catch {
        router.push("/campaigns");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, router]);

  const handleLaunch = async () => {
    setLaunching(true);
    try {
      await fetch(`/api/campaigns/${id}/launch`, { method: "PATCH" });
      setCampaign((prev) => prev ? { ...prev, status: "active" } : prev);
    } finally {
      setLaunching(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!campaign) return null;

  const enrolled = campaign.enrolledPhysicianIds?.length ?? 0;
  const mockMetrics = {
    enrolled,
    sent: campaign.status === "draft" ? 0 : Math.round(enrolled * 1.8),
    openRate: campaign.status === "draft" ? 0 : 42,
    replies: campaign.status === "draft" ? 0 : Math.round(enrolled * 0.3),
    meetings: campaign.status === "draft" ? 0 : Math.round(enrolled * 0.08),
  };

  const chartData = campaign.status === "draft"
    ? [0, 0, 0, 0, 0, 0, 0]
    : [0.2, 0.4, 0.6, 0.5, 0.3, 0.15, 0.1].map((r) => Math.round(enrolled * r));

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background-tertiary)", fontFamily: "var(--font-sans)" }}>
      <CampaignHeader
        campaign={campaign} launching={launching}
        theme={theme} onThemeToggle={toggle}
        onBack={() => router.push("/campaigns")}
        onLaunch={handleLaunch}
      />
      <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
        <MetricsGrid metrics={mockMetrics} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <ActivityChart data={chartData} campaignStatus={campaign.status} />
          <SequenceOverview sequences={campaign.sequences} />
        </div>
        <EnrolledTable
          physicians={physicians} enrolled={enrolled}
          campaignStatus={campaign.status}
          onBrowse={() => router.push("/physicians")}
        />
        <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", textAlign: "center" }}>
          Campaign created {new Date(campaign.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>
      <style>{`@keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", background: "var(--color-background-tertiary)", fontFamily: "var(--font-sans)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%",
          border: "2px solid #E1F5EE", borderTop: "2px solid #0F6E56",
          animation: "spin 0.8s linear infinite" }} />
        <span style={{ fontSize: 14, color: "var(--color-text-tertiary)" }}>Loading campaign...</span>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}