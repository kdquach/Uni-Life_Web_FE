import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  seatInfo?: {
    tableId: string;
    seatId: string;
  };
}

interface FoodSeatSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onComplete: (itemsWithSeats: CartItem[]) => void;
}

// Mock data cho bàn và ghế
const AVAILABLE_TABLES = [
  { id: "A1", name: "Bàn A1", seats: ["A1-1", "A1-2", "A1-3", "A1-4"] },
  { id: "A2", name: "Bàn A2", seats: ["A2-1", "A2-2", "A2-3", "A2-4"] },
  { id: "B1", name: "Bàn B1", seats: ["B1-1", "B1-2", "B1-3", "B1-4"] },
  { id: "B2", name: "Bàn B2", seats: ["B2-1", "B2-2", "B2-3", "B2-4"] },
  {
    id: "C1",
    name: "Bàn C1",
    seats: ["C1-1", "C1-2", "C1-3", "C1-4", "C1-5", "C1-6"],
  },
];

export default function FoodSeatSelectionModal({
  isOpen,
  onClose,
  cartItems,
  onComplete,
}: FoodSeatSelectionModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<CartItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [selectedSeat, setSelectedSeat] = useState<string>("");

  // Cập nhật selectedSeats khi cartItems thay đổi hoặc modal mở
  useEffect(() => {
    if (isOpen && cartItems.length > 0) {
      setSelectedSeats(cartItems.map((item) => ({ ...item })));
      setCurrentIndex(0);
      setSelectedTable("");
      setSelectedSeat("");
    }
  }, [isOpen, cartItems]);

  console.log(
    "FoodSeatSelectionModal - isOpen:",
    isOpen,
    "cartItems:",
    cartItems,
    "selectedSeats:",
    selectedSeats
  );

  if (!isOpen) return null;

  // Kiểm tra an toàn: nếu không có items hoặc index vượt quá
  if (cartItems.length === 0 || currentIndex >= selectedSeats.length) {
    console.error(
      "Invalid state - cartItems length:",
      cartItems.length,
      "currentIndex:",
      currentIndex,
      "selectedSeats length:",
      selectedSeats.length
    );
    return null;
  }

  const currentItem = selectedSeats[currentIndex];

  // Kiểm tra thêm nếu currentItem vẫn undefined
  if (!currentItem) {
    return null;
  }

  const usedSeats = selectedSeats
    .filter((item, idx) => idx < currentIndex && item.seatInfo)
    .map((item) => item.seatInfo!.seatId);

  const handleSelectSeat = () => {
    if (!selectedTable || !selectedSeat) {
      alert("Vui lòng chọn bàn và ghế!");
      return;
    }

    const updatedItems = [...selectedSeats];
    updatedItems[currentIndex] = {
      ...currentItem,
      seatInfo: {
        tableId: selectedTable,
        seatId: selectedSeat,
      },
    };
    setSelectedSeats(updatedItems);

    // Reset selection
    setSelectedTable("");
    setSelectedSeat("");

    // Move to next item or complete
    if (currentIndex < cartItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(updatedItems);
      onClose();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // Load previous selection
      const prevItem = selectedSeats[currentIndex - 1];
      if (prevItem.seatInfo) {
        setSelectedTable(prevItem.seatInfo.tableId);
        setSelectedSeat(prevItem.seatInfo.seatId);
      }
    }
  };

  const handleSkip = () => {
    if (currentIndex < cartItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedTable("");
      setSelectedSeat("");
    }
  };

  const availableSeats =
    AVAILABLE_TABLES.find((t) => t.id === selectedTable)?.seats.filter(
      (seat) => !usedSeats.includes(seat)
    ) || [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Chọn ghế cho món ăn</h2>
              <p className="text-orange-100 text-sm">
                Món {currentIndex + 1} / {cartItems.length} - Mỗi món cần 1 ghế
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Food Item */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow-md">
                <img
                  src={currentItem.image}
                  alt={currentItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">
                  {currentItem.name}
                </h3>
                <p className="text-gray-600 mt-1">
                  Số lượng: {currentItem.quantity}
                </p>
                <p className="text-orange-600 font-bold mt-1">
                  {currentItem.price.toLocaleString("vi-VN")} đ
                </p>
              </div>
            </div>
          </div>

          {/* Table Selection */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3 text-lg">
              1. Chọn bàn
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {AVAILABLE_TABLES.map((table) => (
                <button
                  key={table.id}
                  onClick={() => {
                    setSelectedTable(table.id);
                    setSelectedSeat("");
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedTable === table.id
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-gray-200 hover:border-orange-300 bg-white"
                  }`}
                >
                  <p className="font-bold text-gray-800">{table.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {table.seats.length} ghế
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Seat Selection */}
          {selectedTable && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3 text-lg">
                2. Chọn ghế tại{" "}
                {AVAILABLE_TABLES.find((t) => t.id === selectedTable)?.name}
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {availableSeats.map((seat) => (
                  <button
                    key={seat}
                    onClick={() => setSelectedSeat(seat)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedSeat === seat
                        ? "border-orange-500 bg-orange-50 shadow-md"
                        : "border-gray-200 hover:border-orange-300 bg-white"
                    }`}
                  >
                    <p className="font-bold text-gray-800">{seat}</p>
                  </button>
                ))}
              </div>
              {availableSeats.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Không còn ghế trống tại bàn này
                </p>
              )}
            </div>
          )}

          {/* Selected seats summary */}
          {currentIndex > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-bold text-gray-800 mb-2 text-sm">Đã chọn:</h4>
              <div className="space-y-1">
                {selectedSeats.slice(0, currentIndex).map((item, idx) => (
                  <p key={idx} className="text-sm text-gray-600">
                    • {item.name}:{" "}
                    {item.seatInfo
                      ? `${item.seatInfo.tableId} - ${item.seatInfo.seatId}`
                      : "Chưa chọn"}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {currentIndex > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                Quay lại
              </button>
            )}
            <button
              onClick={handleSkip}
              className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
            >
              Bỏ qua
            </button>
            <button
              onClick={handleSelectSeat}
              disabled={!selectedTable || !selectedSeat}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {currentIndex < cartItems.length - 1 ? "Tiếp theo" : "Hoàn tất"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
