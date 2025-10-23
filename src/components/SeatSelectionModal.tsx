import { useMemo, useState } from "react";
import { Table, SeatStatus } from "../types/table";
import { getSeatPositions } from "../utils/seating";
import PaymentModal from "./PaymentModal";

interface SeatSelectionModalProps {
  table: Table;
  onClose: () => void;
  onToggleSeat: (seatId: string) => void;
  onReserveComplete?: (
    selectedSeats: { tableId: string; seatId: string }[]
  ) => void;
  isCartCheckoutMode?: boolean;
}

const seatStatusClasses: Record<SeatStatus, string> = {
  available: "bg-purple-500",
  reserved: "bg-orange-500",
  billed: "bg-green-500",
  "available-soon": "bg-yellow-400",
  occupied: "bg-gray-500",
  selected: "bg-indigo-500",
};

const seatStatusLabels: Record<SeatStatus, string> = {
  available: "Còn trống",
  reserved: "Đã đặt",
  billed: "Đã thanh toán",
  "available-soon": "Sắp trống",
  occupied: "Đang có khách",
  selected: "Đã chọn",
};

export default function SeatSelectionModal({
  table,
  onClose,
  onToggleSeat,
  onReserveComplete,
  isCartCheckoutMode = false,
}: SeatSelectionModalProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const seatPositions = useMemo(
    () => getSeatPositions(table.seats.length, table.shape, "modal"),
    [table]
  );

  const selectableStatuses: SeatStatus[] = [
    "available",
    "available-soon",
    "selected",
  ];
  const selectedSeats = table.seats.filter(
    (seat) => seat.status === "selected"
  );

  // Giá mỗi ghế (demo)
  const SEAT_PRICE = 50000;

  const handleReserveSeats = () => {
    if (selectedSeats.length === 0) return;

    // Nếu đang ở cart checkout mode, gọi callback để xử lý bên ngoài
    if (isCartCheckoutMode && onReserveComplete) {
      const seatsInfo = selectedSeats.map((seat) => ({
        tableId: table.id,
        seatId: seat.id,
      }));
      onReserveComplete(seatsInfo);
      onClose(); // Đóng modal
      return;
    }

    // Mode bình thường: mở payment modal
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    // Sau khi thanh toán thành công, đóng modal
    alert(`Đã đặt thành công ${selectedSeats.length} ghế tại bàn ${table.id}!`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
          aria-label="Đóng chọn chỗ ngồi"
        >
          ×
        </button>

        <div className="grid gap-10 p-10 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{table.id}</h2>
                <p className="text-md text-gray-500">
                  Chọn chỗ ngồi để đặt riêng.
                </p>
              </div>
              <div className="rounded-full bg-gray-100 px-4 py-2 text-md font-semibold text-gray-600">
                Sức chứa: {table.capacity}
              </div>
            </div>

            <div className="relative mx-auto mt-14 h-64 w-full max-w-md">
              <div className="absolute inset-4 rounded-2xl border-[6px] border-white/60 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 shadow-2xl" />

              {table.seats.map((seat, index) => {
                const position = seatPositions[index] || {};
                const isSelectable = selectableStatuses.includes(seat.status);

                return (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => isSelectable && onToggleSeat(seat.id)}
                    disabled={!isSelectable}
                    className={`absolute flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border-[4px] border-white text-xl font-semibold text-white shadow-lg transition ${
                      seatStatusClasses[seat.status]
                    } ${
                      isSelectable
                        ? "hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        : "cursor-not-allowed opacity-60"
                    } ${
                      seat.status === "selected" ? "ring-4 ring-indigo-200" : ""
                    }`}
                    style={position}
                  >
                    {seat.label.replace("Seat ", "S")}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Trạng thái chỗ ngồi
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                {Object.entries(seatStatusLabels).map(([status, label]) => (
                  <li key={status} className="flex items-center gap-3">
                    <span
                      className={`h-3.5 w-3.5 rounded-full ${
                        seatStatusClasses[status as SeatStatus]
                      }`}
                    />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-gray-50 p-6">
              <h4 className="mb-3 text-base font-semibold text-gray-800">
                Chỗ ngồi đã chọn
              </h4>
              {selectedSeats.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat.id}
                      className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700"
                    >
                      {seat.label}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Chưa chọn chỗ nào. Hãy nhấn vào ghế trống để thêm vào đặt chỗ.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleReserveSeats}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectedSeats.length === 0}
            >
              {selectedSeats.length > 0
                ? `Đặt ${selectedSeats.length} ghế`
                : "Đặt ghế"}
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={selectedSeats.length * SEAT_PRICE}
        orderItems={selectedSeats.map((seat) => ({
          name: `${table.id} - ${seat.label}`,
          quantity: 1,
          price: SEAT_PRICE,
        }))}
        tableNumber={table.id}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
