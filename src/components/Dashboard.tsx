import { ReactNode } from "react";
import { MainNavbar } from "./TrafficSidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div
      className="min-h-screen sf-animated-bg"
      style={{ background: "var(--app-bg)", color: "var(--app-fg)" }}
    >
      <MainNavbar />
      <main className="mx-auto max-w-[1600px] px-4 pb-10 pt-28 md:px-8">
        {children}
      </main>
    </div>
  );
}