import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import FoodCard from "../components/FoodCard";
import CartSummary from "../components/CartSummary";
import { menuItems, defaultCartItems } from "../data/menuData";

export default function Home() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(defaultCartItems);

  const handleAddToCart = (id: number) => {
    const item = menuItems.find((m) => m.id === id);
    if (!item) return;

    const existingItem = cartItems.find((c) => c.id === id);
    if (existingItem) {
      setCartItems(
        cartItems.map((c) =>
          c.id === id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image,
        },
      ]);
    }
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setCartItems(
      cartItems
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCheckout = () => {
    // Reset giỏ hàng sau khi thanh toán thành công
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6">
      <div className="flex gap-6 max-w-[1800px] mx-auto">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-3xl p-8 mb-8 relative overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.18)] ring-1 ring-black/5">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-20"></div>

            <div className="relative z-10 max-w-xl">
              <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                Món ngon khiến
                <br />
                bạn hạnh phúc
              </h1>
              <p className="text-white/90 text-lg mb-6">
                Hãy nâng tầm niềm vui của bạn
                <br />
                với một bữa ăn thật ngon
              </p>
              <button
                onClick={() => navigate("/menu")}
                className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                Khám phá
              </button>
            </div>

            <div className="absolute -right-12 -top-12 w-96 h-96 opacity-20">
              <div className="w-full h-full rounded-full bg-white blur-3xl"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {menuItems.map((item) => (
              <FoodCard key={item.id} {...item} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>

        <CartSummary
          user={{
            name: "Rachel foster",
            location: "Fluttertop",
            avatar:
              "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
          }}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}
