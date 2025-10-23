interface FoodCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  onAddToCart: (id: number) => void;
}

export default function FoodCard({
  id,
  name,
  description,
  price,
  image,
  onAddToCart,
}: FoodCardProps) {
  // Định dạng tiền Việt Nam Đồng
  const formattedPrice = price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return (
    <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-[0_24px_60px_rgba(0,0,0,0.16)] transition-all duration-300 transform hover:-translate-y-1">
      <div className="w-full h-48 bg-gray-100 rounded-t-2xl overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-heading text-gray-800 mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2 min-h-[40px]">
          {description}
        </p>

        <div className="mb-4 text-orange-600 font-bold text-lg">
          {formattedPrice}
        </div>

        <button
          onClick={() => onAddToCart(id)}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
