import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { cartAPI } from "../services/mockApi";

interface User {
  id: string;
  fullName: string;
  email: string;
}

interface SeatInfo {
  tableId: string;
  seatId: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  seatInfo?: SeatInfo; // Thông tin ghế cho món ăn này
}

export interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, "quantity">) => Promise<void>;
  updateQuantity: (itemId: number, delta: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  user: User | null;
  setUser: (user: User | null) => void;
  updateSeatInfo: (itemId: number, seatInfo: SeatInfo) => void;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCart = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await cartAPI.getCart(user.id);
      if (response.success && response.data) {
        setCartItems(response.data);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [user, loadCart]);

  const addToCart = async (item: Omit<CartItem, "quantity">) => {
    if (!user) {
      alert("Vui lòng đăng nhập để thêm món vào giỏ hàng");
      return;
    }

    try {
      const response = await cartAPI.addItem(user.id, item);
      if (response.success && response.data) {
        setCartItems(response.data);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Không thể thêm món vào giỏ hàng");
    }
  };

  const updateQuantity = async (itemId: number, delta: number) => {
    if (!user) return;

    try {
      const response = await cartAPI.updateQuantity(user.id, itemId, delta);
      if (response.success && response.data) {
        setCartItems(response.data);
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const response = await cartAPI.clearCart(user.id);
      if (response.success) {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  const updateSeatInfo = (itemId: number, seatInfo: SeatInfo) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, seatInfo } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading,
        addToCart,
        updateQuantity,
        clearCart,
        refreshCart,
        user,
        setUser,
        updateSeatInfo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
