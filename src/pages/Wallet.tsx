import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  CreditCard,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/useContexts";
import { useToast } from "../hooks/useToast";

interface Transaction {
  id: string;
  type: "deposit" | "withdraw" | "payment";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

export default function Wallet() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const [balance] = useState(500000); // Mock balance
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState("");

  // Mock transaction history
  const [transactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "deposit",
      amount: 500000,
      description: "Nạp tiền vào ví",
      date: "2024-10-23T10:30:00",
      status: "completed",
    },
    {
      id: "2",
      type: "payment",
      amount: -150000,
      description: "Thanh toán đơn hàng #ORD001",
      date: "2024-10-22T14:20:00",
      status: "completed",
    },
    {
      id: "3",
      type: "payment",
      amount: -85000,
      description: "Thanh toán đơn hàng #ORD002",
      date: "2024-10-21T11:15:00",
      status: "completed",
    },
  ]);

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const formatCurrency = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.warning("Vui lòng nhập số tiền hợp lệ");
      return;
    }
    // TODO: Implement deposit API
    toast.success(`Nạp ${formatCurrency(parseFloat(amount))} thành công!`);
    setShowDepositModal(false);
    setAmount("");
  };

  const handleWithdraw = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.warning("Vui lòng nhập số tiền hợp lệ");
      return;
    }
    if (parseFloat(amount) > balance) {
      toast.error("Số dư không đủ!");
      return;
    }
    // TODO: Implement withdraw API
    toast.success(`Rút ${formatCurrency(parseFloat(amount))} thành công!`);
    setShowWithdrawModal(false);
    setAmount("");
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      case "withdraw":
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case "payment":
        return <CreditCard className="w-5 h-5 text-orange-500" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-green-600";
      case "withdraw":
      case "payment":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6">
      <div className="flex gap-6 max-w-[1800px] mx-auto">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Ví của tôi
            </h1>
            <p className="text-gray-600">Quản lý số dư và giao dịch của bạn</p>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <WalletIcon className="w-8 h-8" />
                <span className="text-white/80 text-lg">Số dư khả dụng</span>
              </div>
              <h2 className="text-5xl font-bold mb-8">
                {formatCurrency(balance)}
              </h2>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="flex-1 bg-white text-orange-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-xl transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Nạp tiền
                </button>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex-1 bg-white/20 backdrop-blur-sm text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/30 transition-all"
                >
                  <Minus className="w-5 h-5" />
                  Rút tiền
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600">Tổng nạp</span>
                <ArrowDownLeft className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(500000)}
              </p>
              <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +100% từ tháng trước
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600">Tổng chi tiêu</span>
                <ArrowUpRight className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(235000)}
              </p>
              <p className="text-sm text-gray-500 mt-2">2 giao dịch</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600">Giao dịch tháng này</span>
                <Calendar className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-800">3</p>
              <p className="text-sm text-gray-500 mt-2">Tháng 10/2024</p>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Lịch sử giao dịch
            </h3>

            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-bold ${getTransactionColor(
                        transaction.type
                      )}`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.status === "completed"
                        ? "Hoàn thành"
                        : transaction.status === "pending"
                        ? "Đang xử lý"
                        : "Thất bại"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {transactions.length === 0 && (
              <div className="text-center py-12">
                <WalletIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có giao dịch nào</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Nạp tiền vào ví
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số tiền
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[50000, 100000, 200000, 500000, 1000000, 2000000].map(
                (preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-orange-100 hover:text-orange-600 transition-colors font-semibold"
                  >
                    {preset / 1000}K
                  </button>
                )
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeposit}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Xác nhận
              </button>
              <button
                onClick={() => {
                  setShowDepositModal(false);
                  setAmount("");
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Rút tiền từ ví
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Số dư khả dụng</p>
              <p className="text-2xl font-bold text-orange-600 mb-6">
                {formatCurrency(balance)}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số tiền muốn rút
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền"
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[50000, 100000, 200000, 300000, 400000, 500000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset.toString())}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-orange-100 hover:text-orange-600 transition-colors font-semibold"
                >
                  {preset / 1000}K
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleWithdraw}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Xác nhận
              </button>
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setAmount("");
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
