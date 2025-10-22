# 🍽️ UniLife - Hệ thống Đặt Món & Đặt Bàn

## 📋 Luồng Hành Động Demo Hoàn Chỉnh

### 1️⃣ **ĐĂNG NHẬP**

- Truy cập: `http://localhost:5173/login`
- Tài khoản demo:
  - **User thường**: `user@unilife.com` / `123456`
  - **Admin**: `admin@unilife.com` / `admin123`
- Hoặc tạo tài khoản mới tại `/register`

---

### 2️⃣ **CHỌN MÓN ĂN**

- Click logo hoặc icon "Trang chủ" trên Sidebar
- Hoặc chọn danh mục từ Sidebar:
  - ☕ **Đồ uống** - 6 món (35.000đ - 50.000đ)
  - 🍴 **Món ăn** - 8 món (95.000đ - 185.000đ)
  - 🍕 **Pizza** - 5 món (125.000đ - 165.000đ)
  - 🥣 **Súp** - 4 món (65.000đ - 95.000đ)

**Hành động:**

- Click nút "Thêm vào giỏ" trên món ăn
- Giỏ hàng bên phải sẽ cập nhật real-time
- Điều chỉnh số lượng bằng nút +/-

---

### 3️⃣ **ĐẶT BÀN & CHỌN GHẾ**

- Click icon "Đặt bàn" trên Sidebar
- Xem danh sách bàn với trạng thái:
  - 🟣 **Trống** - Bàn available
  - 🟠 **Đã đặt** - Đã có người đặt
  - 🟢 **Đã tính tiền** - Hoàn tất

**Hành động:**

- Click vào bàn trống (ví dụ: T-01)
- Modal hiện lên với sơ đồ bàn
- Click vào ghế màu tím (trống) để chọn
- Ghế sẽ chuyển sang màu xanh indigo (đã chọn)
- Có thể chọn nhiều ghế cùng lúc
- Click "Đặt X ghế" để tiếp tục

---

### 4️⃣ **THANH TOÁN - HIỆN BILL**

**Từ Trang Chủ/Menu (thanh toán món ăn):**

- Click "Thanh toán ngay" trong giỏ hàng
- Modal thanh toán hiện lên với:
  - ✅ Chi tiết đơn hàng
  - ✅ Tạm tính
  - ✅ Thuế 10%
  - ✅ **Tổng cộng**

**Từ Đặt Bàn (thanh toán ghế):**

- Sau khi chọn ghế → click "Đặt X ghế"
- Modal thanh toán hiện bill:
  - Tên bàn: T-01
  - Danh sách ghế: Seat 1, Seat 2...
  - Giá mỗi ghế: 50.000đ
  - Tổng cộng

---

### 5️⃣ **QUÉT MÃ QR THANH TOÁN**

Trong modal thanh toán:

**Hiển thị:**

- 📱 **Mã QR Code** để quét
- 💳 Các phương thức: VietQR, MoMo, ZaloPay
- ⏱️ Trạng thái "Đang chờ thanh toán..."

**Demo thanh toán:**

- Click nút **"Xác nhận đã thanh toán (Demo)"**
- Hiển thị thông báo thành công ✅
- Icon check màu xanh
- Đếm ngược 3 giây
- Tự động đóng và reset giỏ hàng

---

## 🎯 **Luồng Demo Hoàn Chỉnh**

```
📱 ĐĂNG NHẬP (user@unilife.com / 123456)
    ↓
🏠 TRANG CHỦ
    ↓
🍕 CHỌN "Pizza Cay Đặc Biệt" → Thêm vào giỏ (150.000đ)
    ↓
🥤 CHỌN "Trà Sữa Trân Châu" → Thêm vào giỏ (45.000đ)
    ↓
🪑 CHUYỂN SANG ĐẶT BÀN
    ↓
📍 CHỌN BÀN T-01
    ↓
💺 CHỌN 2 GHẾ (Seat 1, Seat 2)
    ↓
💰 THANH TOÁN (Tổng: 100.000đ)
    ↓
📱 QUÉT MÃ QR HIỂN THỊ
    ↓
✅ XÁC NHẬN THANH TOÁN
    ↓
🎉 THÀNH CÔNG - HOÀN TẤT
```

---

## 💡 **Tính Năng Bổ Sung**

### **Navbar - Dropdown Avatar**

- Click vào avatar ở góc phải navbar
- Dropdown hiện:
  - 👤 **Hồ sơ của tôi** → Xem/chỉnh sửa profile
  - ⚙️ **Cài đặt** (đang phát triển)
  - 🚪 **Đăng xuất**

### **Trang Profile**

- Xem thông tin: Tên, Email, SĐT, Địa chỉ
- Chỉnh sửa thông tin cá nhân
- Xem thống kê: Đơn hàng, Món yêu thích
- Tabs: Thông tin / Đơn hàng / Yêu thích

### **Tìm Kiếm**

- Ô tìm kiếm ở Navbar
- Tìm theo tên món hoặc mô tả
- Kết quả real-time

---

## 🎨 **Thiết Kế UI/UX**

- ✨ Gradient màu cam chủ đạo
- 🎯 Shadow đẹp mắt (0_14px_50px)
- 🔄 Hover effects mượt mà
- 📱 Responsive design
- 🎭 Modal với backdrop blur
- ⚡ Animations mượt mà

---

## 📊 **Dữ Liệu Demo**

### **Menu Items**: 23 món

- Món ăn: 8 món
- Pizza: 5 món
- Súp: 4 món
- Đồ uống: 6 món

### **Bàn**: 12 bàn (T-01 đến T-12)

- Bàn tròn: 6 ghế
- Bàn vuông: 4 ghế
- Trạng thái đa dạng

### **Users**: 2 tài khoản

- User + Admin
- Avatar, phone, address đầy đủ

---

## 🚀 **Chạy Ứng Dụng**

```bash
npm install
npm run dev
```

Truy cập: `http://localhost:5173`

---

## ✅ **Checklist Demo**

- [x] Đăng nhập thành công
- [x] Thêm món vào giỏ
- [x] Điều chỉnh số lượng
- [x] Chọn bàn và ghế
- [x] Hiển thị bill chi tiết
- [x] Quét mã QR
- [x] Thanh toán thành công
- [x] Xem profile
- [x] Đăng xuất

---

**🎉 UniLife - Trải nghiệm đặt món & đặt bàn hoàn hảo!**
