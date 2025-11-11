// components/AppShell.tsx
"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NavLink, rem } from '@mantine/core';
import { IconChevronRight, IconLayoutDashboard, IconReportAnalytics, IconDatabase } from "@tabler/icons-react";
import jm from '@/assets/jm.png'
import Link from "next/link";



interface AppShellProps {
  children: ReactNode;
}


export default function LayoutShell({ children }: AppShellProps) {
  const pathname = usePathname();

  // buka default kalau lagi di /reports/*
  const [laporanOpened, setLaporanOpened] = useState(
    pathname.startsWith("/reports")
  );
  return (
    <div className="min-h-screen flex bg-slate-200">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Logo bar */}
        <div className="h-16 border-b border-slate-200 items-center px-4 gap-2 bg-slate-100">
            <Image src={jm} alt="logo" style={{width:'150px', margin:'12px auto'}}/>
        </div>

        {/* Menu */}
         <nav className="flex-1 py-4 px-2 text-sm text-slate-700 space-y-1">
          {/* Dashboard */}
          <NavLink
            label="Dashboard"
            leftSection={<IconLayoutDashboard size={18} />}
            component={Link}
            href="/dashboard"
            active={pathname === "/dashboard"}
            className="rounded-md"
            styles={{
              root: {
                paddingLeft: rem(8),
                paddingRight: rem(8),
              },
            }}
          />

          {/* Laporan Lalin (COLLAPSIBLE) */}
          <NavLink
            label="Laporan Lalin"
            leftSection={<IconReportAnalytics size={18} />}
            childrenOffset={32}
            opened={laporanOpened}
            onChange={setLaporanOpened}
            className="rounded-md"
            styles={{
              root: {
                paddingLeft: rem(8),
                paddingRight: rem(8),
              },
            }}
          >
            <NavLink
              label="Laporan Per Hari"
              component={Link}
              href="/reports/daily"
              active={pathname === "/reports/daily"}
              className="rounded-md"
            />
            {/* kalau nanti ada sub-menu lain (misal Laporan Bulanan),
                tinggal tambahkan NavLink lagi di sini */}
          </NavLink>

          {/* Master Gerbang */}
          <NavLink
            label="Master Gerbang"
            leftSection={<IconDatabase size={18} />}
            component={Link}
            href="/master/gates"
            active={pathname.startsWith("/master/gates")}
            className="rounded-md"
            styles={{
              root: {
                paddingLeft: rem(8),
                paddingRight: rem(8),
              },
            }}
          />
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
