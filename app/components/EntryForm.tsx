"use client";

import { FormEvent, useState } from "react";
import {
  MIN_VOLUME,
  MIN_VOLUME_INPUT,
  MSG_SAVE_ENTRY_FAILED,
} from "@/lib/constants";
import { WorkLogEntryData, WorkLogEntryDataWithId } from "@/lib/types/WorkLogEntryData";
import {
  BTN_CLASS,
  ERROR_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
} from "@/lib/ui-classes";

interface EntryFormProps {
  initialEntry?: WorkLogEntryDataWithId | null;
  onSubmit: (entry: WorkLogEntryData) => Promise<void>;
  onCancel: () => void;
}

function createEmptyForm(): WorkLogEntryData {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return {
    work_date: `${now.getFullYear()}-${month}-${day}`,
    activity: "",
    volume: 0,
    unit: "",
    executor: "",
  };
}


export default function EntryForm({
  initialEntry,
  onSubmit,
  onCancel,
}: EntryFormProps) {
  const [form, setForm] = useState<WorkLogEntryData>(() =>
    initialEntry ?? createEmptyForm()
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof WorkLogEntryData>(
    field: K,
    value: WorkLogEntryData[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!form.work_date.trim()) {
      setError("Укажите дату выполнения");
      return;
    }
    if (!form.activity.trim()) {
      setError("Укажите вид работ");
      return;
    }
    if (!form.unit.trim()) {
      setError("Укажите единицу измерения");
      return;
    }
    if (!form.executor.trim()) {
      setError("Укажите исполнителя");
      return;
    }
    if (!form.volume || form.volume <= MIN_VOLUME) {
      setError("Объём должен быть больше 0");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        work_date: form.work_date.trim(),
        activity: form.activity.trim(),
        volume: form.volume,
        unit: form.unit.trim(),
        executor: form.executor.trim(),
      });
      if (!initialEntry) {
        setForm(createEmptyForm());
      }
      onCancel();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : MSG_SAVE_ENTRY_FAILED;
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    if (!initialEntry) {
      setForm(createEmptyForm());
    }
    setError(null);
    onCancel();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label htmlFor="work_date" className={LABEL_CLASS}>
          Дата выполнения
        </label>
        <input
          id="work_date"
          type="date"
          value={form.work_date}
          onChange={(e) => updateField("work_date", e.target.value)}
          className={INPUT_CLASS}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="executor" className={LABEL_CLASS}>
          Исполнитель
        </label>
        <input
          id="executor"
          type="text"
          value={form.executor}
          onChange={(e) => updateField("executor", e.target.value)}
          className={INPUT_CLASS}
          placeholder="Иванов И.И."
          required
        />
      </div>

      <div className="flex flex-col gap-1 sm:col-span-2">
        <label htmlFor="activity" className={LABEL_CLASS}>
          Вид работ
        </label>
        <input
          id="activity"
          type="text"
          value={form.activity}
          onChange={(e) => updateField("activity", e.target.value)}
          className={INPUT_CLASS}
          placeholder="Кладка перегородок"
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="volume" className={LABEL_CLASS}>
          Объём
        </label>
        <input
          id="volume"
          type="number"
          min={MIN_VOLUME_INPUT}
          step="any"
          value={form.volume || ""}
          onChange={(e) =>
            updateField("volume", e.target.value === "" ? 0 : Number(e.target.value))
          }
          className={INPUT_CLASS}
          required
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="unit" className={LABEL_CLASS}>
          Единица
        </label>
        <input
          id="unit"
          type="text"
          value={form.unit}
          onChange={(e) => updateField("unit", e.target.value)}
          className={INPUT_CLASS}
          placeholder="м³"
          required
        />
      </div>

      {error && <p className={`${ERROR_CLASS} sm:col-span-2`}>{error}</p>}

      <div className="flex justify-center gap-4 sm:col-span-2">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className={BTN_CLASS}
        >
          Отменить
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={BTN_CLASS}
        >
          {isSubmitting ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </form>
  );
}
