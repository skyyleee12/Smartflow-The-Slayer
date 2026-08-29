import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Activity, Camera, Clock, Map, AlertTriangle, History, Home, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "../theme";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import smartflowLogo from "../assets/smartflow-logo.jpeg";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Signals", url: "/signals", icon: Clock },
  { title: "Flow", url: "/flow", icon: Activity },
  { title: "Congestion", url: "/congestion", icon: Map },
  { title: "Cameras", url: "/cameras", icon: Camera },
  { title: "Bottlenecks", url: "/bottlenecks", icon: AlertTriangle },
  { title: "History", url: "/history", icon: History },
];

const navLinkClass = (isActive: boolean, activeBase: string, base: string) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? activeBase : base}`;

export function MainNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeBase = "bg-gradient-to-r from-cyan-300/20 to-blue-300/15 text-cyan-100";
  const base = "text-slate-200 hover:text-white hover:bg-white/10";

  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 backdrop-blur-xl transition-colors ${
        isLight
          ? "border-b border-slate-200/80 bg-white/80 shadow-md shadow-slate-300/40"
          : "border-b border-slate-800 bg-black/80 shadow-lg shadow-black/60"
      }`}
    >
      <div className="mx-auto flex min-h-[76px] max-w-[1600px] items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-1.5">
            <img className="h-10 w-10" src="/logo.jpeg" />
          </div>
          <div>
            <h1
              className={`text-xl font-extrabold tracking-tight ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
              SmartFlow
            </h1>
            <p className={`text-xs ${isLight ? "text-slate-500" : "text-slate-400"}`}>
              Next-gen city traffic intelligence
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navigationItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/"}
              className={({ isActive }) => navLinkClass(isActive, activeBase, base)}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className={`rounded-lg p-2 ${isLight ? "text-slate-700 hover:bg-slate-200" : "text-slate-200 hover:bg-white/10"}`}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className={`w-[280px] ${isLight ? "bg-white border-slate-200" : "bg-slate-900 border-slate-800"}`}
            >
              <nav className="mt-6 flex flex-col gap-1">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.url}
                    to={item.url}
                    end={item.url === "/"}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => navLinkClass(isActive, activeBase, base)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
              isLight
                ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
                : "bg-slate-800/70 text-slate-100 hover:bg-slate-700/80"
            }`}
          >
            {theme === "light" ? (
              <>
                <Moon className="h-4 w-4" />
                <span>Dark mode</span>
              </>
            ) : (
              <>
                <Sun className="h-4 w-4" />
                <span>Light mode</span>
              </>
            )}
          </button>
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
              isLight ? "bg-slate-100 text-slate-600" : "bg-slate-800/70 text-slate-300"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Online • {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </header>
  );
}