// app/reports/daily/page.tsx
"use client";

import { useMemo, useState } from "react";
import { TextInput, Button, Select, Tabs, Table, Text } from "@mantine/core";
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

// dummy data – ganti dengan API
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

const tableHeader = ['No', 'Ruas', 'Gerbang', 'Gardu', 'Hari', 'Tanggal', 'Metode Pembayaran', 'Gol 1', 'Gol II', 'Gol III', 'Gol IV','Gol V', 'Total Lalin']

export default function DailyReportPage() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("5");
  const [activeTab, setActiveTab] = useState<string>("tunai");

  const handleFilter = () => {
    // nanti kalau pakai API, panggil API di sini
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setDate(null);
    setPage(1);
  };

  const handleExport = () => {
    const dateStr = date ? dayjs(date).format("YYYY-MM-DD") : "";
    console.log("EXPORT search:", search, "date:", dateStr);
  };

  // 1) filter dasar: search + tanggal
  const baseRows = useMemo(() => {
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

  // 2) filter lagi berdasarkan Tab yang dipilih
  const rowsByTab = useMemo(() => {
    switch (activeTab) {
      case "tunai":
        return baseRows.filter((r) => r.metodePembayaran === "Tunai");
      case "etoll":
        return baseRows.filter((r) => r.metodePembayaran === "E-Toll");
      case "flo":
        return baseRows.filter((r) => r.metodePembayaran === "Flo");
      case "ktp":
        return baseRows.filter((r) => r.metodePembayaran === "KTP");
      case "combo":
        return baseRows.filter((r) =>
          ["Tunai", "E-Toll", "Flo"].includes(r.metodePembayaran)
        );
      case "keseluruhan":
      default:
        return baseRows;
    }
  }, [baseRows, activeTab]);

  // 3) pagination pakai rowsByTab
  const pageSizeNum = parseInt(pageSize, 10);
  const totalPages = Math.max(
    1,
    Math.ceil(rowsByTab.length / pageSizeNum || 1)
  );
  const pagedRows = rowsByTab.slice(
    (page - 1) * pageSizeNum,
    page * pageSizeNum
  );


  // 4) summary (per ruas & total keseluruhan) juga dari rowsByTab
  const totalsByRuas = useMemo(() => {
    const map = new Map<string, number>();
    rowsByTab.forEach((r) => {
      map.set(r.ruas, (map.get(r.ruas) || 0) + r.totalLalin);
    });
    return Array.from(map.entries());
  }, [rowsByTab]);

  const totalKeseluruhan = useMemo(
    () => rowsByTab.reduce((sum, r) => sum + r.totalLalin, 0),
    [rowsByTab]
  );

  // 5) total per jenis untuk tampilan di masing-masing Tab (dari baseRows)
  const totalTunai = baseRows
    .filter((r) => r.metodePembayaran === "Tunai")
    .reduce((s, r) => s + r.totalLalin, 0);
  const totalEtoll = baseRows
    .filter((r) => r.metodePembayaran === "E-Toll")
    .reduce((s, r) => s + r.totalLalin, 0);
  const totalFlo = baseRows
    .filter((r) => r.metodePembayaran === "Flo")
    .reduce((s, r) => s + r.totalLalin, 0);
  const totalKtp = baseRows
    .filter((r) => r.metodePembayaran === "KTP")
    .reduce((s, r) => s + r.totalLalin, 0);
  const totalEtollTunaiFlo = totalTunai + totalEtoll + totalFlo;

  const rows = pagedRows.map((row) => (
          <Table.Tr key={row.no}>
            <Table.Td>
              <Text>
                {row.no}
              </Text>
            </Table.Td>
            <Table.Td key={row.ruas}>
              <Text>
                {row.ruas}
              </Text>
            </Table.Td>
            <Table.Td key={row.gerbang}>
              <Text>
                {row.gerbang}
              </Text>
            </Table.Td>
            <Table.Td key={row.gardu}>
              <Text>
                {row.gardu}
              </Text>
            </Table.Td>
            <Table.Td key={row.hari}>
              <Text>
                {row.hari}
              </Text>
            </Table.Td>
            <Table.Td key={row.tanggal}>
              <Text>
                {dayjs(row.tanggal).format("DD-MM-YYYY")}
              </Text>
            </Table.Td>
            <Table.Td key={row.metodePembayaran}>
              <Text>
                {row.metodePembayaran}
              </Text>
            </Table.Td>
            <Table.Td key={row.golI}>
              <Text>
                {row.golI}
              </Text>
            </Table.Td>
            <Table.Td key={row.golII}>
              <Text>
                {row.golII}
              </Text>
            </Table.Td>
            <Table.Td key={row.golIII}>
              <Text>
                {row.golIII}
              </Text>
            </Table.Td>
            <Table.Td key={row.golIV}>
              <Text>
                {row.golIV}
              </Text>
            </Table.Td>
            <Table.Td key={row.golV}>
              <Text>
                {row.golV}
              </Text>
            </Table.Td>
            <Table.Td key={row.totalLalin}>
              <Text>
                {row.totalLalin}
              </Text>
            </Table.Td>
          </Table.Tr>
        ));

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
              onChange={(e) => {
                setSearch(e.currentTarget.value);
                setPage(1);
              }}
              radius="md"
            />
          </div>
          <div className="w-full sm:w-56">
            <DateInput
              value={date}
              // onChange={setDate}
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
        {/* Header export */}
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

        {/* TABS TOTAL */}
        <div className="px-4 pt-4 pb-2 border-b border-slate-200 bg-slate-50">
          <Tabs
            value={activeTab}
            onChange={(value) => {
              if (!value) return;
              setActiveTab(value);
              setPage(1); // reset ke page 1 setiap ganti tab
            }}
            radius="md"
            variant="outline"
            className="w-full overflow-x-auto"
          >
            <Tabs.List>
              <Tabs.Tab value="tunai">Total Tunai</Tabs.Tab>
              <Tabs.Tab value="etoll">Total E-Toll</Tabs.Tab>
              <Tabs.Tab value="flo">Total Flo</Tabs.Tab>
              <Tabs.Tab value="ktp">Total KTP</Tabs.Tab>
              <Tabs.Tab value="keseluruhan">Total Keseluruhan</Tabs.Tab>
              <Tabs.Tab value="combo">Total E-Toll+Tunai+Flo</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="tunai" pt="xs">
              <p className="text-sm text-slate-700">
                Total Tunai :{" "}
                <span className="font-semibold">
                  {totalTunai.toLocaleString("id-ID")}
                </span>
              </p>
            </Tabs.Panel>

            <Tabs.Panel value="etoll" pt="xs">
              <p className="text-sm text-slate-700">
                Total E-Toll :{" "}
                <span className="font-semibold">
                  {totalEtoll.toLocaleString("id-ID")}
                </span>
              </p>
            </Tabs.Panel>

            <Tabs.Panel value="flo" pt="xs">
              <p className="text-sm text-slate-700">
                Total Flo :{" "}
                <span className="font-semibold">
                  {totalFlo.toLocaleString("id-ID")}
                </span>
              </p>
            </Tabs.Panel>

            <Tabs.Panel value="ktp" pt="xs">
              <p className="text-sm text-slate-700">
                Total KTP :{" "}
                <span className="font-semibold">
                  {totalKtp.toLocaleString("id-ID")}
                </span>
              </p>
            </Tabs.Panel>

            <Tabs.Panel value="keseluruhan" pt="xs">
              <p className="text-sm text-slate-700">
                Total Keseluruhan :{" "}
                <span className="font-semibold">
                  {baseRows
                    .reduce((sum, r) => sum + r.totalLalin, 0)
                    .toLocaleString("id-ID")}
                </span>
              </p>
            </Tabs.Panel>

            <Tabs.Panel value="combo" pt="xs">
              <p className="text-sm text-slate-700">
                Total E-Toll + Tunai + Flo :{" "}
                <span className="font-semibold">
                  {totalEtollTunaiFlo.toLocaleString("id-ID")}
                </span>
              </p>
            </Tabs.Panel>
          </Tabs>
        </div>

        {/* TABEL DETAIL (isi mengikuti Tab) */}
        <div className="overflow-x-auto">
          <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="xs">
              <Table.Thead>
                <Table.Tr>
                  {tableHeader.map((th)=>{
                    return(
                      <Table.Th>{th}</Table.Th>
                    )
                  })}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </div>

        {/* PAGINATION */}
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
