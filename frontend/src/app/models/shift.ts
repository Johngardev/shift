export interface Shift {
  _id?: string;
  workerCode: string;
  startTime: string | Date;
  endTime?: string | Date | null;
  totalTimeWorkedMs?: number | null;
  totalTimeFormatted?: string | null;
  status: 'ACTIVE' | 'FINISHED';
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface ActiveShiftResponse {
  hasActiveShift: boolean;
  data: Shift | null;
}
