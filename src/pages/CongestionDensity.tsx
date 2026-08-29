import React, { useEffect, useState } from "react";

interface CongestionEntry {
  mode: string;
  date?: string;
  time?: string;
  video_name?: string;
  timestamp_sec?: number;
  vehicles: number;
}

export default function CongestionDensity(): JSX.Element {
  const [entries, setEntries] = useState<CongestionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/results`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        // Backend returns either [] or { logs: [...] }; normalize to array
        const list = Array.isArray(json) ? json : (json?.logs ?? []);
        setEntries(Array.isArray(list) ? list : []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[var(--panel)] px-5 py-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Congestion Density Dashboard</h2>
          <p className="text-sm text-slate-400">Live metrics from camera analytics feed.</p>
        </div>
        <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-100">Data source: /results</span>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-[var(--surface)] p-6 text-center text-slate-300">Loading congestion snapshots, please wait…</div>
      ) : error ? (
        <div className="rounded-2xl bg-rose-500/20 p-6 text-center text-rose-200">Error fetching data: {error}</div>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl bg-[var(--surface)] p-6 text-center text-slate-300">No congestion records yet.</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[var(--panel-border)] bg-[var(--surface)] shadow-xl">
          <table className="min-w-full border-collapse text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Video</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Vehicles</th>
                <th className="px-4 py-3">Location Time</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index} className="border-b border-white/10 last:border-b-0 hover:bg-slate-800/70">
                  <td className="px-4 py-3">{entry.timestamp_sec != null ? `${entry.timestamp_sec}s` : "—"}</td>
                  <td className="px-4 py-3">{entry.video_name || "unknown"}</td>
                  <td className="px-4 py-3">{entry.mode}</td>
                  <td className="px-4 py-3 font-semibold text-white">{entry.vehicles}</td>
                  <td className="px-4 py-3">{entry.date || "—"} {entry.time || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
