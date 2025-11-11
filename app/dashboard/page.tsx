
"use client";

import { useEffect, useState } from "react";
import { DateInput } from "@mantine/dates";
import { Button, TextInput } from "@mantine/core";
import dayjs from "dayjs";
import { Bar, Doughnut } from "react-chartjs-2";
// import "../../lib/charts";
import LayoutShell from "@/components/LayoutShell";

interface MethodStat {
  method: string;
  count: number;
}
interface GateStat {
  gateName: string;
  count: number;
}
interface ShiftStat {
  label: string; 
  percent: number;
}
interface BranchStat {
  label: string; 
  percent: number;
}

export default function DashboardPage() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [search, setSearch] = useState("");

  const [methodStats, setMethodStats] = useState<MethodStat[]>([]);
  const [gateStats, setGateStats] = useState<GateStat[]>([]);
  const [shiftStats, setShiftStats] = useState<ShiftStat[]>([]);
  const [branchStats, setBranchStats] = useState<BranchStat[]>([]);

  // dummy data
  const loadDummy = () => {
    setMethodStats([
      { method: "BCA", count: 35 },
      { method: "BRI", count: 48 },
      { method: "BNI", count: 58 },
      { method: "DKI", count: 20 },
      { method: "Mandiri", count: 70 },
      { method: "Mega", count: 90 },
      { method: "Flo", count: 25 },
    ]);
    setGateStats([
      { gateName: "Gerbang 1", count: 32 },
      { gateName: "Gerbang 2", count: 45 },
      { gateName: "Gerbang 3", count: 58 },
      { gateName: "Gerbang 4", count: 18 },
      { gateName: "Gerbang 5", count: 72 },
    ]);
    setShiftStats([
      { label: "Shift 1", percent: 60 },
      { label: "Shift 2", percent: 20 },
      { label: "Shift 3", percent: 20 },
    ]);
    setBranchStats([
      { label: "Ruas 1", percent: 60 },
      { label: "Ruas 2", percent: 20 },
      { label: "Ruas 3", percent: 20 },
    ]);
  };

  const fetchDashboard = async () => {
    const dateStr = date ? dayjs(date).format("YYYY-MM-DD") : "";
    console.log("fetch dashboard for", dateStr, "search:", search);
    loadDummy();
  };

  useEffect(() => {
    loadDummy();
  }, []);

  const barMethodData = {
    labels: methodStats.map((m) => m.method),
    datasets: [
      {
        label: "Jumlah Lalin",
        data: methodStats.map((m) => m.count),
      },
    ],
  };

  const barGateData = {
    labels: gateStats.map((g) => g.gateName),
    datasets: [
      {
        label: "Jumlah Lalin",
        data: gateStats.map((g) => g.count),
      },
    ],
  };

  const doughnutShiftData = {
    labels: shiftStats.map((s) => s.label),
    datasets: [
      {
        data: shiftStats.map((s) => s.percent),
      },
    ],
  };

  const doughnutBranchData = {
    labels: branchStats.map((b) => b.label),
    datasets: [
      {
        data: branchStats.map((b) => b.percent),
      },
    ],
  };

  return (
    <LayoutShell>
      <h1 className="text-lg font-semibold mb-4 text-slate-800">Dashboard</h1>

      <div className="flex flex-wrap gap-3 items-end mb-6">
        <DateInput
          label="Tanggal"
          value={date}
        //   onChange={setDate}
          valueFormat="DD/MM/YYYY"
          className="w-44"
        />
        <TextInput
          label="Search All"
          placeholder="Cari gerbang / ruas / metode"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          className="w-56"
        />
        <Button
          className="bg-slate-500 hover:bg-slate-600 text-white"
          radius="md"
          onClick={fetchDashboard}
        >
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-slate-200 rounded-lg p-4">
            <h2 className="text-sm font-medium text-slate-700 mb-3">
              Jumlah Lalin per Metode Pembayaran
            </h2>
            <div className="h-64">
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <h2 className="text-sm font-medium text-slate-700 mb-3">
              Jumlah Lalin per Gerbang
            </h2>
            <div className="h-64">
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-slate-200 rounded-lg p-4 flex">
            <div className="w-40 h-40">
              {/* <Doughnut data={doughnutShiftData} /> */}
            </div>
            <div className="ml-6 flex-1">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">
                Total Lalin
              </h3>
              <ul className="space-y-1 text-xs text-slate-700">
                {shiftStats.map((s, i) => (
                  <li key={s.label} className="flex justify-between">
                    <span>{s.label}</span>
                    <span>{s.percent}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4 flex">
            <div className="w-40 h-40">
              {/* <Doughnut data={doughnutBranchData} /> */}
            </div>
            <div className="ml-6 flex-1">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">
                Total Lalin
              </h3>
              <ul className="space-y-1 text-xs text-slate-700">
                {branchStats.map((b) => (
                  <li key={b.label} className="flex justify-between">
                    <span>{b.label}</span>
                    <span>{b.percent}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}
