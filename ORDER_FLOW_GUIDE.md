# Hướng Dẫn Luồng Đặt Hàng Mới

## Tổng Quan Thay Đổi

### Luồng Cũ

```
Chọn món → Thêm vào giỏ hàng → Chọn bàn → Chọn ghế → Thanh toán
```

### Luồng Mới

```
Chọn món → Thêm vào giỏ hàng → Thanh toán ngay → Nhận QR Code Bill → Lưu lịch sử
```

---

## Các Thay Đổi Chính

### 1. CartSummary Component

**File:** `src/components/CartSummary.tsx`

**Thay đổi:**

- Nút "Thanh toán ngay" giờ mở PaymentModal trực tiếp
- Không còn chuyển sang trang Table để chọn ghế
- Sau thanh toán thành công: xóa giỏ hàng và hiển thị thông báo

**Code chính:**

```tsx
const handleCheckout = () => {
  if (cartItems.length === 0) {
    toast.warning("Giỏ hàng trống!");
    return;
  }
  setShowPaymentModal(true); // Mở modal thanh toán trực tiếp
};

const handlePaymentSuccess = () => {
  clearCart(); // Xóa giỏ hàng
  toast.success("Đặt hàng thành công! Vui lòng kiểm tra lịch sử đơn hàng.");
  setShowPaymentModal(false);
};
```

---

### 2. PaymentModal Component

**File:** `src/components/PaymentModal.tsx`

**Thay đổi:**

- Sau thanh toán thành công, tạo đơn hàng với QR code bill
- Hiển thị QR code để người dùng đưa cho nhân viên nhận món
- Lưu đơn hàng vào localStorage
- Tăng thời gian đếm ngược từ 3s lên 10s

**Dữ liệu Order:**

```tsx
interface Order {
  id: string; // "ORD-1234567890"
  orderNumber: string; // "#0123"
  items: OrderItem[]; // Danh sách món
  subtotal: number; // Tạm tính
  tax: number; // Thuế 10%
  total: number; // Tổng cộng
  status: "confirmed"; // Trạng thái
  createdAt: string; // Thời gian tạo
  qrCode: string; // URL QR code
  userName: string; // Tên người dùng
  userEmail: string; // Email người dùng
}
```

**QR Code Bill:**

- Format: `unilife://order/{orderId}`
- Size: 300x300px
- Dùng để nhân viên quét và xác nhận đơn hàng

---

### 3. OrderHistory Page (Mới)

**File:** `src/pages/OrderHistory.tsx`

**Tính năng:**

- Hiển thị tất cả đơn hàng của người dùng
- Lọc theo trạng thái: Tất cả, Đã xác nhận, Đang chuẩn bị, Hoàn thành
- Xem chi tiết đơn hàng
- Hiển thị QR code bill để nhận món

**Trạng thái đơn hàng:**

- 🟡 `pending`: Chờ xử lý
- 🔵 `confirmed`: Đã xác nhận
- 🟠 `preparing`: Đang chuẩn bị
- 🟣 `ready`: Sẵn sàng nhận
- 🟢 `completed`: Hoàn thành
- 🔴 `cancelled`: Đã hủy

**Navigation:**

- Route: `/orders`
- Icon: Package (trong Sidebar)
- Hiển thị ở cả Desktop và Mobile bottom navigation

---

### 4. Order Storage Utility

**File:** `src/utils/orderStorage.ts`

**Chức năng:**

```tsx
orderStorage.getOrders(userEmail)        // Lấy tất cả orders của user
orderStorage.saveOrder(order)            // Lưu order mới
orderStorage.getOrderById(id, email)     // Lấy order theo ID
orderStorage.updateOrderStatus(...)      // Cập nhật trạng thái
orderStorage.clearOrders()               // Xóa tất cả (testing)
```

**Storage:**

- Lưu trong `localStorage` với key: `unilife_orders`
- Format: Array của Order objects
- Tự động lọc theo email người dùng

---

### 5. Sidebar Navigation

**File:** `src/components/Sidebar.tsx`

**Thêm menu mới:**

```tsx
{
  icon: Package,
  path: "/orders",
  label: "Đơn hàng",
  category: ""
}
```

Hiển thị giữa "Đặt bàn" và "Ví"

---

## Hướng Dẫn Sử Dụng

### Đặt Hàng

1. **Chọn món ăn** từ trang Home hoặc Menu
2. Click **"Thêm vào giỏ"** để thêm món
3. Kiểm tra giỏ hàng ở sidebar phải (desktop) hoặc nút floating (mobile)
4. Click **"Thanh toán ngay"**
5. Quét QR code để thanh toán (hoặc click "Xác nhận đã thanh toán" để demo)
6. Nhận **QR code bill** để đưa cho nhân viên
7. Đơn hàng tự động lưu vào lịch sử

### Xem Lịch Sử

1. Click icon **Package** (Đơn hàng) trong Sidebar
2. Xem danh sách tất cả đơn hàng
3. Lọc theo trạng thái nếu cần
4. Click vào đơn hàng để xem chi tiết
5. Hiển thị lại QR code bill để nhận món

---

## Lợi Ích Của Luồng Mới

### ✅ Đơn Giản Hơn

- Không cần chọn bàn/ghế
- Thanh toán ngay sau khi chọn món
- Quy trình nhanh gọn hơn

### ✅ Linh Hoạt Hơn

- Phù hợp với mô hình "Order & Pick Up"
- Người dùng tự do chọn chỗ ngồi sau khi nhận món
- Giảm thời gian chờ đợi

### ✅ Quản Lý Tốt Hơn

- Lưu trữ lịch sử đơn hàng
- QR code bill để xác minh
- Dễ dàng tra cứu lại

---

## Demo Flow

### 1. Trang Home

- Banner với món ăn đặc trưng
- Grid hiển thị món popular
- Cart summary ở sidebar

### 2. Chọn Món & Thanh Toán

- Thêm món vào giỏ
- Click "Thanh toán ngay"
- Quét QR thanh toán
- Xác nhận

### 3. Nhận Bill

- Màn hình success với QR code bill
- Chi tiết đơn hàng
- Tự động lưu vào lịch sử

### 4. Lịch Sử Đơn Hàng

- Danh sách đơn hàng
- Lọc theo trạng thái
- Xem lại QR code bill

---

## Technical Notes

### LocalStorage Structure

```json
{
  "unilife_orders": [
    {
      "id": "ORD-1732531234567",
      "orderNumber": "#0123",
      "items": [...],
      "subtotal": 100000,
      "tax": 10000,
      "total": 110000,
      "status": "confirmed",
      "createdAt": "2025-11-25T10:30:00.000Z",
      "qrCode": "https://api.qrserver.com/...",
      "userName": "Nguyen Van A",
      "userEmail": "user@example.com"
    }
  ]
}
```

### QR Code Format

- **Thanh toán**: `unilife://pay?amount={total}&table=N/A`
- **Bill**: `unilife://order/{orderId}`

### Countdown Timer

- Pending → Success: 10 giây
- Tự động đóng modal sau countdown
- Có thể đóng sớm bằng nút "Đóng"

---

## Testing Checklist

- [ ] Thêm món vào giỏ hàng
- [ ] Click "Thanh toán ngay" mở modal
- [ ] Click "Xác nhận đã thanh toán (Demo)"
- [ ] Hiển thị QR code bill
- [ ] Hiển thị chi tiết đơn hàng
- [ ] Tự động xóa giỏ hàng
- [ ] Lưu vào localStorage
- [ ] Mở trang /orders
- [ ] Xem danh sách đơn hàng
- [ ] Lọc theo trạng thái
- [ ] Click xem chi tiết
- [ ] Hiển thị lại QR code bill
- [ ] Test trên mobile
- [ ] Test trên desktop

---

## Future Enhancements

### Phase 2 (Tương lai)

- [ ] Tích hợp API backend thật
- [ ] Websocket để cập nhật trạng thái real-time
- [ ] Push notification khi món sẵn sàng
- [ ] Đánh giá đơn hàng sau khi hoàn thành
- [ ] Export bill PDF
- [ ] Loyalty points system
- [ ] Reorder từ lịch sử

---

**Ngày cập nhật:** 25/11/2025  
**Version:** 2.0 - Order & Pick Up Flow
