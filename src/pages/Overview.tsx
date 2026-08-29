import { useState } from "react";
import { StatCard } from "@/components/StatCard";
import { Camera, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";

const trafficFlowData = [
  { time: "06:00", vehicles: 1200, speed: 48 },
  { time: "08:00", vehicles: 4200, speed: 28 },
  { time: "10:00", vehicles: 2400, speed: 54 },
  { time: "12:00", vehicles: 3200, speed: 42 },
  { time: "14:00", vehicles: 3100, speed: 44 },
  { time: "16:00", vehicles: 4500, speed: 26 },
  { time: "18:00", vehicles: 5200, speed: 23 },
];

const congestionData = [
  { zone: "North", load: 72 },
  { zone: "South", load: 80 },
  { zone: "East", load: 61 },
  { zone: "West", load: 58 },
  { zone: "Central", load: 94 },
];

export default function Overview() {
  const [safetyOverrideActive, setSafetyOverrideActive] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const handleSafetyOverride = () => {
    setSafetyOverrideActive((prev) => !prev);
  };

  const handleResync = () => {
    if (syncing) return;
    setSyncing(true);
    window.setTimeout(() => {
      setSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString());
    }, 1500);
  };

  const handleExportDiagnostics = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      system: "SmartFlow",
      safetyOverrideActive,
      lastResyncAt: lastSyncTime,
      summary: {
        connectedCameras: 28,
        avgSpeedKmph: 34,
        signalEfficiencyPct: 89,
        incidents: 2,
      },
      trafficFlowData,
      congestionData,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `smartflow-diagnostics-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6 rounded-3xl border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <header className="grid gap-4 md:grid-cols-2 md:items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-cyan-100">
            SmartFlow Traffic Control
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Complete citywide flow management with predictive control.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--surface)] p-4">
          <p className="text-sm font-bold text-cyan-200">
            Priority Advisory
          </p>
          <p className="mt-1 text-sm text-slate-300">
            Central corridor at 94% capacity. Load shedding and rerouting active.
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Connected Cameras" value="28" subtitle="Total live streams" icon={Camera} status="online" />
        <StatCard title="Average Speed" value="34 km/h" subtitle="Across corridors" icon={TrendingUp} status="warning" />
        <StatCard title="Signal Efficiency" value="89%" subtitle="Adaptive timings" icon={Clock} status="online" />
        <StatCard title="Incidents" value="2" subtitle="Critical" icon={AlertTriangle} status="critical" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-[var(--panel-border)] bg-[var(--surface)] p-4 transition-all duration-600 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl hover:border-cyan-400/80 hover:ring-2 hover:ring-cyan-400/40">
          <h2 className="mb-3 text-lg font-semibold text-cyan-100">
            Traffic load trend
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficFlowData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" />
                <XAxis dataKey="time" tick={{ fill: '#a5b4fc' }} />
                <YAxis tick={{ fill: '#a5b4fc' }} />
                <Line dataKey="vehicles" type="monotone" stroke="#38bdf8" strokeWidth={4} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-2xl border border-[var(--panel-border)] bg-[var(--surface)] p-4 transition-all duration-600 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl hover:border-cyan-400/80 hover:ring-2 hover:ring-cyan-400/40">
          <h2 className="mb-3 text-lg font-semibold text-cyan-100">
            Congestion heatmap
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={congestionData} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" tick={{ fill: '#a5b4fc' }} />
                <YAxis type="category" dataKey="zone" tick={{ fill: '#a5b4fc' }} width={80} />
                <Bar dataKey="load" fill="#38bdf8" radius={[4, 4, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <div className="rounded-2xl border border-[var(--panel-border)] bg-[var(--surface)] p-5">
        <h3 className="mb-3 text-lg font-semibold text-cyan-800 dark:text-cyan-100">
          Quick ops panel
        </h3>
        {(safetyOverrideActive || syncing || lastSyncTime) && (
          <p className="mb-3 text-xs text-slate-300">
            {safetyOverrideActive ? "Safety override active." : "Safety override inactive."}
            {syncing ? " Re-sync in progress..." : ""}
            {!syncing && lastSyncTime ? ` Last AI sync: ${lastSyncTime}.` : ""}
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          <button
            onClick={handleSafetyOverride}
            className="rounded-xl border-2 border-cyan-400/70 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-800 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-100 hover:border-cyan-400 dark:border-cyan-400/60 dark:bg-slate-800/90 dark:bg-cyan-500/25 dark:text-cyan-100 dark:hover:bg-cyan-500/35 dark:hover:border-cyan-400/80"
          >
            {safetyOverrideActive ? "Disable Safety Override" : "Activate Safety Override"}
          </button>
          <button
            onClick={handleResync}
            disabled={syncing}
            className="rounded-xl border-2 border-amber-400/70 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 shadow-lg shadow-amber-500/10 transition hover:bg-amber-100 hover:border-amber-400 dark:border-amber-400/60 dark:bg-slate-800/90 dark:bg-amber-500/25 dark:text-amber-100 dark:hover:bg-amber-500/35 dark:hover:border-amber-400/80"
          >
            {syncing ? "Re-syncing..." : "AI Re-sync Signal Cycles"}
          </button>
          <button
            onClick={handleExportDiagnostics}
            className="rounded-xl border-2 border-emerald-400/70 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-100 hover:border-emerald-400 dark:border-emerald-400/60 dark:bg-slate-800/90 dark:bg-emerald-500/25 dark:text-emerald-100 dark:hover:bg-emerald-500/35 dark:hover:border-emerald-400/80"
          >
            Export Live Diagnostics
          </button>
        </div>
      </div>
    </section>
  );
}