import { Table, SeatStatus } from "../types/table";
import { getSeatPositions } from "../utils/seating";

interface TableBookingGridProps {
  tables: Table[];
  selectedTable: string | null;
  onSelectTable: (id: string) => void;
}

const seatStatusClasses: Record<SeatStatus, string> = {
  available: "bg-purple-400",
  reserved: "bg-orange-500",
  billed: "bg-green-500",
  "available-soon": "bg-yellow-400",
  occupied: "bg-gray-500",
  selected: "bg-indigo-500",
};

const getStatusBorder = (status: Table["status"]) => {
  switch (status) {
    case "available":
      return "border-purple-400 shadow-purple-300/40";
    case "reserved":
      return "border-orange-400 shadow-orange-300/40";
    case "billed":
      return "border-green-400 shadow-green-300/40";
    case "available-soon":
      return "border-yellow-400 shadow-yellow-300/40";
    default:
      return "border-gray-400";
  }
};

const getStatusBackground = (status: Table["status"]) => {
  switch (status) {
    case "available":
      return "bg-gradient-to-br from-slate-600/90 via-slate-700/90 to-slate-800/90";
    case "reserved":
      return "bg-gradient-to-br from-slate-700/95 via-slate-800/95 to-slate-900/95";
    case "billed":
      return "bg-gradient-to-br from-slate-600/90 via-slate-700/90 to-slate-800/90";
    case "available-soon":
      return "bg-gradient-to-br from-slate-600/85 via-slate-700/90 to-slate-800/90";
    default:
      return "bg-slate-700/90";
  }
};

const getTableSize = (shape: Table["shape"]) => {
  switch (shape) {
    case "small":
      return "w-32 h-24";
    case "medium":
      return "w-40 h-28";
    case "large":
      return "w-60 h-28";
    default:
      return "w-32 h-24";
  }
};

export default function TableBookingGrid({
  tables,
  selectedTable,
  onSelectTable,
}: TableBookingGridProps) {
  return (
    <div className="grid grid-cols-3 gap-10 p-8">
      {tables.map((table) => {
        const seatPositions = getSeatPositions(
          table.seats.length,
          table.shape,
          "grid"
        );

        return (
          <div
            key={table.id}
            className="relative flex items-center justify-center"
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => onSelectTable(table.id)}
                className={`${getTableSize(table.shape)} ${getStatusBackground(
                  table.status
                )} ${getStatusBorder(
                  table.status
                )} border-[3px] rounded-xl flex flex-col items-center justify-center transition-all hover:scale-105 shadow-lg shadow-black/10 backdrop-blur ${
                  selectedTable === table.id
                    ? "ring-4 ring-orange-500 ring-offset-4 ring-offset-white"
                    : "ring-0"
                }`}
              >
                <span className="text-white/90 font-semibold text-lg tracking-wide">
                  {table.id}
                </span>
                <span className="text-white/60 text-xs">
                  {table.capacity}.0
                </span>
              </button>

              {table.seats.map((seat, idx) => {
                const position = seatPositions[idx] || {};
                return (
                  <div
                    key={seat.id}
                    className={`absolute w-6 h-6 rounded-full border-[3px] border-white shadow-md ${
                      seatStatusClasses[seat.status] || "bg-gray-300"
                    }`}
                    style={position}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
