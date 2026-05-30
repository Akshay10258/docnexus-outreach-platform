import Link from "next/link";

interface Props {
  activePath: "/physicians" | "/campaigns" | "/campaigns/new";
}

const NAV = [
  {
    path: "/physicians" as const,
    label: "Physicians",
    icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
    icon2: "M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  },
  {
    path: "/campaigns" as const,
    label: "Campaigns",
    icon: "M9 17H5a2 2 0 0 0-2 2v0M13 17h6M9 3H5a2 2 0 0 0-2 2v12M13 3h6a2 2 0 0 1 2 2v12",
    icon2: "",
  },
  {
    path: "/campaigns/new" as const,
    label: "New Campaign",
    icon: "M12 5v14M5 12h14",
    icon2: "",
  },
];

export default function AppSidebar({ activePath }: Props) {
  return (
    <aside style={{
      width: 260, minWidth: 260,
      background: "var(--color-background-primary)",
      borderRight: "0.5px solid var(--color-border-tertiary)",
      display: "flex", flexDirection: "column",
      padding: "24px 0",
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
      <nav style={{ padding: "0 12px" }}>
        {NAV.map((item) => {
          const isActive = activePath === item.path;
          return (
            <Link key={item.path} href={item.path} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", borderRadius: "var(--border-radius-md)",
              background: isActive ? "#E1F5EE" : "transparent",
              color: isActive ? "#0F6E56" : "var(--color-text-secondary)",
              fontSize: 14, fontWeight: isActive ? 500 : 400,
              marginBottom: 2, textDecoration: "none",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
                {item.icon2 && <path d={item.icon2} />}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}