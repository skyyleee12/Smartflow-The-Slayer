import { Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const signalData = [
  { id: "SIG001", location: "Rajpath (Kartavya Path)", status: "Green", timer: 45, cycle: 120 },
  { id: "SIG002", location: "Janpath", status: "Red", timer: 12, cycle: 100 },
  { id: "SIG003", location: "Outer Ring Road", status: "Yellow", timer: 3, cycle: 90 },
  { id: "SIG004", location: "Inner Ring Road", status: "Green", timer: 67, cycle: 110 },
  { id: "SIG005", location: "Mathura Road", status: "Red", timer: 8, cycle: 95 },
  { id: "SIG006", location: "Aurobindo Marg", status: "Green", timer: 34, cycle: 105 },
];

const timingHistory = [
  { time: "08:00", green: 65, yellow: 5, red: 30 },
  { time: "09:00", green: 60, yellow: 8, red: 32 },
  { time: "10:00", green: 55, yellow: 10, red: 35 },
  { time: "11:00", green: 70, yellow: 6, red: 24 },
  { time: "12:00", green: 67, yellow: 7, red: 26 },
];

export default function SignalTimings() {
  const statusStyle = (status: string) => {
    const map = {
      Green: { pill: "bg-green-500 text-white", dot: "bg-green-200" },
      Yellow: { pill: "bg-yellow-400 text-slate-900", dot: "bg-yellow-100" },
      Red: { pill: "bg-red-500 text-white", dot: "bg-red-200" },
    };
    return map[status as keyof typeof map] || { pill: "bg-slate-500 text-white", dot: "bg-slate-200" };
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between rounded-2xl bg-[var(--panel)] px-5 py-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Signal Dynamics</h2>
          <p className="mt-2 text-sm text-slate-300">Live control panels for the city signal network.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-800/70 px-4 py-2 text-xs text-slate-200">Auto Refresh 5s</div>
          <div className="rounded-lg bg-cyan-500/20 px-4 py-2 text-xs text-cyan-100">Active Mode</div>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-3 mt-1">
        <article className="glass-card xl:col-span-2 p-6">
          <div className="mb-4 flex items-center gap-2 text-slate-100">
            <Clock className="h-4 w-4 shrink-0" />
            <h3 className="text-lg font-bold">Signal Status Table</h3>
          </div>
          <div className="max-h-[520px] overflow-auto rounded-xl border border-[var(--panel-border)]">
            <table className="w-full border-separate border-spacing-y-2">
              <thead className="bg-[var(--surface-2)] text-xs uppercase tracking-widest text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-center">ID</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-center">State</th>
                  <th className="px-4 py-3 text-center">Timer</th>
                  <th className="px-4 py-3 text-center">Cycle</th>
                </tr>
              </thead>
              <tbody>
                {signalData.map((signal) => (
                  <tr key={signal.id} className="bg-[var(--surface)] hover:bg-[var(--surface-2)] transition">
                    <td className="px-4 py-3 text-center font-mono text-sm text-cyan-100">{signal.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-200">{signal.location}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex min-w-[84px] items-center justify-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(signal.status).pill}`}
                        >
                          <span className={`h-2.5 w-2.5 rounded-full ${statusStyle(signal.status).dot}`} />
                          {signal.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-white">{signal.timer}s</td>
                    <td className="px-4 py-3 text-center text-sm text-slate-300">{signal.cycle}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="glass-card p-6 no-holo-glow">
          <h3 className="mb-3 text-center text-lg font-bold text-white">Signal Phase Trends</h3>
          <div className="h-[420px] px-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timingHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" tick={{ fill: '#94a3b8' }} />
                <YAxis tick={{ fill: '#94a3b8' }} />
                <Line type="monotone" dataKey="green" stroke="#22d3ee" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="yellow" stroke="#facc15" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="red" stroke="#fb7185" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </section>
  );
}