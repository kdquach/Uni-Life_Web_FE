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

        <CartSummary />
      </div>
    </div>
  );
}
