import { X, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
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
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success">(
    "pending"
  );
  const [countdown, setCountdown] = useState(3);

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
    setPaymentStatus("success");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-200 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {paymentStatus === "pending" ? (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    Thanh toán đơn hàng
                  </h2>
                  {tableNumber && (
                    <p className="text-orange-100 text-sm">
                      Bàn số: {tableNumber}
                    </p>
                  )}
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
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="font-bold text-gray-800 mb-4 text-lg">
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
                <h3 className="font-bold text-gray-800 mb-4 text-lg">
                  Quét mã QR để thanh toán
                </h3>
                <div className="inline-block bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-200">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="text-gray-500 mt-4 text-sm">
                  Sử dụng ứng dụng ngân hàng để quét mã QR
                </p>

                {/* Payment Methods */}
                <div className="flex justify-center gap-4 mt-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/4/41/VietQR_Logo.png"
                      alt="VietQR"
                      className="w-6 h-6"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/24?text=VQR";
                      }}
                    />
                    <span className="text-sm font-medium text-blue-900">
                      VietQR
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-900">
                      MoMo
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-lg">
                    <span className="text-sm font-medium text-indigo-900">
                      ZaloPay
                    </span>
                  </div>
                </div>
              </div>

              {/* Demo Button */}
              <div className="text-center pt-4">
                <p className="text-gray-500 text-sm mb-3">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Đang chờ thanh toán...
                </p>
                <button
                  onClick={handleConfirmPayment}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all"
                >
                  Xác nhận đã thanh toán (Demo)
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Thanh toán thành công!
            </h2>
            <p className="text-gray-600 mb-2">
              Cảm ơn bạn đã sử dụng dịch vụ của UniLife
            </p>
            <p className="text-gray-500 text-sm">
              Tự động đóng sau {countdown} giây...
            </p>
            <div className="mt-6 p-4 bg-green-50 rounded-xl">
              <p className="font-semibold text-green-800">
                Số tiền: {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
