// components/AppShell.tsx
"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { IconChevronRight, IconLayoutDashboard, IconReportAnalytics, IconDatabase } from "@tabler/icons-react";

interface AppShellProps {
  children: ReactNode;
}

export default function LayoutShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex bg-slate-200">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Logo bar */}
        <div className="h-16 border-b border-slate-200 flex items-center px-4 gap-2 bg-slate-100">
          <div className="w-28 h-10 bg-slate-200 border border-slate-400 flex items-center justify-center text-xs font-medium text-slate-600">
            App Logo
          </div>
          <IconChevronRight size={18} className="text-slate-500" />
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 text-sm text-slate-700">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-100"
          >
            <IconLayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          {/* Group Laporan Lalin */}
          <div className="mt-2">
            <div className="flex items-center gap-2 px-4 py-2 text-slate-800 font-medium">
              <IconReportAnalytics size={18} />
              <span>Laporan Lalin</span>
            </div>
            <Link
              href="/reports/daily"
              className="block pl-11 pr-4 py-1.5 text-slate-700 hover:bg-slate-100"
            >
              Laporan Per Hari
            </Link>
          </div>

          <Link
            href="/master/gates"
            className="mt-4 flex items-center gap-2 px-4 py-2 hover:bg-slate-100"
          >
            <IconDatabase size={18} />
            <span>Master Gerbang</span>
          </Link>
        </nav>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* Header/top bar */}
        <header className="h-16 bg-slate-300 flex items-center justify-end px-6 gap-4">
          {/* icon user */}
          <div className="w-9 h-9 rounded-full border border-slate-600 flex items-center justify-center">
            <span className="text-slate-700 text-sm">👤</span>
          </div>
          {/* icon settings/filter */}
          <div className="w-9 h-9 rounded-full border border-slate-600 flex items-center justify-center">
            <span className="text-slate-700 text-sm">⚙️</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 bg-slate-100 p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
