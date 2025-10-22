export type TableStatus =
  | "available"
  | "reserved"
  | "billed"
  | "available-soon";

export type SeatStatus = TableStatus | "occupied" | "selected";

export type TableShape = "small" | "medium" | "large";

export interface Seat {
  id: string;
  label: string;
  status: SeatStatus;
}

export interface Table {
  id: string;
  capacity: number;
  status: TableStatus;
  shape: TableShape;
  seats: Seat[];
}
