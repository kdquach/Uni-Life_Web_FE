import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, initDefaultUsers } from "../utils/userData";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Khởi tạo dữ liệu người dùng mặc định
    initDefaultUsers();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = login(email, password);

    if (user) {
      navigate("/");
    } else {
      setError("Email hoặc mật khẩu không đúng");
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
            Đăng nhập vào UniLife
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 transition-all text-gray-700"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 transition-all text-gray-700"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all"
          >
            Đăng nhập
          </button>
        </form>

        <div className="text-center mt-4">
          <button className="text-gray-400 hover:text-orange-500 transition-colors text-sm">
            Quên mật khẩu?
          </button>
        </div>

        <div className="text-center mt-6">
          <span className="text-gray-600 text-sm">Chưa có tài khoản? </span>
          <button
            onClick={() => navigate("/register")}
            className="text-orange-500 font-semibold hover:text-orange-600 transition-colors text-sm"
          >
            Đăng ký ngay
          </button>
        </div>

        {/* Helper text */}
        <div className="mt-6 p-4 bg-orange-50 rounded-xl">
          <p className="text-xs text-gray-600 text-center">
            <strong>Demo:</strong> user@unilife.com / 123456
          </p>
        </div>
      </div>
    </div>
  );
}
