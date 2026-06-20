"use client";

import { useCallback, useEffect, useState } from "react";
import EntryFilters, { EntryFiltersValue } from "@/app/components/EntryFilters";
import EntryFormDialog from "@/app/components/EntryFormDialog";
import EntryTable from "@/app/components/EntryTable";
import {
  ENTRIES_API_PATH,
  entryByIdPath,
  LOAD_ENTRIES_DELAY,
  MSG_DELETE_ENTRY_FAILED,
  MSG_LOAD_ENTRIES_FAILED,
  MSG_SAVE_ENTRY_FAILED,
  QUERY_DATE_FROM,
  QUERY_DATE_TO,
  QUERY_SORT,
  SORT_DESC,
} from "@/lib/constants";
import { CreateWorkLogEntry, WorkLogEntry } from "@/lib/types/work-log";
import { ERROR_BOX_CLASS, BTN_CLASS } from "@/lib/ui-classes";

const defaultFilters: EntryFiltersValue = {
  dateFrom: "",
  dateTo: "",
  sort: SORT_DESC,
};

function isValidFilterDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d); // месяц в Date с нуля 1
  // JS переносит несуществующие даты (31.02 на март) — сверяем, что дата не изменилась
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

/** null — фильтр по датам корректен */
function validateFilterDates(dateFrom: string, dateTo: string): string | null {
  if (dateFrom && !isValidFilterDate(dateFrom)) {
    return "Некорректная дата «с»";
  }
  if (dateTo && !isValidFilterDate(dateTo)) {
    return "Некорректная дата «по»";
  }
  if (dateFrom && dateTo && dateFrom > dateTo) {
    return "Дата «с» не может быть позже даты «по»";
  }
  return null;
}

export default function Home() {
  const [entries, setEntries] = useState<WorkLogEntry[]>([]);
  const [filters, setFilters] = useState<EntryFiltersValue>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dateFrom = filters.dateFrom.trim();
      const dateTo = filters.dateTo.trim();

      const validationError = validateFilterDates(dateFrom, dateTo);
      if (validationError) {
        setError(validationError);
        return;
      }

      const params = new URLSearchParams();
      if (dateFrom) params.set(QUERY_DATE_FROM, dateFrom);
      if (dateTo) params.set(QUERY_DATE_TO, dateTo);
      params.set(QUERY_SORT, filters.sort);

      const query = params.toString();
      const url = query ? `${ENTRIES_API_PATH}?${query}` : ENTRIES_API_PATH;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? MSG_LOAD_ENTRIES_FAILED);
      }

      setEntries(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : MSG_LOAD_ENTRIES_FAILED;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(loadEntries, LOAD_ENTRIES_DELAY);
    return () => clearTimeout(timer);
  }, [loadEntries]);

  async function handleCreate(entry: CreateWorkLogEntry) {
    const response = await fetch(ENTRIES_API_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? MSG_SAVE_ENTRY_FAILED);
    }

    await loadEntries();
  }

  async function handleDelete(id: string) {
    const response = await fetch(entryByIdPath(id), {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? MSG_DELETE_ENTRY_FAILED);
    }

    await loadEntries();
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <main className="mx-auto w-full max-w-5xl p-4">
        <div className="sticky top-0 z-10 -mx-4 space-y-4 bg-zinc-100 px-4 pb-4">
          <header>
            <h1 className="text-xl font-semibold">Журнал работ</h1>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-zinc-700">
                Учёт выполненных работ на объекте
              </p>
              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                className={`${BTN_CLASS} shrink-0`}
              >
                Добавить
              </button>
            </div>
          </header>

          <EntryFilters value={filters} onChange={setFilters} />

          <p className={error ? ERROR_BOX_CLASS : "text-sm text-zinc-700"}>
            {isLoading
              ? "Загрузка..."
              : error
                ? error
                : `Загружено записей: ${entries.length}`}
          </p>
        </div>

        <EntryTable entries={entries} onDelete={handleDelete} />

        <EntryFormDialog
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreate}
        />
      </main>
    </div>
  );
}
