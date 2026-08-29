import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: route not found", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-950 to-slate-950 p-8 text-center">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-slate-900/75 px-7 py-10 shadow-2xl shadow-black/40">
        <p className="text-9xl font-black text-cyan-300">404</p>
        <h1 className="mt-4 text-2xl font-bold text-white">Page Not Found</h1>
        <p className="mt-2 text-sm text-slate-300">You reached: <span className="font-mono text-cyan-200">{location.pathname}</span></p>
        <a href="/" className="mt-6 inline-block rounded-xl bg-cyan-400 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">Back to Dashboard</a>
      </div>
    </main>
  );
};

export default NotFound;
