// Quản lý dữ liệu người dùng trong localStorage

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface LoginUser {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

// Khởi tạo dữ liệu người dùng mặc định
export const initDefaultUsers = () => {
  const users = getUsers();
  if (users.length === 0) {
    const defaultUsers: User[] = [
      {
        id: "1",
        fullName: "Người dùng Demo",
        email: "user@unilife.com",
        password: "123456",
        avatar:
          "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100",
        phone: "0123456789",
        address: "Hà Nội, Việt Nam",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        fullName: "Admin UniLife",
        email: "admin@unilife.com",
        password: "admin123",
        avatar:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100",
        phone: "0987654321",
        address: "TP.HCM, Việt Nam",
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem("users", JSON.stringify(defaultUsers));
  }
};

// Lấy tất cả người dùng
export const getUsers = (): User[] => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

// Lấy người dùng theo email
export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find((u) => u.email === email);
};

// Đăng nhập
export const login = (email: string, password: string): LoginUser | null => {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    const loginUser: LoginUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    };
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(loginUser));
    return loginUser;
  }
  return null;
};

// Đăng ký người dùng mới
export const register = (
  fullName: string,
  email: string,
  password: string
): { success: boolean; message: string } => {
  const users = getUsers();

  // Kiểm tra email đã tồn tại
  if (users.some((u) => u.email === email)) {
    return { success: false, message: "Email đã được đăng ký" };
  }

  const newUser: User = {
    id: Date.now().toString(),
    fullName,
    email,
    password,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName
    )}&background=F59E0B&color=fff&size=100`,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  return { success: true, message: "Đăng ký thành công!" };
};

// Lấy thông tin người dùng hiện tại
export const getCurrentUser = (): LoginUser | null => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const currentUser = localStorage.getItem("currentUser");

  if (isLoggedIn === "true" && currentUser) {
    return JSON.parse(currentUser);
  }
  return null;
};

// Đăng xuất
export const logout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
};

// Kiểm tra trạng thái đăng nhập
export const isAuthenticated = (): boolean => {
  return localStorage.getItem("isLoggedIn") === "true";
};

// Cập nhật thông tin người dùng
export const updateUserProfile = (
  email: string,
  updates: Partial<User>
): { success: boolean; message: string } => {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.email === email);

  if (userIndex === -1) {
    return { success: false, message: "Không tìm thấy người dùng" };
  }

  users[userIndex] = { ...users[userIndex], ...updates };
  localStorage.setItem("users", JSON.stringify(users));

  // Cập nhật currentUser nếu đang đăng nhập
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.email === email) {
    const updatedLoginUser: LoginUser = {
      id: users[userIndex].id,
      fullName: users[userIndex].fullName,
      email: users[userIndex].email,
      avatar: users[userIndex].avatar,
    };
    localStorage.setItem("currentUser", JSON.stringify(updatedLoginUser));
  }

  return { success: true, message: "Cập nhật thành công!" };
};
