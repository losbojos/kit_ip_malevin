"use client";

import { useState } from "react";
import Panel from "@/app/components/Panel";
import { MSG_DELETE_ENTRY_FAILED } from "@/lib/constants";
import { WorkLogEntry } from "@/lib/types/work-log";
import { BTN_CLASS, ERROR_BOX_CLASS } from "@/lib/ui-classes";

interface EntryTableProps {
  entries: WorkLogEntry[];
  onDelete: (id: string) => Promise<void>;
}

function formatDate(date: string): string {
  const [year, month, day] = date.split("-");
  if (!year || !month || !day) return date;
  return `${day}.${month}.${year}`;
}

export default function EntryTable({ entries, onDelete }: EntryTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Удалить эту запись?");
    if (!confirmed) return;

    setError(null);
    setDeletingId(id);

    try {
      await onDelete(id);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : MSG_DELETE_ENTRY_FAILED;
      setError(message);
    } finally {
      setDeletingId(null);
    }
  }

  if (entries.length === 0) {
    return (
      <Panel className="p-4 text-center text-sm text-zinc-700">
        Записей пока нет
      </Panel>
    );
  }

  return (
    <Panel className="overflow-hidden">
      {error && <p className={ERROR_BOX_CLASS}>{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200">
            <tr>
              <th className="p-4 font-semibold">Дата</th>
              <th className="p-4 font-semibold">Вид работ</th>
              <th className="p-4 font-semibold">Объём</th>
              <th className="p-4 font-semibold">Исполнитель</th>
              <th className="p-4 font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-zinc-200">
                <td className="p-4">{formatDate(entry.work_date)}</td>
                <td className="p-4">{entry.activity}</td>
                <td className="p-4">
                  {entry.volume} {entry.unit}
                </td>
                <td className="p-4">{entry.executor}</td>
                <td className="p-4">
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    disabled={deletingId === entry.id}
                    className={BTN_CLASS}
                  >
                    {deletingId === entry.id ? "Удаление..." : "Удалить"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
