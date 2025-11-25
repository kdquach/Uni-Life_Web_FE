import { X, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useContexts";
import { orderStorage } from "../utils/orderStorage";
import { Order } from "../types/order";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
    seatInfo?: {
      tableId: string;
      seatId: string;
    };
  }>;
  tableNumber?: string;
  onPaymentSuccess: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  totalAmount,
  orderItems,
  tableNumber,
  onPaymentSuccess,
}: PaymentModalProps) {
  const { user } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success">(
    "pending"
  );
  const [countdown, setCountdown] = useState(10);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Reset state khi modal mở
  useEffect(() => {
    if (isOpen) {
      setPaymentStatus("pending");
      setCountdown(10);
      setCurrentOrder(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (paymentStatus === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (paymentStatus === "success" && countdown === 0) {
      onPaymentSuccess();
      onClose();
    }
  }, [paymentStatus, countdown, onPaymentSuccess, onClose]);

  if (!isOpen) return null;

  const formatCurrency = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;

  // Tạo QR code (giả lập)
  const qrCodeData = `unilife://pay?amount=${totalAmount}&table=${
    tableNumber || "N/A"
  }`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    qrCodeData
  )}`;

  const handleConfirmPayment = () => {
    if (!user) return;

    // Tạo order ID và order number
    const orderId = `ORD-${Date.now()}`;
    const orderNumber = `#${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`;

    // Tạo QR code cho bill
    const billQRData = `unilife://order/${orderId}`;
    const billQRUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      billQRData
    )}`;

    // Tạo order object
    const newOrder: Order = {
      id: orderId,
      orderNumber: orderNumber,
      items: orderItems.map((item) => ({
        id: Date.now() + Math.random(),
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: "", // Có thể thêm image URL nếu cần
      })),
      subtotal: subtotal,
      tax: tax,
      total: totalAmount,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      qrCode: billQRUrl,
      userName: user.fullName,
      userEmail: user.email,
    };

    // Lưu vào localStorage
    orderStorage.saveOrder(newOrder);

    // Cập nhật state
    setCurrentOrder(newOrder);
    setPaymentStatus("success");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-3 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {paymentStatus === "pending" ? (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1">
                    Thanh toán đơn hàng
                  </h2>
                  {tableNumber && (
                    <p className="text-orange-100 text-xs sm:text-sm">
                      Bàn số: {tableNumber}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-5">
                <h3 className="font-bold text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg">
                  Chi tiết đơn hàng
                </h3>
                <div className="space-y-3">
                  {orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex-1">
                        <p className="text-gray-700 font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Số lượng: {item.quantity}
                        </p>
                        {item.seatInfo && (
                          <div className="mt-1 inline-flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                            <span className="text-xs font-semibold text-orange-600">
                              📍 {item.seatInfo.tableId} -{" "}
                              {item.seatInfo.seatId}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-gray-800 ml-3">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Thuế (10%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-orange-600 pt-2 border-t border-gray-200">
                    <span>Tổng cộng</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center">
                <h3 className="font-bold text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg">
                  Quét mã QR để thanh toán
                </h3>
                <div className="inline-block bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border-2 border-orange-200">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-36 h-36 sm:w-48 sm:h-48 mx-auto"
                  />
                </div>
                <p className="text-gray-500 mt-3 sm:mt-4 text-xs sm:text-sm">
                  Sử dụng ứng dụng ngân hàng để quét mã QR
                </p>

                {/* Payment Methods */}
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/VietQR_Logo.svg/1200px-VietQR_Logo.svg.png?20250310160241"
                      alt="VietQR"
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <img
                      src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png"
                      alt="MoMo"
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                    <img
                      src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png"
                      alt="ZaloPay"
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Demo Button */}
              <div className="text-center pt-3 sm:pt-4">
                <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                  Đang chờ thanh toán...
                </p>
                <button
                  onClick={handleConfirmPayment}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg sm:rounded-xl font-bold text-sm sm:text-base hover:shadow-lg hover:shadow-green-500/30 transition-all"
                >
                  Xác nhận đã thanh toán (Demo)
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 sm:p-6 lg:p-8 text-center max-h-[90vh] overflow-y-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Đặt hàng thành công!
            </h2>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Mã đơn hàng:{" "}
              <span className="font-bold text-orange-600">
                {currentOrder?.orderNumber}
              </span>
            </p>

            {/* Bill QR Code with Food Images */}
            {currentOrder && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 sm:p-6 mb-4 relative overflow-hidden">
                <h3 className="font-bold text-gray-800 mb-3 text-base sm:text-lg relative z-10">
                  Chi tiết đơn hàng
                </h3>

                {/* Layout với QR code và hình ảnh món ăn */}
                <div className="relative">
                  {/* Grid chứa món ăn và QR */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* Món 1 - Top Left */}
                    <div className="flex justify-start">
                      {currentOrder.items[0] && (
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <img
                            src={
                              orderItems[0]?.image ||
                              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200"
                            }
                            alt={currentOrder.items[0].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Món 2 - Top Right */}
                    <div className="flex justify-end">
                      {currentOrder.items[1] && (
                        <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <img
                            src={
                              orderItems[1]?.image ||
                              "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200"
                            }
                            alt={currentOrder.items[1].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* QR Code ở giữa */}
                  <div className="flex justify-center -mt-6 mb-3 relative z-20">
                    <div className="bg-white p-3 sm:p-4 rounded-2xl border-4 border-orange-300 shadow-2xl">
                      <img
                        src={currentOrder.qrCode}
                        alt="Bill QR Code"
                        className="w-40 h-40 sm:w-48 sm:h-48"
                      />
                    </div>
                  </div>

                  {/* Grid chứa món ăn phía dưới */}
                  <div className="grid grid-cols-2 gap-3 -mt-6">
                    {/* Món 3 - Bottom Left */}
                    <div className="flex justify-start items-end">
                      {currentOrder.items[2] && (
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <img
                            src={
                              orderItems[2]?.image ||
                              "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=200"
                            }
                            alt={currentOrder.items[2].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Món 4 - Bottom Right */}
                    <div className="flex justify-end items-end">
                      {currentOrder.items[3] && (
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <img
                            src={
                              orderItems[3]?.image ||
                              "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200"
                            }
                            alt={currentOrder.items[3].name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mt-4 text-xs sm:text-sm text-center relative z-10">
                  Sử dụng ứng dụng ngân hàng để quét mã QR
                </p>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
              <h3 className="font-bold text-gray-800 mb-3 text-sm sm:text-base">
                Chi tiết đơn hàng
              </h3>
              <div className="space-y-2 text-xs sm:text-sm">
                {currentOrder?.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-semibold text-gray-800">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-3 pt-3">
                <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(currentOrder?.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
                  <span>Thuế (10%)</span>
                  <span>{formatCurrency(currentOrder?.tax || 0)}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-bold text-orange-600">
                  <span>Tổng cộng</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4">
              <p className="text-blue-800 text-xs sm:text-sm">
                💡 <strong>Lưu ý:</strong> Bạn có thể xem lại đơn hàng này trong
                phần <strong>Lịch sử đơn hàng</strong>
              </p>
            </div>

            <p className="text-gray-500 text-xs sm:text-sm mb-3">
              Tự động đóng sau {countdown} giây...
            </p>

            <button
              onClick={() => {
                onPaymentSuccess();
                onClose();
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
