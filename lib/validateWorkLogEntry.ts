import { MIN_VOLUME } from "@/lib/constants";
import { WorkLogEntryData } from "@/lib/types/WorkLogEntryData";

type ValidationResult =
  | { ok: true; data: WorkLogEntryData }
  | { ok: false; error: string };

export function validateWorkLogEntry(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Некорректные данные записи" };
  }

  const { work_date, activity, volume, unit, executor } =
    body as WorkLogEntryData;

  if (!work_date?.trim()) {
    return { ok: false, error: "Укажите дату выполнения" };
  }
  if (!activity?.trim()) {
    return { ok: false, error: "Укажите вид работ" };
  }
  if (!unit?.trim()) {
    return { ok: false, error: "Укажите единицу измерения" };
  }
  if (!executor?.trim()) {
    return { ok: false, error: "Укажите исполнителя" };
  }
  if (typeof volume !== "number" || volume <= MIN_VOLUME) {
    return { ok: false, error: "Объём должен быть числом больше 0" };
  }

  return {
    ok: true,
    data: {
      work_date: work_date.trim(),
      activity: activity.trim(),
      volume,
      unit: unit.trim(),
      executor: executor.trim(),
    },
  };
}
