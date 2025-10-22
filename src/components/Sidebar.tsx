import {
  Home,
  Coffee,
  Pizza,
  Utensils,
  Soup,
  CalendarCheck,
  Wallet,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, path: "/", label: "Trang chủ", category: "" },
    {
      icon: Coffee,
      path: "/menu?category=douong",
      label: "Đồ uống",
      category: "douong",
    },
    {
      icon: Utensils,
      path: "/menu?category=monan",
      label: "Món ăn",
      category: "monan",
    },
    {
      icon: Pizza,
      path: "/menu?category=pizza",
      label: "Pizza",
      category: "pizza",
    },
    { icon: Soup, path: "/menu?category=sup", label: "Súp", category: "sup" },
    { icon: CalendarCheck, path: "/table", label: "Đặt bàn", category: "" },
    { icon: Wallet, path: "/wallet", label: "Ví", category: "" },
  ];

  const isActive = (item: (typeof menuItems)[0]) => {
    if (item.path === "/") {
      return location.pathname === "/" && !location.search;
    }
    if (item.category) {
      return location.search.includes(`category=${item.category}`);
    }
    return location.pathname === item.path && !location.search;
  };

  return (
    <div className="w-20 bg-white rounded-2xl shadow-[0_14px_50px_rgba(0,0,0,0.1)] py-6 flex flex-col items-center justify-center gap-6 sticky top-28 self-start">
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        const active = isActive(item);

        return (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              active
                ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                : "text-gray-400 hover:bg-gray-50 hover:text-orange-500"
            }`}
            title={item.label}
          >
            <Icon className="w-6 h-6" />
          </button>
        );
      })}
    </div>
  );
}
