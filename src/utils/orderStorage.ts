import { Order } from "../types/order";

const ORDER_STORAGE_KEY = "unilife_orders";

export const orderStorage = {
  // Lấy tất cả orders
  getOrders: (userEmail: string): Order[] => {
    try {
      const stored = localStorage.getItem(ORDER_STORAGE_KEY);
      if (!stored) return [];

      const allOrders: Order[] = JSON.parse(stored);
      // Lọc orders của user hiện tại
      return allOrders.filter((order) => order.userEmail === userEmail);
    } catch (error) {
      console.error("Error loading orders:", error);
      return [];
    }
  },

  // Lưu order mới
  saveOrder: (order: Order): void => {
    try {
      const stored = localStorage.getItem(ORDER_STORAGE_KEY);
      const allOrders: Order[] = stored ? JSON.parse(stored) : [];

      allOrders.push(order);
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(allOrders));
    } catch (error) {
      console.error("Error saving order:", error);
    }
  },

  // Lấy order theo ID
  getOrderById: (orderId: string, userEmail: string): Order | null => {
    const orders = orderStorage.getOrders(userEmail);
    return orders.find((order) => order.id === orderId) || null;
  },

  // Cập nhật trạng thái order
  updateOrderStatus: (
    orderId: string,
    status: Order["status"],
    userEmail: string
  ): void => {
    try {
      const stored = localStorage.getItem(ORDER_STORAGE_KEY);
      if (!stored) return;

      const allOrders: Order[] = JSON.parse(stored);
      const orderIndex = allOrders.findIndex(
        (order) => order.id === orderId && order.userEmail === userEmail
      );

      if (orderIndex !== -1) {
        allOrders[orderIndex].status = status;
        localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(allOrders));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  },

  // Xóa tất cả orders (dùng cho testing)
  clearOrders: (): void => {
    localStorage.removeItem(ORDER_STORAGE_KEY);
  },
};
