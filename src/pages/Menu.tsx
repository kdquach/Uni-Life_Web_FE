import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import FoodCard from "../components/FoodCard";
import CartSummary from "../components/CartSummary";
import { menuItems } from "../data/menuData";
import { useCart } from "../hooks/useContexts";

export default function Menu() {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");

  const categoryNames: Record<string, string> = {
    douong: "Đồ uống",
    monan: "Món ăn",
    pizza: "Pizza",
    sup: "Súp",
  };

  const filteredItems = useMemo(() => {
    let items = menuItems;

    // Filter by category if present
    if (category) {
      items = items.filter((item) => item.category === category);
    }

    // Filter by search query
    if (searchQuery) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  }, [category, searchQuery]);

  const handleAddToCart = async (id: number) => {
    const item = menuItems.find((m) => m.id === id);
    if (!item) return;

    try {
      await addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6">
      <div className="flex gap-6 max-w-[1800px] mx-auto">
        <Sidebar />

        <div className="flex-1">
          <Navbar onSearch={setSearchQuery} />

          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {category ? categoryNames[category] || "Thực đơn" : "Thực đơn"}
            </h2>
            <p className="text-gray-600">
              {category
                ? `Chọn ${categoryNames[
                    category
                  ]?.toLowerCase()} yêu thích của bạn`
                : "Chọn từ danh sách món ngon của chúng tôi"}
            </p>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Không tìm thấy món ăn phù hợp
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <FoodCard
                  key={item.id}
                  {...item}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>

        <CartSummary />
      </div>
    </div>
  );
}
