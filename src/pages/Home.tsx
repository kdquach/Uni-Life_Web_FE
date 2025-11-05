import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import FoodCard from "../components/FoodCard";
import CartSummary from "../components/CartSummary";
import { menuItems } from "../data/menuData";
import { useCart } from "../hooks/useContexts";
import { useToast } from "../hooks/useToast";

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const toast = useToast();

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
      toast.success(`Đã thêm "${item.name}" vào giỏ hàng!`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      if (error instanceof Error && error.message === "NOT_LOGGED_IN") {
        toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      } else {
        toast.error("Không thể thêm món vào giỏ hàng");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6">
      <div className="flex gap-6 max-w-[1800px] mx-auto">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-3xl p-12 mb-8 relative overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.18)] ring-1 ring-black/5 min-h-[400px]">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-20"></div>

            <div className="relative z-10 flex items-center justify-between">
              {/* Left Content */}
              <div className="max-w-lg">
                <h1 className="text-6xl font-bold text-white mb-4 leading-tight">
                  UniLife
                  <br />
                  Smart Ecosystem
                </h1>
                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                  Lets Take your happiness to the next
                  <br />
                  level with a great tasty meal
                </p>
                <button
                  onClick={() => navigate("/menu")}
                  className="bg-white text-orange-600 px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
                >
                  Khám phá
                </button>
              </div>

              {/* Right - Food Images */}
              <div className="relative w-[600px] h-[400px]">
                {/* Center Large Image - Steak */}
                <div className="absolute top-0 right-16 w-80 h-80 rounded-full bg-white shadow-2xl overflow-hidden transform hover:scale-105 transition-transform z-30">
                  <img
                    src="https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&h=500&fit=crop"
                    alt="Steak"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Bottom Right - Pizza */}
                <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-white shadow-2xl overflow-hidden transform hover:scale-105 transition-transform z-20">
                  <img
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop"
                    alt="Pizza"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Top Left - Roasted Chicken */}
                <div className="absolute top-4 left-0 w-60 h-60 rounded-full bg-white shadow-2xl overflow-hidden transform hover:scale-105 transition-transform z-20">
                  <img
                    src="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&h=500&fit=crop"
                    alt="Roasted Chicken"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Bottom Left - Noodles */}
                <div className="absolute bottom-4 left-8 w-52 h-52 rounded-full bg-white shadow-2xl overflow-hidden transform hover:scale-105 transition-transform z-10">
                  <img
                    src="https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500&h=500&fit=crop"
                    alt="Noodles"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Decorative blur circles */}
            <div className="absolute -right-12 -top-12 w-96 h-96 opacity-20">
              <div className="w-full h-full rounded-full bg-white blur-3xl"></div>
            </div>
            <div className="absolute -left-12 -bottom-12 w-64 h-64 opacity-10">
              <div className="w-full h-full rounded-full bg-white blur-3xl"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {menuItems.map((item) => (
              <FoodCard key={item.id} {...item} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </div>

        <CartSummary />
      </div>
    </div>
  );
}
