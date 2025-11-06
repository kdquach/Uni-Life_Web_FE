import {
  Search,
  MessageCircle,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useContexts";
import { useToast } from "../hooks/useToast";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const navigate = useNavigate();
  const { user, logout: authLogout, isAuthenticated } = useAuth();
  const toast = useToast();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Đóng dropdown khi click ra ngoài
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    authLogout();
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const handleProfile = () => {
    setIsDropdownOpen(false);
    navigate("/profile");
  };

  const handleSettings = () => {
    setIsDropdownOpen(false);
    // TODO: Navigate to settings page
    toast.info("Trang cài đặt đang được phát triển");
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between mb-4 sm:mb-6">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <button
          onClick={() => navigate("/")}
          className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer flex-shrink-0"
        >
          <img
            src="/Logo_mau.png"
            alt="UniLife Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-full object-cover"
          />
        </button>

        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm món ăn"
            className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl border-none outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm sm:text-base"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
        <button className="hidden sm:flex relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </button>
        <button className="hidden sm:flex relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>

        {/* Avatar với Dropdown */}
        {isAuthenticated && user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 sm:gap-2 hover:bg-gray-50 rounded-lg p-1 pr-2 sm:pr-3 transition-colors"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src={
                    user.avatar ||
                    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
                  }
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown
                className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-600 transition-transform hidden sm:block ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-800">{user.fullName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={handleProfile}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-orange-50 transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Hồ sơ của tôi</span>
                  </button>

                  <button
                    onClick={handleSettings}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-orange-50 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Cài đặt</span>
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-red-50 transition-colors text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Đăng nhập
          </button>
        )}
      </div>
    </div>
  );
}
