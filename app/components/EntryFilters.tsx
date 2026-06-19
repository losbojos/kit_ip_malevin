"use client";

import Panel from "@/app/components/Panel";
import { SORT_ASC, SORT_DESC } from "@/lib/constants";
import {
  BTN_CLASS,
  INPUT_CLASS,
  LABEL_CLASS,
} from "@/lib/ui-classes";

export type SortOrder = typeof SORT_ASC | typeof SORT_DESC;

export interface EntryFiltersValue {
  dateFrom: string;
  dateTo: string;
  sort: SortOrder;
}

interface EntryFiltersProps {
  value: EntryFiltersValue;
  onChange: (value: EntryFiltersValue) => void;
}

export default function EntryFilters({ value, onChange }: EntryFiltersProps) {
  function update<K extends keyof EntryFiltersValue>(
    field: K,
    fieldValue: EntryFiltersValue[K]
  ) {
    onChange({ ...value, [field]: fieldValue });
  }

  return (
    <Panel className="flex flex-wrap items-end gap-4 p-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="dateFrom" className={LABEL_CLASS}>
          Дата с
        </label>
        <input
          id="dateFrom"
          type="date"
          value={value.dateFrom}
          onChange={(e) => update("dateFrom", e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="dateTo" className={LABEL_CLASS}>
          Дата по
        </label>
        <input
          id="dateTo"
          type="date"
          value={value.dateTo}
          onChange={(e) => update("dateTo", e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="sort" className={LABEL_CLASS}>
          Сортировка
        </label>
        <select
          id="sort"
          value={value.sort}
          onChange={(e) => update("sort", e.target.value as SortOrder)}
          className={INPUT_CLASS}
        >
          <option value={SORT_DESC}>Сначала новые</option>
          <option value={SORT_ASC}>Сначала старые</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange({ dateFrom: "", dateTo: "", sort: SORT_DESC })
        }
        className={BTN_CLASS}
      >
        Сбросить
      </button>
    </Panel>
  );
}
