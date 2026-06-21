"use client";

import EntryForm from "@/app/components/EntryForm";
import { WorkLogEntryData, WorkLogEntryDataWithId } from "@/lib/types/WorkLogEntryData";
import { PANEL_CLASS } from "@/lib/ui-classes";

interface EntryFormDialogProps {
  open: boolean;
  entry?: WorkLogEntryDataWithId | null;
  onClose: () => void;
  onSubmit: (entry: WorkLogEntryData) => Promise<void>;
}

export default function EntryFormDialog({
  open,
  entry,
  onClose,
  onSubmit,
}: EntryFormDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        className={`${PANEL_CLASS} w-full max-w-lg p-4`}
      >
        <h2 className="mb-4 text-lg font-semibold">
          {entry ? "Редактирование записи" : "Новая запись"}
        </h2>
        <EntryForm
          key={entry?.id ?? "new"}
          initialEntry={entry}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
