import {
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const WeekendVsWeekday = () => {
  const weekendData = [
    { category: "Weekday", low: 43, medium: 31, high: 46 },
    { category: "Weekend", low: 22, medium: 22, high: 5 },
  ];

  return (
    <article className="glass-card p-5">
      <h3 className="text-lg font-bold text-white">Weekend vs Weekday Congestion</h3>
      <div className="h-72 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weekendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="category" tick={{ fill: '#94a3b8' }} />
            <YAxis tick={{ fill: '#94a3b8' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="low" stackId="a" fill="#60a5fa" />
            <Bar dataKey="medium" stackId="a" fill="#f59e0b" />
            <Bar dataKey="high" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
};

const WeatherCongestion = () => {
  const weatherData = [
    { condition: "Clear", low: 23, medium: 17, high: 12 },
    { condition: "Cloudy", low: 14, medium: 10, high: 10 },
    { condition: "Rainy", low: 11, medium: 11, high: 16 },
    { condition: "Snowy", low: 18, medium: 15, high: 12 },
  ];

  return (
    <article className="glass-card p-5">
      <h3 className="text-lg font-bold text-white">Weather & Congestion</h3>
      <div className="h-72 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weatherData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="condition" tick={{ fill: '#94a3b8' }} />
            <YAxis tick={{ fill: '#94a3b8' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="low" fill="#60a5fa" />
            <Bar dataKey="medium" fill="#f59e0b" />
            <Bar dataKey="high" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
};

const HourlyVehicleCount = () => {
  const hourlyData = [
    { hour: "00:00", Mon: 2, Tue: 3, Wed: 1, Thu: 4, Fri: 15, Sat: 2, Sun: 1 },
    { hour: "06:00", Mon: 20, Tue: 25, Wed: 18, Thu: 22, Fri: 58, Sat: 13, Sun: 10 },
    { hour: "12:00", Mon: 48, Tue: 52, Wed: 45, Thu: 50, Fri: 62, Sat: 34, Sun: 27 },
    { hour: "18:00", Mon: 68, Tue: 74, Wed: 66, Thu: 70, Fri: 80, Sat: 46, Sun: 40 },
  ];

  return (
    <article className="glass-card p-5">
      <h3 className="text-lg font-bold text-white">Hourly Traffic Volume </h3>
      <div className="h-72 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="hour" tick={{ fill: '#94a3b8' }} />
            <YAxis tick={{ fill: '#94a3b8' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Mon" stroke="#60a5fa" dot={false} />
            <Line type="monotone" dataKey="Tue" stroke="#facc15" dot={false} />
            <Line type="monotone" dataKey="Wed" stroke="#22d3ee" dot={false} />
            <Line type="monotone" dataKey="Thu" stroke="#9333ea" dot={false} />
            <Line type="monotone" dataKey="Fri" stroke="#ec4899" dot={false} />
            <Line type="monotone" dataKey="Sat" stroke="#f97316" dot={false} />
            <Line type="monotone" dataKey="Sun" stroke="#34d399" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
};

export default function HistoricalAnalysis() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl bg-[var(--panel)] px-5 py-4">
        <h2 className="text-2xl font-bold text-white">Historical Analysis Hub</h2>
        <p className="text-sm text-slate-300">Past data insights for adaptive traffic policy.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <WeekendVsWeekday />
        <WeatherCongestion />
        <HourlyVehicleCount />
      </div>
    </section>
  );
}
