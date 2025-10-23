import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TableBookingGrid from "../components/TableBookingGrid";
import { tablesData } from "../data/tableData";
import SeatSelectionModal from "../components/SeatSelectionModal";
import PaymentModal from "../components/PaymentModal";
import { Seat, Table as TableType, TableStatus } from "../types/table";
import { useCart } from "../hooks/useContexts";

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

export default function Table() {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateSeatInfo, clearCart, refreshCart } = useCart();
  const [tables, setTables] = useState<TableType[]>(tablesData);
  const [selectedTable, setSelectedTable] = useState<string | null>("T-01");
  const [activeTab, setActiveTab] = useState<"all" | "reservation" | "running">(
    "all"
  );
  const [modalTableId, setModalTableId] = useState<string | null>(null);

  // Cart checkout mode states
  const [isCartCheckoutMode, setIsCartCheckoutMode] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);
  const [selectedSeatsForCart, setSelectedSeatsForCart] = useState<CartItem[]>(
    []
  );
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Initialize cart checkout mode from location state
  useEffect(() => {
    const state = location.state as {
      fromCart?: boolean;
      cartItems?: CartItem[];
    };
    if (state?.fromCart && state?.cartItems) {
      setIsCartCheckoutMode(true);
      setCartItems(state.cartItems);
      setSelectedSeatsForCart(state.cartItems.map((item) => ({ ...item })));
      setCurrentFoodIndex(0);
    }
  }, [location.state]);

  const currentCartItem = isCartCheckoutMode
    ? selectedSeatsForCart[currentFoodIndex]
    : null;

  const selectedTableData = useMemo(
    () => tables.find((table) => table.id === selectedTable) || null,
    [tables, selectedTable]
  );

  const modalTable = useMemo(
    () =>
      modalTableId
        ? tables.find((table) => table.id === modalTableId) || null
        : null,
    [modalTableId, tables]
  );

  const deriveTableStatus = (seats: Seat[]): TableStatus => {
    if (seats.every((seat) => seat.status === "billed")) {
      return "billed";
    }

    if (
      seats.some(
        (seat) => seat.status === "reserved" || seat.status === "occupied"
      )
    ) {
      return "reserved";
    }

    if (seats.some((seat) => seat.status === "available-soon")) {
      return "available-soon";
    }

    return "available";
  };

  const handleToggleSeat = (tableId: string, seatId: string) => {
    // Logic bình thường cho table page - chỉ toggle seat status
    setTables((prevTables) =>
      prevTables.map((table) => {
        if (table.id !== tableId) {
          return table;
        }

        const updatedSeats: Seat[] = table.seats.map((seat): Seat => {
          if (seat.id !== seatId) {
            return seat;
          }

          if (seat.status === "available" || seat.status === "available-soon") {
            return { ...seat, status: "selected" };
          }

          if (seat.status === "selected") {
            return { ...seat, status: "available" };
          }

          return seat;
        });

        return {
          ...table,
          seats: updatedSeats,
          status: deriveTableStatus(updatedSeats),
        };
      })
    );
  };

  // Callback khi nhấn "Đặt ghế" trong cart checkout mode
  const handleCartReserveComplete = (
    selectedSeats: { tableId: string; seatId: string }[]
  ) => {
    if (selectedSeats.length === 0) return;

    // Lấy ghế đầu tiên (vì mỗi món chỉ chọn 1 ghế)
    const seatInfo = selectedSeats[0];

    // Cập nhật thông tin ghế cho món hiện tại
    const updatedSeats = [...selectedSeatsForCart];
    updatedSeats[currentFoodIndex] = {
      ...updatedSeats[currentFoodIndex],
      seatInfo,
    };
    setSelectedSeatsForCart(updatedSeats);

    // Lưu vào context
    updateSeatInfo(updatedSeats[currentFoodIndex].id, seatInfo);

    // Đóng modal và reset table seats
    setModalTableId(null);
    setTables(tablesData); // Reset về trạng thái ban đầu

    // Chuyển sang món tiếp theo hoặc thanh toán
    if (currentFoodIndex < cartItems.length - 1) {
      setCurrentFoodIndex(currentFoodIndex + 1);
    } else {
      // Đã chọn xong tất cả, mở modal thanh toán
      setIsPaymentModalOpen(true);
    }
  };

  const handleSelectTable = (tableId: string, openModal = true) => {
    setSelectedTable(tableId);
    if (openModal) {
      setModalTableId(tableId);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Trống";
      case "reserved":
        return "Đã đặt";
      case "billed":
        return "Đã tính tiền";
      case "available-soon":
        return "Sắp trống";
      default:
        return status;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6">
        <div className="flex gap-6 max-w-[1800px] mx-auto">
          <Sidebar />

          <div className="flex-1">
            <Navbar />

            {/* Cart Checkout Mode Banner */}
            {isCartCheckoutMode && currentCartItem && (
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow-md">
                      <img
                        src={currentCartItem.image}
                        alt={currentCartItem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1">
                        Chọn ghế cho: {currentCartItem.name}
                      </h3>
                      <p className="text-orange-100">
                        Món {currentFoodIndex + 1} / {cartItems.length} - Chọn
                        bàn và ghế bên dưới
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartCheckoutMode(false);
                      navigate("/");
                    }}
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold transition-all"
                  >
                    Hủy
                  </button>
                </div>

                {/* Progress bar */}
                <div className="mt-4 bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-300"
                    style={{
                      width: `${
                        ((currentFoodIndex + 1) / cartItems.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                      activeTab === "all"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Tất cả bàn
                  </button>
                  <button
                    onClick={() => setActiveTab("reservation")}
                    className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                      activeTab === "reservation"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Đã đặt trước
                  </button>
                  <button
                    onClick={() => setActiveTab("running")}
                    className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                      activeTab === "running"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Đang phục vụ
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                    <span className="text-sm text-gray-600">Trống</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                    <span className="text-sm text-gray-600">Đã đặt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="text-sm text-gray-600">Đã tính tiền</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span className="text-sm text-gray-600">Sắp trống</span>
                  </div>
                </div>

                <button className="px-6 py-2.5 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Tạo đơn hàng
                </button>
              </div>

              <TableBookingGrid
                tables={tables}
                selectedTable={selectedTable}
                onSelectTable={(tableId) => handleSelectTable(tableId, true)}
              />
            </div>
          </div>

          <div className="w-80 bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">📋</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Thông tin bàn</h3>
                <p className="text-sm text-gray-500">Đơn hàng #102</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {tables.map((table) => {
                const getStatusBg = (status: string) => {
                  switch (status) {
                    case "available":
                      return "bg-purple-500";
                    case "reserved":
                      return "bg-orange-500";
                    case "billed":
                      return "bg-green-500";
                    case "available-soon":
                      return "bg-yellow-500";
                    default:
                      return "bg-gray-500";
                  }
                };

                return (
                  <button
                    key={table.id}
                    onClick={() => handleSelectTable(table.id, true)}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                      selectedTable === table.id
                        ? `${getStatusBg(table.status)} text-white`
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {table.id}
                  </button>
                );
              })}
            </div>

            {selectedTableData && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600">Số bàn</span>
                  <span className="font-bold text-gray-800">
                    {selectedTableData.id}
                  </span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600">Sức chứa</span>
                  <span className="font-bold text-gray-800">
                    {selectedTableData.capacity} người
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái</span>
                  <span className="font-bold text-orange-600">
                    {getStatusLabel(selectedTableData.status)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {modalTable && (
        <SeatSelectionModal
          table={modalTable}
          onClose={() => {
            setModalTableId(null);
            // Reset table seats khi đóng modal trong cart mode
            if (isCartCheckoutMode) {
              setTables(tablesData);
            }
          }}
          onToggleSeat={(seatId) => handleToggleSeat(modalTable.id, seatId)}
          isCartCheckoutMode={isCartCheckoutMode}
          onReserveComplete={
            isCartCheckoutMode ? handleCartReserveComplete : undefined
          }
        />
      )}

      {/* Payment Modal for Cart Checkout */}
      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={true}
          onClose={() => setIsPaymentModalOpen(false)}
          totalAmount={
            selectedSeatsForCart.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0
            ) * 1.1
          }
          orderItems={selectedSeatsForCart.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            seatInfo: item.seatInfo,
          }))}
          onPaymentSuccess={async () => {
            await clearCart();
            await refreshCart(); // Đảm bảo UI giỏ hàng được cập nhật
            setIsPaymentModalOpen(false);
            setIsCartCheckoutMode(false);
            navigate("/");
          }}
        />
      )}
    </>
  );
}
