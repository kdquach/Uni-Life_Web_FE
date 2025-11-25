import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useContexts";
import { orderStorage } from "../utils/orderStorage";
import { Order } from "../types/order";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChefHat,
  ShoppingBag,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import CartSummary from "../components/CartSummary";

export default function OrderHistory() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");

  useEffect(() => {
    if (isAuthenticated && user) {
      const userOrders = orderStorage.getOrders(user.email);
      // Sắp xếp theo thời gian mới nhất
      const sortedOrders = userOrders.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Vui lòng đăng nhập
          </h2>
          <p className="text-gray-500">
            Bạn cần đăng nhập để xem lịch sử đơn hàng
          </p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusInfo = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          color: "text-yellow-600",
          bg: "bg-yellow-100",
          label: "Chờ xử lý",
        };
      case "confirmed":
        return {
          icon: CheckCircle,
          color: "text-blue-600",
          bg: "bg-blue-100",
          label: "Đã xác nhận",
        };
      case "preparing":
        return {
          icon: ChefHat,
          color: "text-orange-600",
          bg: "bg-orange-100",
          label: "Đang chuẩn bị",
        };
      case "ready":
        return {
          icon: ShoppingBag,
          color: "text-purple-600",
          bg: "bg-purple-100",
          label: "Sẵn sàng",
        };
      case "completed":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bg: "bg-green-100",
          label: "Hoàn thành",
        };
      case "cancelled":
        return {
          icon: XCircle,
          color: "text-red-600",
          bg: "bg-red-100",
          label: "Đã hủy",
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-600",
          bg: "bg-gray-100",
          label: "Không xác định",
        };
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-3 sm:p-6 pb-20 lg:pb-6">
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-6 max-w-[1800px] mx-auto">
        <Sidebar />

        <div className="flex-1 min-w-0">
          <Navbar />

          <div className="max-w-7xl">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                Lịch sử đơn hàng
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Xem lại tất cả đơn hàng của bạn
              </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
                    filter === "all"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Tất cả ({orders.length})
                </button>
                <button
                  onClick={() => setFilter("confirmed")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
                    filter === "confirmed"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Đã xác nhận
                </button>
                <button
                  onClick={() => setFilter("preparing")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
                    filter === "preparing"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Đang chuẩn bị
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors ${
                    filter === "completed"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Hoàn thành
                </button>
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-700 mb-2">
                  Chưa có đơn hàng
                </h3>
                <p className="text-gray-500">
                  Bạn chưa có đơn hàng nào trong danh mục này
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      {/* Order Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {order.orderNumber}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-1 ${statusInfo.bg} ${statusInfo.color} px-3 py-1 rounded-full`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          <span className="text-xs font-semibold">
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-2 mb-4">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-gray-600">
                              {item.name} x{item.quantity}
                            </span>
                            <span className="font-semibold text-gray-800">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-gray-500">
                            và {order.items.length - 2} món khác...
                          </p>
                        )}
                      </div>

                      {/* Total */}
                      <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                        <span className="text-gray-600 font-semibold">
                          Tổng cộng
                        </span>
                        <span className="text-lg font-bold text-orange-600">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Detail Modal */}
          {selectedOrder && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-3 sm:p-4"
              onClick={() => setSelectedOrder(null)}
            >
              <div
                className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold mb-1">
                        Chi tiết đơn hàng
                      </h2>
                      <p className="text-orange-100 text-xs sm:text-sm">
                        {selectedOrder.orderNumber}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                    >
                      <span className="text-2xl">×</span>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  {/* Status */}
                  <div className="mb-6">
                    {(() => {
                      const statusInfo = getStatusInfo(selectedOrder.status);
                      const StatusIcon = statusInfo.icon;
                      return (
                        <div
                          className={`${statusInfo.bg} rounded-xl p-4 flex items-center gap-3`}
                        >
                          <StatusIcon
                            className={`w-6 h-6 ${statusInfo.color}`}
                          />
                          <div>
                            <p className="font-bold text-gray-800">
                              {statusInfo.label}
                            </p>
                            <p className="text-xs text-gray-600">
                              {formatDate(selectedOrder.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* QR Code */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 sm:p-6 mb-6">
                    <h3 className="font-bold text-gray-800 mb-3 text-base sm:text-lg text-center">
                      Mã QR nhận món
                    </h3>
                    <div className="bg-white p-4 sm:p-6 rounded-xl border-2 border-orange-300 mx-auto w-fit">
                      <img
                        src={selectedOrder.qrCode}
                        alt="Bill QR Code"
                        className="w-48 h-48 sm:w-56 sm:h-56 mx-auto"
                      />
                    </div>

                    <p className="text-gray-600 mt-3 text-xs sm:text-sm text-center">
                      📱 Đưa mã QR này cho nhân viên để nhận món
                    </p>
                  </div>

                  {/* Items */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h3 className="font-bold text-gray-800 mb-3 text-base sm:text-lg">
                      Chi tiết món ăn
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-start border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                        >
                          <div>
                            <p className="text-gray-700 font-medium">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Số lượng: {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-800">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Tạm tính</span>
                        <span>{formatCurrency(selectedOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Thuế (10%)</span>
                        <span>{formatCurrency(selectedOrder.tax)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-orange-600 pt-2 border-t border-gray-200">
                        <span>Tổng cộng</span>
                        <span>{formatCurrency(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <CartSummary />
      </div>
    </div>
  );
}
