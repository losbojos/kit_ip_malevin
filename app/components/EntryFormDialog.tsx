"use client";

import EntryForm from "@/app/components/EntryForm";
import { CreateWorkLogEntry } from "@/lib/types/work-log";
import { PANEL_CLASS } from "@/lib/ui-classes";

interface EntryFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (entry: CreateWorkLogEntry) => Promise<void>;
}

export default function EntryFormDialog({
  open,
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
          Новая запись
        </h2>
        <EntryForm
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
