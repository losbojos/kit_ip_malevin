export interface WorkLogEntryData {
  work_date: string;
  activity: string;
  volume: number;
  unit: string;
  executor: string;
}

export interface WorkLogEntryDataWithId extends WorkLogEntryData {
  id: string;
}
