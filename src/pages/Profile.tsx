import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  Camera,
  ShoppingBag,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/useContexts";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout: authLogout, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    avatar: "",
  });

  useEffect(() => {
    // Redirect nếu chưa đăng nhập
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    // Load dữ liệu user vào form
    setFormData({
      fullName: user.fullName,
      phone: user.phone || "",
      address: user.address || "",
      avatar: user.avatar || "",
    });
  }, [navigate, isAuthenticated, user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!user) return;

    // TODO: Implement API call để update user profile
    // Tạm thời chỉ update local state
    alert("Chức năng cập nhật profile đang được phát triển");
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await authLogout();
    navigate("/login");
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6">
      <div className="flex gap-6 max-w-[1800px] mx-auto">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          {/* Profile Header */}
          <div className="bg-white rounded-3xl shadow-[0_14px_50px_rgba(0,0,0,0.1)] overflow-hidden mb-6">
            {/* Cover Image */}
            <div className="h-48 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 relative">
              <div className="absolute inset-0 bg-black/10"></div>
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8">
              <div className="flex items-end justify-between -mt-20 mb-6">
                <div className="flex items-end gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-40 h-40 rounded-3xl border-4 border-white shadow-xl overflow-hidden bg-white">
                      <img
                        src={
                          user.avatar ||
                          "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(user.fullName)
                        }
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-2 right-2 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors">
                        <Camera className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Name & Email */}
                  <div className="mb-4">
                    <h1 className="text-3xl font-bold text-gray-800 mb-1">
                      {user.fullName}
                    </h1>
                    <p className="text-gray-500 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                      >
                        <Save className="w-5 h-5" />
                        Lưu thay đổi
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            fullName: user.fullName,
                            phone: user.phone || "",
                            address: user.address || "",
                            avatar: user.avatar || "",
                          });
                        }}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-200 transition-colors"
                      >
                        <X className="w-5 h-5" />
                        Hủy
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                    >
                      <Edit2 className="w-5 h-5" />
                      Chỉnh sửa
                    </button>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`pb-4 px-2 font-semibold transition-colors relative ${
                    activeTab === "info"
                      ? "text-orange-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Thông tin cá nhân
                  {activeTab === "info" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`pb-4 px-2 font-semibold transition-colors relative ${
                    activeTab === "orders"
                      ? "text-orange-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Đơn hàng
                  {activeTab === "orders" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("favorites")}
                  className={`pb-4 px-2 font-semibold transition-colors relative ${
                    activeTab === "favorites"
                      ? "text-orange-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Yêu thích
                  {activeTab === "favorites" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === "info" && (
                <div className="bg-white rounded-3xl shadow-[0_14px_50px_rgba(0,0,0,0.1)] p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Thông tin chi tiết
                  </h3>

                  <div className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Họ và tên
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        />
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                          <User className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">{user.fullName}</span>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-xl cursor-not-allowed">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-500">{user.email}</span>
                        <span className="ml-auto text-xs text-gray-400">
                          Không thể thay đổi
                        </span>
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Nhập số điện thoại"
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                        />
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">
                            {user.phone || "Chưa cập nhật"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Địa chỉ
                      </label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Nhập địa chỉ"
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
                        />
                      ) : (
                        <div className="flex items-start gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                          <span className="text-gray-700">
                            {user.address || "Chưa cập nhật"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Created At */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ngày tạo tài khoản
                      </label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">
                          {user.createdAt
                            ? formatDate(user.createdAt)
                            : "Không rõ"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="bg-white rounded-3xl shadow-[0_14px_50px_rgba(0,0,0,0.1)] p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Lịch sử đơn hàng
                  </h3>
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
                    <button
                      onClick={() => navigate("/menu")}
                      className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Đặt món ngay
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "favorites" && (
                <div className="bg-white rounded-3xl shadow-[0_14px_50px_rgba(0,0,0,0.1)] p-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Món ăn yêu thích
                  </h3>
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có món ăn yêu thích</p>
                    <button
                      onClick={() => navigate("/menu")}
                      className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Khám phá thực đơn
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-3xl shadow-[0_14px_50px_rgba(0,0,0,0.1)] p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Thống kê
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        Đơn hàng
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-orange-500">
                      0
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                        <Heart className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        Yêu thích
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-red-500">0</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-3xl shadow-[0_14px_50px_rgba(0,0,0,0.1)] p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Thao tác nhanh
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 hover:text-orange-500 transition-colors text-left">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Cài đặt tài khoản</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 bg-red-50 rounded-xl hover:bg-red-100 text-red-600 transition-colors text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
