import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../utils/userData";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    // Đăng ký người dùng
    const result = register(
      formData.fullName,
      formData.email,
      formData.password
    );

    if (result.success) {
      setSuccess(result.message + " Chuyển đến trang đăng nhập...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo và Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <img src="/Logo.png" alt="UniLife Logo" className="w-24 h-24" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Đăng ký UniLife
          </h1>
          <p className="text-gray-500 text-sm">
            Tạo tài khoản để bắt đầu đặt món
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Họ và tên"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 transition-all text-gray-700"
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 transition-all text-gray-700"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 transition-all text-gray-700"
              required
            />
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 transition-all text-gray-700"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {success && (
            <p className="text-green-500 text-sm text-center">{success}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all"
          >
            Đăng ký
          </button>
        </form>

        <div className="text-center mt-6">
          <span className="text-gray-600 text-sm">Đã có tài khoản? </span>
          <button
            onClick={() => navigate("/login")}
            className="text-orange-500 font-semibold hover:text-orange-600 transition-colors text-sm"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </div>
  );
}
