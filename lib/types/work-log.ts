export interface CreateWorkLogEntry {
  work_date: string;
  activity: string;
  volume: number;
  unit: string;
  executor: string;
}

export interface WorkLogEntry extends CreateWorkLogEntry {
  id: string;
}
