import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { Activity, TrendingUp, Car, Gauge } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface FlowLogEntry {
  timestamp_sec?: number;
  vehicles: number;
  density?: number;
  congestion_level?: string;
  video_name?: string;
  date?: string;
  time?: string;
  mode?: string;
}

interface ResultsResponse {
  logs?: FlowLogEntry[];
  video_name?: string;
  average_density?: number;
  final_congestion_level?: string;
  frames_processed?: number;
}

const fallbackFlowData = [
  { time: "06:00", vehicles: 1200, density: 8 },
  { time: "08:00", vehicles: 4200, density: 28 },
  { time: "10:00", vehicles: 2400, density: 14 },
  { time: "12:00", vehicles: 3200, density: 20 },
  { time: "14:00", vehicles: 3100, density: 19 },
  { time: "16:00", vehicles: 4500, density: 30 },
  { time: "18:00", vehicles: 5200, density: 34 },
];

function getStatusFromLevel(level: string): "online" | "warning" | "critical" {
  if (level === "HIGH") return "critical";
  if (level === "MEDIUM") return "warning";
  return "online";
}

export default function Flow() {
  const [chartData, setChartData] = useState<{ time: string; vehicles: number; density: number }[]>(fallbackFlowData);
  const [entries, setEntries] = useState<FlowLogEntry[]>([]);
  const [summary, setSummary] = useState<{
    totalSamples: number;
    avgVehicles: number;
    avgDensity: number;
    congestionLevel: string;
    source: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/results`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: ResultsResponse | FlowLogEntry[]) => {
        setError(null);
        const isArray = Array.isArray(json);
        const logs: FlowLogEntry[] = isArray ? json : (json as ResultsResponse).logs ?? [];
        const data = json as ResultsResponse;

        if (logs.length > 0) {
          setEntries(logs);
          const step = Math.max(1, Math.floor(logs.length / 14));
          const chart = logs
            .filter((_, i) => i % step === 0)
            .slice(0, 14)
            .map((log, i) => ({
              time: log.time ?? `${log.timestamp_sec ?? i}s`,
              vehicles: log.vehicles,
              density: log.density ?? 0,
            }));
          setChartData(chart);
          const totalV = logs.reduce((s, l) => s + l.vehicles, 0);
          const totalD = logs.reduce((s, l) => s + (l.density ?? 0), 0);
          setSummary({
            totalSamples: logs.length,
            avgVehicles: Math.round(totalV / logs.length),
            avgDensity: Math.round((totalD / logs.length) * 10) / 10,
            congestionLevel: data && !isArray ? (data.final_congestion_level ?? "—") : (logs[logs.length - 1]?.congestion_level ?? "—"),
            source: data && !isArray ? (data.video_name ?? "Video") : "API",
          });
        } else {
          setChartData(fallbackFlowData);
          setSummary({
            totalSamples: fallbackFlowData.length,
            avgVehicles: Math.round(fallbackFlowData.reduce((s, d) => s + d.vehicles, 0) / fallbackFlowData.length),
            avgDensity: Math.round(fallbackFlowData.reduce((s, d) => s + d.density, 0) / fallbackFlowData.length),
            congestionLevel: "—",
            source: "Sample data",
          });
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const status = summary ? getStatusFromLevel(summary.congestionLevel) : "online";

  return (
    <section className="space-y-6 rounded-3xl border border-[var(--panel-border)] bg-[var(--panel)] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <header className="grid gap-4 md:grid-cols-2 md:items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-cyan-100">Traffic Flow</h1>
          <p className="mt-2 text-sm text-slate-300">
            Live flow and density from camera analytics. Data source: backend /results.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--surface)] p-4">
          <p className="text-sm font-bold text-cyan-200">Data source</p>
          <p className="mt-1 text-sm text-slate-300">
            {loading ? "Loading…" : error ? `Error: ${error}` : summary?.source ?? "—"}
          </p>
        </div>
      </header>

      {loading ? (
        <div className="rounded-2xl bg-[var(--surface)] p-8 text-center text-slate-300">
          Loading flow data…
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-rose-500/20 p-6 text-center text-rose-200">
          Could not load flow data: {error}. Showing sample data below.
        </div>
      ) : null}

      {summary && !loading && (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Flow samples"
            value={summary.totalSamples}
            subtitle="Data points"
            icon={Activity}
            status="online"
          />
          <StatCard
            title="Avg vehicles"
            value={summary.avgVehicles}
            subtitle="Per sample"
            icon={Car}
            status="online"
          />
          <StatCard
            title="Avg density"
            value={summary.avgDensity.toFixed(1)}
            subtitle="Smoothed"
            icon={Gauge}
            status="online"
          />
          <StatCard
            title="Congestion"
            value={summary.congestionLevel}
            subtitle="Current level"
            icon={TrendingUp}
            status={status}
          />
        </div>
      )}

      <article className="rounded-2xl border border-[var(--panel-border)] bg-[var(--surface)] p-4 transition-all duration-600 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl hover:border-cyan-400/80 hover:ring-2 hover:ring-cyan-400/40">
        <h2 className="mb-3 text-lg font-semibold text-cyan-100">Flow over time</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" />
              <XAxis dataKey="time" tick={{ fill: "#a5b4fc" }} />
              <YAxis tick={{ fill: "#a5b4fc" }} />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Line
                dataKey="vehicles"
                type="monotone"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={false}
                name="Vehicles"
              />
              <Line
                dataKey="density"
                type="monotone"
                stroke="#a78bfa"
                strokeWidth={2}
                dot={false}
                name="Density"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      {entries.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-[var(--panel-border)] bg-[var(--surface)] shadow-xl">
          <h3 className="border-b border-[var(--panel-border)] px-4 py-3 text-lg font-semibold text-cyan-100">
            Flow log (latest entries)
          </h3>
          <div className="max-h-[320px] overflow-auto">
            <table className="min-w-full border-collapse text-left text-sm text-slate-300">
              <thead className="sticky top-0 bg-slate-950/80">
                <tr>
                  <th className="px-4 py-3">Time / Timestamp</th>
                  <th className="px-4 py-3">Video</th>
                  <th className="px-4 py-3">Vehicles</th>
                  <th className="px-4 py-3">Density</th>
                  <th className="px-4 py-3">Congestion</th>
                </tr>
              </thead>
              <tbody>
                {entries.slice(-50).reverse().map((entry, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/10 last:border-b-0 hover:bg-slate-800/70"
                  >
                    <td className="px-4 py-3">
                      {entry.time ?? (entry.timestamp_sec != null ? `${entry.timestamp_sec}s` : "—")}
                    </td>
                    <td className="px-4 py-3">{entry.video_name ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold text-white">{entry.vehicles}</td>
                    <td className="px-4 py-3">{entry.density != null ? entry.density.toFixed(2) : "—"}</td>
                    <td className="px-4 py-3">{entry.congestion_level ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
