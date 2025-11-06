import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth, useCart } from "../hooks/useContexts";
import { useToast } from "../hooks/useToast";
import { useState } from "react";

export default function CartSummary() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, updateQuantity } = useCart();
  const toast = useToast();
  const [showMobileCart, setShowMobileCart] = useState(false);

  // Nếu chưa đăng nhập, hiển thị thông báo
  if (!isAuthenticated) {
    return (
      <div className="hidden xl:block w-80 lg:w-96 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-6 h-fit sticky top-6">
        <div className="text-center py-8">
          <div className="mb-4">
            <svg
              className="w-20 h-20 mx-auto text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Vui lòng đăng nhập
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Bạn cần đăng nhập để xem giỏ hàng và đặt món
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // Định dạng tiền tệ kiểu Việt Nam
  const formatCurrency = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning("Giỏ hàng trống! Vui lòng thêm món trước khi thanh toán.");
      return;
    }
    // Chuyển sang trang Table để chọn ghế
    navigate("/table", { state: { fromCart: true, cartItems } });
    // Hiển thị thông báo hướng dẫn
    toast.info("Vui lòng chọn bàn và ghế cho từng món ăn");
  };

  return (
    <div className="hidden xl:block w-80 lg:w-96 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-6 h-fit sticky top-6">
      {/* --- Nút lựa chọn hình thức --- */}
      <div className="flex gap-3 mb-6">
        <button className="flex-1 bg-white text-gray-700 py-2.5 rounded-lg font-semibold shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors">
          Mua ngay
        </button>
        <button className="flex-1 bg-gray-50 text-gray-500 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Đặt trước
        </button>
      </div>

      {/* --- Thông tin người dùng --- */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={
              user?.avatar ||
              "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
            }
            alt={user?.fullName}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">{user?.fullName}</h3>
          <p className="text-sm text-gray-500">{user?.address || "Việt Nam"}</p>
        </div>
      </div>

      {/* --- Danh sách đơn hàng --- */}
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 mb-4">Đơn hàng của bạn</h3>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 text-sm">
                  {item.name}
                </h4>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <span className="text-sm font-semibold text-gray-700">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-orange-500">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Tính tổng --- */}
      <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Tạm tính</span>
          <span className="font-semibold">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Thuế (10%)</span>
          <span className="font-semibold">{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between text-gray-800 text-lg font-bold">
          <span>Tổng cộng</span>
          <span className="text-orange-500">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* --- Nút thanh toán --- */}
      <button
        onClick={handleCheckout}
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all"
      >
        Thanh toán ngay
      </button>

      {/* Mobile Floating Cart Button */}
      {isAuthenticated && (
        <>
          <button
            onClick={() => setShowMobileCart(true)}
            className="xl:hidden fixed bottom-20 right-4 z-40 bg-gradient-to-r from-orange-500 to-orange-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartItems.length}
              </span>
            )}
          </button>

          {/* Mobile Cart Modal */}
          {showMobileCart && (
            <div className="xl:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end">
              <div className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto p-6 animate-in slide-in-from-bottom duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Giỏ hàng ({cartItems.length})
                  </h2>
                  <button
                    onClick={() => setShowMobileCart(false)}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Info */}
                {user && (
                  <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={
                          user.avatar ||
                          "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
                        }
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {user.fullName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {user.address || "Việt Nam"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Cart Items */}
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Giỏ hàng trống</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 bg-gray-50 rounded-xl p-4"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 text-sm mb-1 truncate">
                              {item.name}
                            </h4>
                            <p className="text-orange-500 font-bold text-sm">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200"
                            >
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="text-sm font-bold text-gray-800 w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors"
                            >
                              <Plus className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>Tạm tính</span>
                        <span className="font-semibold">
                          {formatCurrency(subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>Thuế (10%)</span>
                        <span className="font-semibold">
                          {formatCurrency(tax)}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-800 text-lg font-bold">
                        <span>Tổng cộng</span>
                        <span className="text-orange-500">
                          {formatCurrency(total)}
                        </span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={() => {
                        setShowMobileCart(false);
                        handleCheckout();
                      }}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all"
                    >
                      Thanh toán ngay
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
