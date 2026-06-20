"use client";

import { useCallback, useEffect, useState } from "react";
import EntryFilters, { EntryFiltersValue } from "@/app/components/EntryFilters";
import EntryForm from "@/app/components/EntryForm";
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
import { ERROR_BOX_CLASS } from "@/lib/ui-classes";

const defaultFilters: EntryFiltersValue = {
  dateFrom: "",
  dateTo: "",
  sort: SORT_DESC,
};

export default function Home() {
  const [entries, setEntries] = useState<WorkLogEntry[]>([]);
  const [filters, setFilters] = useState<EntryFiltersValue>(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters.dateFrom) params.set(QUERY_DATE_FROM, filters.dateFrom);
      if (filters.dateTo) params.set(QUERY_DATE_TO, filters.dateTo);
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
    <div className="min-h-full bg-zinc-100">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4">
        <header>
          <h1 className="text-xl font-semibold">Журнал работ</h1>
          <p className="text-sm text-zinc-700">
            Учёт выполненных работ на объекте
          </p>
        </header>

        <EntryFilters value={filters} onChange={setFilters} />

        <EntryForm onSubmit={handleCreate} />

        {error && <p className={ERROR_BOX_CLASS}>{error}</p>}

        {isLoading ? (
          <p className="text-sm text-zinc-700">Загрузка...</p>
        ) : (
          <EntryTable entries={entries} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}
