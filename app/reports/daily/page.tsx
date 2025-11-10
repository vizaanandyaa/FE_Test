// app/reports/daily/page.tsx
"use client";

import { useMemo, useState } from "react";
import { TextInput, Button, Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import LayoutShell from "@/components/LayoutShell";
import { IconDownload } from "@tabler/icons-react";

interface DailyRow {
  no: number;
  ruas: string;
  gerbang: string;
  gardu: string;
  hari: string;
  tanggal: string; // "YYYY-MM-DD"
  metodePembayaran: "Tunai" | "E-Toll" | "Flo" | "KTP";
  golI: number;
  golII: number;
  golIII: number;
  golIV: number;
  golV: number;
  totalLalin: number;
}

// dummy data contoh; nanti ganti dari API
const MOCK_ROWS: DailyRow[] = [
  {
    no: 1,
    ruas: "Ruas 1",
    gerbang: "Gerbang 1",
    gardu: "01",
    hari: "Kamis",
    tanggal: "2024-05-30",
    metodePembayaran: "Tunai",
    golI: 567,
    golII: 234,
    golIII: 12,
    golIV: 10,
    golV: 8,
    totalLalin: 831,
  },
  {
    no: 2,
    ruas: "Ruas 1",
    gerbang: "Gerbang 2",
    gardu: "01",
    hari: "Rabu",
    tanggal: "2024-05-29",
    metodePembayaran: "Tunai",
    golI: 456,
    golII: 345,
    golIII: 23,
    golIV: 12,
    golV: 9,
    totalLalin: 986,
  },
  {
    no: 3,
    ruas: "Ruas 1",
    gerbang: "Gerbang 3",
    gardu: "02",
    hari: "Selasa",
    tanggal: "2024-05-28",
    metodePembayaran: "Tunai",
    golI: 768,
    golII: 345,
    golIII: 34,
    golIV: 13,
    golV: 7,
    totalLalin: 897,
  },
  {
    no: 4,
    ruas: "Ruas 2",
    gerbang: "Gerbang 4",
    gardu: "02",
    hari: "Senin",
    tanggal: "2024-05-27",
    metodePembayaran: "Tunai",
    golI: 890,
    golII: 577,
    golIII: 23,
    golIV: 14,
    golV: 9,
    totalLalin: 987,
  },
  {
    no: 5,
    ruas: "Ruas 2",
    gerbang: "Gerbang 5",
    gardu: "02",
    hari: "Minggu",
    tanggal: "2024-05-26",
    metodePembayaran: "Tunai",
    golI: 1435,
    golII: 1234,
    golIII: 34,
    golIV: 15,
    golV: 8,
    totalLalin: 2304,
  },
  {
    no: 6,
    ruas: "Ruas 2",
    gerbang: "Gerbang 6",
    gardu: "03",
    hari: "Sabtu",
    tanggal: "2024-05-25",
    metodePembayaran: "Tunai",
    golI: 2454,
    golII: 1256,
    golIII: 12,
    golIV: 16,
    golV: 7,
    totalLalin: 3459,
  },
];

export default function DailyReportPage() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("5");

  const handleFilter = () => {
    // kalau nanti pakai API, panggil API di sini dengan query search + date
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setDate(null);
    setPage(1);
  };

  const handleExport = () => {
    // ganti dengan endpoint export (misal download Excel)
    const dateStr = date ? dayjs(date).format("YYYY-MM-DD") : "";
    console.log("EXPORT dengan search:", search, "date:", dateStr);
    // window.open(`/api/export?search=${search}&date=${dateStr}`, "_blank");
  };

  // filter lokal (dummy)
  const filteredRows = useMemo(() => {
    return MOCK_ROWS.filter((row) => {
      const matchSearch =
        !search ||
        row.ruas.toLowerCase().includes(search.toLowerCase()) ||
        row.gerbang.toLowerCase().includes(search.toLowerCase()) ||
        row.metodePembayaran.toLowerCase().includes(search.toLowerCase());
      const matchDate =
        !date ||
        dayjs(row.tanggal).format("YYYY-MM-DD") ===
          dayjs(date).format("YYYY-MM-DD");
      return matchSearch && matchDate;
    });
  }, [search, date]);

  // pagination lokal
  const pageSizeNum = parseInt(pageSize, 10);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / pageSizeNum || 1)
  );

  const pagedRows = filteredRows.slice(
    (page - 1) * pageSizeNum,
    page * pageSizeNum
  );

  // summary per ruas dan total keseluruhan
  const totalsByRuas = useMemo(() => {
    const map = new Map<string, number>();
    filteredRows.forEach((r) => {
      map.set(r.ruas, (map.get(r.ruas) || 0) + r.totalLalin);
    });
    return Array.from(map.entries()); // [ [ruas, total], ... ]
  }, [filteredRows]);

  const totalKeseluruhan = useMemo(
    () => filteredRows.reduce((sum, r) => sum + r.totalLalin, 0),
    [filteredRows]
  );

  // contoh total per metode pembayaran buat header abu-abu
  const totalTunai = filteredRows
    .filter((r) => r.metodePembayaran === "Tunai")
    .reduce((s, r) => s + r.totalLalin, 0);
  const totalEtoll = filteredRows
    .filter((r) => r.metodePembayaran === "E-Toll")
    .reduce((s, r) => s + r.totalLalin, 0);
  const totalFlo = filteredRows
    .filter((r) => r.metodePembayaran === "Flo")
    .reduce((s, r) => s + r.totalLalin, 0);
  const totalKtp = filteredRows
    .filter((r) => r.metodePembayaran === "KTP")
    .reduce((s, r) => s + r.totalLalin, 0);
  const totalEtollTunaiFlo = totalTunai + totalEtoll + totalFlo;

  return (
    <LayoutShell>
      <h1 className="text-lg font-semibold mb-4 text-slate-800">
        Laporan Lalin Per Hari
      </h1>

      {/* FILTER BOX */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="w-full sm:w-64">
            <TextInput
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              radius="md"
            />
          </div>
          <div className="w-full sm:w-56">
            <DateInput
              value={date}
            //   onChange={setDate}
              valueFormat="DD-MM-YYYY"
              placeholder="Tanggal"
              radius="md"
            />
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-slate-500 hover:bg-slate-600"
              radius="md"
              onClick={handleFilter}
            >
              Filter
            </Button>
            <Button variant="outline" radius="md" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* TABLE + EXPORT */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        {/* Header atas dengan tombol Export */}
        <div className="flex items-center justify-end px-4 py-2 border-b border-slate-200 bg-slate-50">
          <Button
            variant="outline"
            radius="md"
            leftSection={<IconDownload size={16} />}
            onClick={handleExport}
          >
            Export
          </Button>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm text-slate-800">
            <thead>
              {/* Header baris 1: total per jenis pembayaran */}
              <tr className="bg-slate-600 text-white text-center">
                <th className="px-3 py-2 border border-slate-400">
                  Total Tunai
                  <div className="text-[10px] font-normal">
                    {totalTunai.toLocaleString("id-ID")}
                  </div>
                </th>
                <th className="px-3 py-2 border border-slate-400">
                  Total E-Toll
                  <div className="text-[10px] font-normal">
                    {totalEtoll.toLocaleString("id-ID")}
                  </div>
                </th>
                <th className="px-3 py-2 border border-slate-400">
                  Total Flo
                  <div className="text-[10px] font-normal">
                    {totalFlo.toLocaleString("id-ID")}
                  </div>
                </th>
                <th className="px-3 py-2 border border-slate-400">
                  Total KTP
                  <div className="text-[10px] font-normal">
                    {totalKtp.toLocaleString("id-ID")}
                  </div>
                </th>
                <th className="px-3 py-2 border border-slate-400">
                  Total Keseluruhan
                  <div className="text[10px] font-normal">
                    {totalKeseluruhan.toLocaleString("id-ID")}
                  </div>
                </th>
                <th className="px-3 py-2 border border-slate-400">
                  Total E-Toll+Tunai+Flo
                  <div className="text-[10px] font-normal">
                    {totalEtollTunaiFlo.toLocaleString("id-ID")}
                  </div>
                </th>
              </tr>

              {/* Header baris 2: kolom detail */}
              <tr className="bg-slate-100 text-left">
                <th className="px-2 py-2 border border-slate-200">No.</th>
                <th className="px-2 py-2 border border-slate-200">Ruas</th>
                <th className="px-2 py-2 border border-slate-200">Gerbang</th>
                <th className="px-2 py-2 border border-slate-200">Gardu</th>
                <th className="px-2 py-2 border border-slate-200">Hari</th>
                <th className="px-2 py-2 border border-slate-200">Tanggal</th>
                <th className="px-2 py-2 border border-slate-200">
                  Metode Pembayaran
                </th>
                <th className="px-2 py-2 border border-slate-200">Gol I</th>
                <th className="px-2 py-2 border border-slate-200">Gol II</th>
                <th className="px-2 py-2 border border-slate-200">Gol III</th>
                <th className="px-2 py-2 border border-slate-200">Gol IV</th>
                <th className="px-2 py-2 border border-slate-200">Gol V</th>
                <th className="px-2 py-2 border border-slate-200">
                  Total Lalin
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row) => (
                <tr key={row.no} className="hover:bg-slate-50">
                  <td className="px-2 py-1 border border-slate-100 text-center">
                    {row.no}
                  </td>
                  <td className="px-2 py-1 border border-slate-100">
                    {row.ruas}
                  </td>
                  <td className="px-2 py-1 border border-slate-100">
                    {row.gerbang}
                  </td>
                  <td className="px-2 py-1 border border-slate-100 text-center">
                    {row.gardu}
                  </td>
                  <td className="px-2 py-1 border border-slate-100">
                    {row.hari}
                  </td>
                  <td className="px-2 py-1 border border-slate-100">
                    {dayjs(row.tanggal).format("DD-MM-YYYY")}
                  </td>
                  <td className="px-2 py-1 border border-slate-100">
                    {row.metodePembayaran}
                  </td>
                  <td className="px-2 py-1 border border-slate-100 text-right">
                    {row.golI}
                  </td>
                  <td className="px-2 py-1 border border-slate-100 text-right">
                    {row.golII}
                  </td>
                  <td className="px-2 py-1 border border-slate-100 text-right">
                    {row.golIII}
                  </td>
                  <td className="px-2 py-1 border border-slate-100 text-right">
                    {row.golIV}
                  </td>
                  <td className="px-2 py-1 border border-slate-100 text-right">
                    {row.golV}
                  </td>
                  <td className="px-2 py-1 border border-slate-100 text-right">
                    {row.totalLalin}
                  </td>
                </tr>
              ))}

              {/* ROW TOTAL PER RUAS */}
              {totalsByRuas.map(([ruas, total]) => (
                <tr key={ruas} className="bg-slate-50 font-medium">
                  <td
                    className="px-2 py-2 border border-slate-200 text-left"
                    colSpan={12}
                  >
                    Total Lalin {ruas}
                  </td>
                  <td className="px-2 py-2 border border-slate-200 text-right">
                    {total.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}

              {/* ROW TOTAL KESELURUHAN */}
              <tr className="bg-slate-600 text-white font-semibold">
                <td
                  className="px-2 py-2 border border-slate-500 text-left"
                  colSpan={12}
                >
                  Total Lalin Keseluruhan
                </td>
                <td className="px-2 py-2 border border-slate-500 text-right">
                  {totalKeseluruhan.toLocaleString("id-ID")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* PAGINATION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 text-xs md:text-sm bg-white">
          <div className="flex items-center gap-2">
            <span>Show :</span>
            <Select
              data={["5", "10", "25", "50"]}
              value={pageSize}
              onChange={(value) => {
                if (!value) return;
                setPageSize(value);
                setPage(1);
              }}
              w={80}
              size="xs"
            />
            <span>entries</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              className="px-2 py-1 border border-slate-300 rounded disabled:opacity-40"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              {"<"}
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === page;
              return (
                <button
                  key={pageNum}
                  className={`px-2 py-1 border border-slate-300 rounded ${
                    isActive ? "bg-slate-600 text-white" : "bg-white"
                  }`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              className="px-2 py-1 border border-slate-300 rounded disabled:opacity-40"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
    </LayoutShell>
  );
}
