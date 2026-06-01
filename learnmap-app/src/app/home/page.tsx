import AppShell from "@/lib/ui/AppShell";
import ComingSoon from "@/lib/ui/ComingSoon";

export default function HomePage() {
  return (
    <AppShell title="Home" subtitle="Dashboard">
      <ComingSoon
        title="Dashboard"
        description="This dashboard is coming next. For now, use Roadmaps to continue learning."
      />
    </AppShell>
  );
}
