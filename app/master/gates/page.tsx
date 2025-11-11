// app/master/gates/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import { Button, TextInput, Select, Modal } from "@mantine/core";
import LayoutShell from "@/components/LayoutShell";
import {
  IconPlus,
  IconPencil,
  IconEye,
  IconTrash,
} from "@tabler/icons-react";

interface GateRow {
  id: number;
  ruas: string;
  gerbang: string;
}

// dummy data – nanti ganti ke data dari API
const MOCK_GATES: GateRow[] = [
  { id: 1, ruas: "Ruas 1", gerbang: "Gerbang 1" },
  { id: 2, ruas: "Ruas 1", gerbang: "Gerbang 2" },
  { id: 3, ruas: "Ruas 2", gerbang: "Gerbang 3" },
  { id: 4, ruas: "Ruas 2", gerbang: "Gerbang 4" },
];

type Mode = "create" | "edit" | "view";

export default function MasterGatesPage() {
  // const [search, setSearch] = useState("");
  // const [pageSize, setPageSize] = useState("5");
  // const [page, setPage] = useState(1);
  const [rows, setRows] = useState<GateRow[]>([]);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState("5");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<Mode>("create");
  const [current, setCurrent] = useState<GateRow | null>(null);

  useEffect(() => {
  const loadGates = async () => {
    const res = await fetch("/api/gerbangs", { cache: "no-store" });
    if (!res.ok) {
      console.error("Gagal load gerbang:", await res.text());
      return;
    }
    const data = await res.json();
    // sesuaikan dengan struktur backend, contoh: { data: [...] }
    // setRows(data.data ?? data);
    console.log(data)
  };

  loadGates();
}, []);

  // filter + pagination lokal
  const filtered = useMemo(
    () =>
      MOCK_GATES.filter(
        (g) =>
          !search ||
          g.ruas.toLowerCase().includes(search.toLowerCase()) ||
          g.gerbang.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const pageSizeNum = parseInt(pageSize, 10);
  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / pageSizeNum || 1)
  );
  const pagedRows = filtered.slice(
    (page - 1) * pageSizeNum,
    page * pageSizeNum
  );

  const openCreate = () => {
    setModalMode("create");
    setCurrent({ id: 0, ruas: "", gerbang: "" });
    setModalOpen(true);
  };

  const openEdit = (row: GateRow) => {
    setModalMode("edit");
    setCurrent(row);
    setModalOpen(true);
  };

  const openView = (row: GateRow) => {
    setModalMode("view");
    setCurrent(row);
    setModalOpen(true);
  };

  const handleDelete = (row: GateRow) => {
    // TODO: panggil API delete
    // contoh:
    // await fetch(`/api/gates/${row.id}`, { method: "DELETE" });
    console.log("DELETE", row);
  };

  const handleSave = async () => {
    if (!current) return;

    if (modalMode === "create") {
      // TODO: panggil API create
      console.log("CREATE", current);
    } else if (modalMode === "edit") {
      // TODO: panggil API update
      console.log("UPDATE", current);
    }
    setModalOpen(false);
  };

  return (
    <LayoutShell>
      <h1 className="text-lg font-semibold mb-4 text-slate-800">
        Master Data gerbang
      </h1>

      {/* BAR ATAS: Search + Tambah */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <div className="w-full sm:w-72">
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
        <Button
          leftSection={<IconPlus size={16} />}
          className="bg-slate-700 hover:bg-slate-800"
          radius="md"
          onClick={openCreate}
        >
          Tambah
        </Button>
      </div>

      {/* TABEL */}
      <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs md:text-sm text-slate-800">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-3 py-2 border border-slate-200 w-16 text-left">
                  No.
                </th>
                <th className="px-3 py-2 border border-slate-200 text-left">
                  Ruas
                </th>
                <th className="px-3 py-2 border border-slate-200 text-left">
                  Gerbang
                </th>
                <th className="px-3 py-2 border border-slate-200 w-32 text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row, idx) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 border border-slate-100">
                    {(page - 1) * pageSizeNum + idx + 1}
                  </td>
                  <td className="px-3 py-2 border border-slate-100">
                    {row.ruas}
                  </td>
                  <td className="px-3 py-2 border border-slate-100">
                    {row.gerbang}
                  </td>
                  <td className="px-3 py-2 border border-slate-100 text-center">
                    <div className="inline-flex items-center gap-2">
                      <button
                        className="text-slate-700 hover:text-slate-900"
                        onClick={() => openEdit(row)}
                        aria-label="Edit"
                      >
                        <IconPencil size={16} />
                      </button>
                      <button
                        className="text-slate-700 hover:text-slate-900"
                        onClick={() => openView(row)}
                        aria-label="Lihat"
                      >
                        <IconEye size={16} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(row)}
                        aria-label="Hapus"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {pagedRows.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-4 text-center text-slate-500"
                  >
                    Data tidak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
              w={90}
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
              const active = pageNum === page;
              return (
                <button
                  key={pageNum}
                  className={`px-2 py-1 border border-slate-300 rounded ${
                    active ? "bg-slate-600 text-white" : "bg-white"
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

      {/* MODAL CREATE/EDIT/VIEW */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        centered
        radius="md"
        title={
          modalMode === "create"
            ? "Tambah Gerbang"
            : modalMode === "edit"
            ? "Edit Gerbang"
            : "Detail Gerbang"
        }
      >
        {current && (
          <div className="space-y-3">
            <Select
              label="Ruas"
              data={["Ruas 1", "Ruas 2", "Ruas 3"]}
              value={current.ruas}
              onChange={(value) =>
                value &&
                setCurrent((c) => (c ? { ...c, ruas: value } : c))
              }
              disabled={modalMode === "view"}
            />
            <TextInput
              label="Gerbang"
              value={current.gerbang}
              onChange={(e) =>
                setCurrent((c) =>
                  c ? { ...c, gerbang: e.currentTarget.value } : c
                )
              }
              disabled={modalMode === "view"}
            />

            {modalMode !== "view" && (
              <div className="pt-2">
                <Button
                  fullWidth
                  radius="md"
                  className="bg-slate-700 hover:bg-slate-800"
                  onClick={handleSave}
                >
                  Simpan
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </LayoutShell>
  );
}
