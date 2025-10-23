# 🔄 Migration sang Mock API - Hướng Dẫn Hoàn Tất

## ✅ **Đã Hoàn Thành**

### 1. **Mock API Service** (`src/services/mockApi.ts`)

- ✅ Auth API: login, register, logout, getCurrentUser
- ✅ Menu API: getAll, getByCategory, search
- ✅ Cart API: getCart, addItem, updateQuantity, clearCart
- ✅ Order API: create, getUserOrders
- ✅ Table API: getAll, updateTable, reserve
- ✅ Simulate network delay (500ms)
- ✅ Response wrapper với success/error

### 2. **Context Architecture**

- ✅ AuthContext (`src/contexts/AuthContext.tsx`)
  - User state management
  - login, logout, register methods
  - isAuthenticated, isLoading states
- ✅ CartContext (`src/contexts/CartContext.tsx`)
  - Cart items management
  - addToCart, updateQuantity, clearCart
  - Sync với user ID
  - Auto load cart khi login

### 3. **Custom Hooks** (`src/hooks/useContexts.ts`)

- ✅ useAuth() - Access authentication
- ✅ useCart() - Access cart state

### 4. **App Integration**

- ✅ Wrap App với AuthProvider
- ✅ Wrap App với CartProvider
- ✅ Login.tsx sử dụng AuthContext
- ✅ Register.tsx sử dụng AuthContext

---

## 🔧 **Cần Hoàn Thành**

### **Sửa TypeScript Errors trong mockApi.ts:**

```typescript
// Thay thế `any` bằng proper types
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

// Thay require() bằng import ở đầu file:
import { initDefaultUsers } from "./userData";
import { menuItems } from "../data/menuData";
import { tablesData } from "../data/tableData";
```

### **Cập Nhật Home.tsx:**

```typescript
import { useCart } from "../hooks/useContexts";
import { useAuth } from "../hooks/useContexts";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { cartItems, addToCart, updateQuantity } = useCart();

  const handleAddToCart = async (id: number) => {
    const item = menuItems.find((m) => m.id === id);
    if (!item) return;

    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm món vào giỏ hàng");
      return;
    }

    await addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
  };

  const handleUpdateQuantity = async (id: number, delta: number) => {
    await updateQuantity(id, delta);
  };

  // Không cần useState cho cartItems nữa
  // Lấy trực tiếp từ useCart()
}
```

### **Cập Nhật Menu.tsx:**

```typescript
import { useCart } from "../hooks/useContexts";
import { useAuth } from "../hooks/useContexts";
import { menuAPI } from "../services/mockApi";

export default function Menu() {
  const { isAuthenticated } = useAuth();
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMenu();
  }, [category]);

  const loadMenu = async () => {
    setIsLoading(true);
    const response = category
      ? await menuAPI.getByCategory(category)
      : await menuAPI.getAll();

    if (response.success) {
      setItems(response.data);
    }
    setIsLoading(false);
  };

  const handleAddToCart = async (id: number) => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm món");
      return;
    }

    const item = items.find((m) => m.id === id);
    if (item) {
      await addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      });
    }
  };
}
```

### **Cập Nhật CartSummary.tsx:**

```typescript
import { useCart } from "../hooks/useContexts";
import { useAuth } from "../hooks/useContexts";

interface CartSummaryProps {
  tableNumber?: string;
}

export default function CartSummary({ tableNumber }: CartSummaryProps) {
  const { cartItems, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleUpdateQuantity = async (id: number, delta: number) => {
    await updateQuantity(id, delta);
  };

  const handlePaymentSuccess = async () => {
    await clearCart();
    alert("Thanh toán thành công!");
  };

  // Không cần truyền props items, onUpdateQuantity, onCheckout nữa
  // Lấy trực tiếp từ useCart()
}
```

### **Cập Nhật Navbar.tsx:**

```typescript
import { useAuth } from "../hooks/useContexts";
import { useCart } from "../hooks/useContexts";

export default function Navbar({ onSearch }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { setUser: setCartUser } = useCart();

  const handleLogout = async () => {
    await logout();
    setCartUser(null);
    setIsDropdownOpen(false);
    navigate("/login");
  };

  // Không cần getCurrentUser từ localStorage nữa
  // Dùng user từ useAuth()
}
```

### **Cập Nhật Profile.tsx:**

```typescript
import { useAuth } from "../hooks/useContexts";

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Dùng user từ useAuth thay vì getCurrentUser
}
```

---

## 🔐 **Authentication Guard**

### **Tạo PrivateRoute Component:**

```typescript
// src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useContexts";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

### **Sử dụng trong App.tsx:**

```typescript
import PrivateRoute from "./components/PrivateRoute";

<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Protected routes */}
  <Route
    path="/"
    element={
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    }
  />
  <Route
    path="/menu"
    element={
      <PrivateRoute>
        <Menu />
      </PrivateRoute>
    }
  />
  <Route
    path="/table"
    element={
      <PrivateRoute>
        <Table />
      </PrivateRoute>
    }
  />
  <Route
    path="/profile"
    element={
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    }
  />
</Routes>;
```

---

## 📝 **Luồng Hoạt Động Mới**

### **1. Đăng Nhập:**

```
User nhập email/password
  → authLogin() được gọi
  → mockAPI.login() validate
  → Lưu token + user vào localStorage
  → Set user state trong AuthContext
  → Set user trong CartContext (sync)
  → Load cart từ API
  → Navigate về "/"
```

### **2. Thêm Món:**

```
User click "Thêm vào giỏ"
  → Check isAuthenticated
  → Nếu chưa login: Alert "Vui lòng đăng nhập"
  → Nếu đã login: addToCart(item)
  → cartAPI.addItem(userId, item)
  → Update localStorage
  → Update cartItems state
  → UI tự động update
```

### **3. Thanh Toán:**

```
User click "Thanh toán ngay"
  → PaymentModal hiển thị
  → User xác nhận thanh toán
  → orderAPI.create(userId, orderData)
  → cartAPI.clearCart(userId)
  → Clear cartItems state
  → Success message
```

### **4. Đăng Xuất:**

```
User click "Đăng xuất"
  → authAPI.logout()
  → Remove token + currentUser
  → Clear user state (AuthContext)
  → Clear cartItems + user (CartContext)
  → Navigate to "/login"
```

---

## 🎯 **Checklist Hoàn Thành**

- [ ] Fix TypeScript errors trong mockApi.ts
- [ ] Convert Home.tsx sang useCart()
- [ ] Convert Menu.tsx sang useCart() + menuAPI
- [ ] Convert CartSummary props-less
- [ ] Update Navbar với useAuth()
- [ ] Update Profile với useAuth()
- [ ] Tạo PrivateRoute component
- [ ] Apply PrivateRoute cho protected routes
- [ ] Test đăng nhập → thêm món → thanh toán → đăng xuất
- [ ] Test refresh page (persist auth)

---

## 🚀 **Benefits**

✅ **Centralized State**: Tất cả cart state ở một nơi
✅ **Auto Sync**: Cart tự động sync với user ID
✅ **Auth Guard**: Bắt buộc login để thao tác
✅ **API Ready**: Dễ dàng thay mock API → real API
✅ **Type Safety**: TypeScript cho tất cả APIs
✅ **Scalable**: Dễ thêm features mới

---

**Next Steps**: Follow checklist để hoàn thành migration! 🎉
