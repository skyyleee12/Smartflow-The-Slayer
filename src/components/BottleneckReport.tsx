import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useTheme } from "@/theme";

// Traffic higher on Monday (commute surge) and weekends (leisure / trips)
const weeklyData = [
  { day: "Monday", traffic: 2680 },
  { day: "Tuesday", traffic: 2520 },
  { day: "Wednesday", traffic: 2350 },
  { day: "Thursday", traffic: 2180 },
  { day: "Friday", traffic: 2610 },
  { day: "Saturday", traffic: 2420 },
  { day: "Sunday", traffic: 2290 },
];

const weekdayTraffic = weeklyData
  .filter(d => !["Saturday", "Sunday"].includes(d.day))
  .reduce((sum, d) => sum + d.traffic, 0);

const weekendTraffic = weeklyData
  .filter(d => ["Saturday", "Sunday"].includes(d.day))
  .reduce((sum, d) => sum + d.traffic, 0);

const BottleneckReport = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const axisTickFill = isLight ? "#374151" : "#e5e7eb";
  const tickLineStroke = isLight ? "#9ca3af" : "#4b5563";
  const gridStroke = isLight ? "#e5e7eb" : "#1f2937";
  const tooltipBg = isLight ? "rgba(255,255,255,0.98)" : "rgba(15,23,42,0.95)";
  const tooltipColor = isLight ? "#111827" : "#e5e7eb";
  const tooltipBorder = isLight ? "rgba(148,163,184,0.55)" : "rgba(56,189,248,0.4)";

  const cyanTitle = isLight ? "text-cyan-700" : "text-cyan-100";
  const cyanChip = isLight ? "text-cyan-700" : "text-cyan-100";
  const cyanValue = isLight ? "text-cyan-700" : "text-cyan-100";
  const amberTitle = isLight ? "text-amber-800" : "text-amber-200";
  const amberSub = isLight ? "text-amber-800/80" : "text-amber-200/80";

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${isLight ? "text-cyan-600/80" : "text-cyan-400/80"}`}>
          Network Intelligence
        </p>
        <h2 className={`text-3xl font-extrabold tracking-tight drop-shadow-sm ${cyanTitle}`}>
          Bottleneck Report
        </h2>
        <p className="text-sm text-slate-300">
          Weekly corridor load to surface persistent choke‑points and imbalance between weekday and weekend demand.
        </p>
      </header>

      {/* Bar Chart for Daily Traffic */}
      <Card
        className="p-6 border border-[var(--panel-border)] bg-[var(--surface)] shadow-black/20 rounded-2xl"
      >
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className={`text-lg font-semibold flex items-center gap-2 ${cyanTitle}`}>
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Last 7 days corridor volume
          </h3>
          <span className={`rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-medium ${cyanChip}`}>
            Peak: Mon & weekends
          </span>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis
                dataKey="day"
                tick={{ fill: axisTickFill }}
                tickLine={{ stroke: tickLineStroke }}
              />
              <YAxis
                tick={{ fill: axisTickFill }}
                tickLine={{ stroke: tickLineStroke }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  borderRadius: 12,
                  border: `1px solid ${tooltipBorder}`,
                  color: tooltipColor,
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="traffic"
                fill="#22d3ee"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Summary */}
      <Card
        className="p-6 border border-[var(--panel-border)] bg-[var(--surface)] rounded-2xl shadow-black/20 shadow-lg space-y-4"
      >
        <h3 className={`text-lg font-semibold ${cyanTitle}`}>
          Weekday vs weekend pressure
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--panel-border)] bg-[var(--surface-2)] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] mb-1 text-slate-400">
              Weekday load
            </p>
            <p className={`text-2xl font-bold ${cyanValue}`}>
              {weekdayTraffic.toLocaleString()}
            </p>
            <p className="text-xs mt-1 text-slate-400">
              Mon–Fri aggregated vehicle count
            </p>
          </div>
          <div className="rounded-xl border border-amber-400/50 bg-amber-500/10 px-4 py-3">
            <p className={`text-xs uppercase tracking-[0.18em] mb-1 ${amberTitle}`}>
              Weekend load
            </p>
            <p className={`text-2xl font-bold ${amberTitle}`}>
              {weekendTraffic.toLocaleString()}
            </p>
            <p className={`text-xs mt-1 ${amberSub}`}>
              Sat–Sun aggregated vehicle count
            </p>
          </div>
        </div>
        <p className="mt-2 text-sm font-medium text-slate-100">
          Bottlenecks intensify on <strong>Monday</strong> (commute surge) and <strong>weekends</strong> — extend green
          waves for leisure corridors, reinforce diversion plans on Sat–Sun, and add capacity for Monday AM/PM peaks.
        </p>
      </Card>
    </div>
  );
};

export default BottleneckReport;