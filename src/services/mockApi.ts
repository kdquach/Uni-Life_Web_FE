// Mock API để simulate API calls
// Trong production, thay đổi baseURL và implement real API calls

import { initDefaultUsers } from "../utils/userData";
import { menuItems } from "../data/menuData";
import { tablesData } from "../data/tableData";

const API_DELAY = 500; // Simulate network delay

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock storage keys
const STORAGE_KEYS = {
  USERS: "api_users",
  MENU_ITEMS: "api_menu_items",
  CART_ITEMS: "api_cart_items",
  ORDERS: "api_orders",
  TABLES: "api_tables",
};

// Types
interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: string;
}

interface Table {
  id: string;
  capacity: number;
  status: string;
  seats: Seat[];
  shape: string;
}

interface Seat {
  id: string;
  label: string;
  status: string;
  userId?: string;
}

// Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ==================== AUTH API ====================

export const authAPI = {
  // Đăng nhập
  login: async (
    email: string,
    password: string
  ): Promise<ApiResponse<{ token: string; user: Omit<User, "password"> }>> => {
    await delay(API_DELAY);

    const users: User[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.USERS) || "[]"
    );
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const token = `token_${Date.now()}_${Math.random().toString(36)}`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pwd, ...userWithoutPassword } = user;

      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));

      return {
        success: true,
        data: { token, user: userWithoutPassword },
        message: "Đăng nhập thành công",
      };
    }

    return {
      success: false,
      error: "Email hoặc mật khẩu không đúng",
    };
  },

  // Đăng ký
  register: async (
    fullName: string,
    email: string,
    password: string
  ): Promise<ApiResponse<User>> => {
    await delay(API_DELAY);

    const users: User[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.USERS) || "[]"
    );

    if (users.some((u) => u.email === email)) {
      return {
        success: false,
        error: "Email đã được đăng ký",
      };
    }

    const newUser = {
      id: `user_${Date.now()}`,
      fullName,
      email,
      password,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        fullName
      )}&background=F59E0B&color=fff&size=100`,
      phone: "",
      address: "",
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    return {
      success: true,
      data: newUser,
      message: "Đăng ký thành công",
    };
  },

  // Đăng xuất
  logout: async (): Promise<ApiResponse<null>> => {
    await delay(300);

    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");

    return {
      success: true,
      message: "Đăng xuất thành công",
    };
  },

  // Lấy user hiện tại
  getCurrentUser: async (): Promise<ApiResponse<Omit<User, "password">>> => {
    await delay(200);

    const token = localStorage.getItem("authToken");
    const currentUser = localStorage.getItem("currentUser");

    if (token && currentUser) {
      return {
        success: true,
        data: JSON.parse(currentUser),
      };
    }

    return {
      success: false,
      error: "Chưa đăng nhập",
    };
  },

  // Kiểm tra authentication
  checkAuth: (): boolean => {
    return !!localStorage.getItem("authToken");
  },
};

// ==================== MENU API ====================

export const menuAPI = {
  // Lấy tất cả món ăn
  getAll: async (): Promise<ApiResponse<MenuItem[]>> => {
    await delay(API_DELAY);

    const items: MenuItem[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.MENU_ITEMS) || "[]"
    );

    return {
      success: true,
      data: items,
    };
  },

  // Lấy món theo category
  getByCategory: async (category: string): Promise<ApiResponse<MenuItem[]>> => {
    await delay(API_DELAY);

    const items: MenuItem[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.MENU_ITEMS) || "[]"
    );
    const filtered = items.filter((item) => item.category === category);

    return {
      success: true,
      data: filtered,
    };
  },

  // Tìm kiếm món
  search: async (query: string): Promise<ApiResponse<MenuItem[]>> => {
    await delay(API_DELAY);

    const items: MenuItem[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.MENU_ITEMS) || "[]"
    );
    const filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );

    return {
      success: true,
      data: filtered,
    };
  },
};

// ==================== CART API ====================

export const cartAPI = {
  // Lấy giỏ hàng của user
  getCart: async (userId: string): Promise<ApiResponse<CartItem[]>> => {
    await delay(API_DELAY);

    const carts: Record<string, CartItem[]> = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CART_ITEMS) || "{}"
    );
    const userCart = carts[userId] || [];

    return {
      success: true,
      data: userCart,
    };
  },

  // Thêm món vào giỏ
  addItem: async (
    userId: string,
    item: Omit<CartItem, "quantity">
  ): Promise<ApiResponse<CartItem[]>> => {
    await delay(API_DELAY);

    const carts: Record<string, CartItem[]> = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CART_ITEMS) || "{}"
    );
    const userCart = carts[userId] || [];

    const existingIndex = userCart.findIndex((i) => i.id === item.id);

    if (existingIndex >= 0) {
      userCart[existingIndex].quantity += 1;
    } else {
      userCart.push({ ...item, quantity: 1 });
    }

    carts[userId] = userCart;
    localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(carts));

    return {
      success: true,
      data: userCart,
      message: "Đã thêm vào giỏ hàng",
    };
  },

  // Cập nhật số lượng
  updateQuantity: async (
    userId: string,
    itemId: number,
    delta: number
  ): Promise<ApiResponse<CartItem[]>> => {
    await delay(API_DELAY);

    const carts: Record<string, CartItem[]> = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CART_ITEMS) || "{}"
    );
    let userCart = carts[userId] || [];

    userCart = userCart
      .map((item) => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);

    carts[userId] = userCart;
    localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(carts));

    return {
      success: true,
      data: userCart,
    };
  },

  // Xóa giỏ hàng
  clearCart: async (userId: string): Promise<ApiResponse<null>> => {
    await delay(API_DELAY);

    const carts: Record<string, CartItem[]> = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CART_ITEMS) || "{}"
    );
    carts[userId] = [];
    localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(carts));

    return {
      success: true,
      message: "Đã xóa giỏ hàng",
    };
  },
};

// ==================== ORDER API ====================

export const orderAPI = {
  // Tạo đơn hàng mới
  create: async (
    userId: string,
    orderData: Omit<Order, "id" | "userId" | "status" | "createdAt">
  ): Promise<ApiResponse<Order>> => {
    await delay(API_DELAY);

    const orders: Order[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]"
    );

    const newOrder: Order = {
      id: `order_${Date.now()}`,
      userId,
      ...orderData,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Clear cart after order
    await cartAPI.clearCart(userId);

    return {
      success: true,
      data: newOrder,
      message: "Đặt hàng thành công",
    };
  },

  // Lấy đơn hàng của user
  getUserOrders: async (userId: string): Promise<ApiResponse<Order[]>> => {
    await delay(API_DELAY);

    const orders: Order[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]"
    );
    const userOrders = orders.filter((o) => o.userId === userId);

    return {
      success: true,
      data: userOrders,
    };
  },
};

// ==================== TABLE API ====================

export const tableAPI = {
  // Lấy tất cả bàn
  getAll: async (): Promise<ApiResponse<Table[]>> => {
    await delay(API_DELAY);

    const tables: Table[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.TABLES) || "[]"
    );

    return {
      success: true,
      data: tables,
    };
  },

  // Cập nhật trạng thái bàn
  updateTable: async (
    tableId: string,
    updates: Partial<Table>
  ): Promise<ApiResponse<Table>> => {
    await delay(API_DELAY);

    const tables: Table[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.TABLES) || "[]"
    );
    const index = tables.findIndex((t) => t.id === tableId);

    if (index >= 0) {
      tables[index] = { ...tables[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));

      return {
        success: true,
        data: tables[index],
        message: "Cập nhật bàn thành công",
      };
    }

    return {
      success: false,
      error: "Không tìm thấy bàn",
    };
  },

  // Đặt bàn
  reserve: async (
    userId: string,
    tableId: string,
    seatIds: string[]
  ): Promise<ApiResponse<Table>> => {
    await delay(API_DELAY);

    const tables: Table[] = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.TABLES) || "[]"
    );
    const table = tables.find((t) => t.id === tableId);

    if (table) {
      const updatedSeats = table.seats.map((seat) => {
        if (seatIds.includes(seat.id)) {
          return { ...seat, status: "reserved" as const, userId };
        }
        return seat;
      });

      const updatedTable = { ...table, seats: updatedSeats };
      const index = tables.findIndex((t) => t.id === tableId);
      tables[index] = updatedTable;

      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));

      return {
        success: true,
        data: updatedTable,
        message: "Đặt bàn thành công",
      };
    }

    return {
      success: false,
      error: "Không tìm thấy bàn",
    };
  },
};

// ==================== INIT DATA ====================

export const initMockData = () => {
  // Chỉ init nếu chưa có data
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    // Import từ userData.ts
    initDefaultUsers();

    // Copy users sang API storage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  if (!localStorage.getItem(STORAGE_KEYS.MENU_ITEMS)) {
    // Import từ menuData.ts
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(menuItems));
  }

  if (!localStorage.getItem(STORAGE_KEYS.TABLES)) {
    // Import từ tableData.ts
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tablesData));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CART_ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify({}));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }
};
