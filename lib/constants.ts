/** Имя таблицы в Supabase */
export const WORK_LOG_TABLE = "work_log";

/** Колонка даты — фильтр и сортировка в API */
export const WORK_LOG_DATE_COLUMN = "work_date";

/** Базовый путь API журнала */
export const ENTRIES_API_PATH = "/api/entries";

export function entryByIdPath(id: string): string {
  return `${ENTRIES_API_PATH}/${id}`;
}

/** Query-параметры */
export const QUERY_DATE_FROM = "dateFrom";
export const QUERY_DATE_TO = "dateTo";
export const QUERY_SORT = "sort";

/** Направления сортировки */
export const SORT_ASC = "asc";
export const SORT_DESC = "desc";

/** Минимальный объём строго больше чем */
export const MIN_VOLUME = 0;

/** Минимум для поля объема в форме */
export const MIN_VOLUME_INPUT = 0.01;

/** HTTP-коды */
export const HTTP_BAD_REQUEST = 400;
export const HTTP_NOT_FOUND = 404;
export const HTTP_CREATED = 201;
export const HTTP_OK = 200;
export const HTTP_SERVER_ERROR = 500;

/** Сообщения об ошибках */
export const MSG_LOAD_ENTRIES_FAILED = "Не удалось загрузить записи";
export const MSG_SAVE_ENTRY_FAILED = "Не удалось сохранить запись";
export const MSG_DELETE_ENTRY_FAILED = "Не удалось удалить запись";
export const MSG_UPDATE_ENTRY_FAILED = "Не удалось обновить запись";
export const MSG_ENTRY_NOT_FOUND = "Запись не найдена";

/** Задержка загрузки записей во избежание множественных вызовов при смене фильтра */
export const LOAD_ENTRIES_DELAY = 1000;
