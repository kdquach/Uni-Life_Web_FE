import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TableBookingGrid from "../components/TableBookingGrid";
import { tablesData } from "../data/tableData";
import SeatSelectionModal from "../components/SeatSelectionModal";
import { Seat, Table as TableType, TableStatus } from "../types/table";

export default function Table() {
  const [tables, setTables] = useState<TableType[]>(tablesData);
  const [selectedTable, setSelectedTable] = useState<string | null>("T-01");
  const [activeTab, setActiveTab] = useState<"all" | "reservation" | "running">(
    "all"
  );
  const [modalTableId, setModalTableId] = useState<string | null>(null);

  const selectedTableData = useMemo(
    () => tables.find((table) => table.id === selectedTable) || null,
    [tables, selectedTable]
  );

  const modalTable = useMemo(
    () =>
      modalTableId
        ? tables.find((table) => table.id === modalTableId) || null
        : null,
    [modalTableId, tables]
  );

  const deriveTableStatus = (seats: Seat[]): TableStatus => {
    if (seats.every((seat) => seat.status === "billed")) {
      return "billed";
    }

    if (
      seats.some(
        (seat) => seat.status === "reserved" || seat.status === "occupied"
      )
    ) {
      return "reserved";
    }

    if (seats.some((seat) => seat.status === "available-soon")) {
      return "available-soon";
    }

    return "available";
  };

  const handleToggleSeat = (tableId: string, seatId: string) => {
    setTables((prevTables) =>
      prevTables.map((table) => {
        if (table.id !== tableId) {
          return table;
        }

        const updatedSeats: Seat[] = table.seats.map((seat): Seat => {
          if (seat.id !== seatId) {
            return seat;
          }

          if (seat.status === "available" || seat.status === "available-soon") {
            return { ...seat, status: "selected" };
          }

          if (seat.status === "selected") {
            return { ...seat, status: "available" };
          }

          return seat;
        });

        return {
          ...table,
          seats: updatedSeats,
          status: deriveTableStatus(updatedSeats),
        };
      })
    );
  };

  const handleSelectTable = (tableId: string, openModal = true) => {
    setSelectedTable(tableId);
    if (openModal) {
      setModalTableId(tableId);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Trống";
      case "reserved":
        return "Đã đặt";
      case "billed":
        return "Đã tính tiền";
      case "available-soon":
        return "Sắp trống";
      default:
        return status;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6">
        <div className="flex gap-6 max-w-[1800px] mx-auto">
          <Sidebar />

          <div className="flex-1">
            <Navbar />

            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                      activeTab === "all"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Tất cả bàn
                  </button>
                  <button
                    onClick={() => setActiveTab("reservation")}
                    className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                      activeTab === "reservation"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Đã đặt trước
                  </button>
                  <button
                    onClick={() => setActiveTab("running")}
                    className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                      activeTab === "running"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Đang phục vụ
                  </button>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                    <span className="text-sm text-gray-600">Trống</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                    <span className="text-sm text-gray-600">Đã đặt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="text-sm text-gray-600">Đã tính tiền</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <span className="text-sm text-gray-600">Sắp trống</span>
                  </div>
                </div>

                <button className="px-6 py-2.5 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Tạo đơn hàng
                </button>
              </div>

              <TableBookingGrid
                tables={tables}
                selectedTable={selectedTable}
                onSelectTable={(tableId) => handleSelectTable(tableId, true)}
              />
            </div>
          </div>

          <div className="w-80 bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">📋</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Thông tin bàn</h3>
                <p className="text-sm text-gray-500">Đơn hàng #102</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {tables.map((table) => {
                const getStatusBg = (status: string) => {
                  switch (status) {
                    case "available":
                      return "bg-purple-500";
                    case "reserved":
                      return "bg-orange-500";
                    case "billed":
                      return "bg-green-500";
                    case "available-soon":
                      return "bg-yellow-500";
                    default:
                      return "bg-gray-500";
                  }
                };

                return (
                  <button
                    key={table.id}
                    onClick={() => handleSelectTable(table.id, true)}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                      selectedTable === table.id
                        ? `${getStatusBg(table.status)} text-white`
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {table.id}
                  </button>
                );
              })}
            </div>

            {selectedTableData && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600">Số bàn</span>
                  <span className="font-bold text-gray-800">
                    {selectedTableData.id}
                  </span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600">Sức chứa</span>
                  <span className="font-bold text-gray-800">
                    {selectedTableData.capacity} người
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái</span>
                  <span className="font-bold text-orange-600">
                    {getStatusLabel(selectedTableData.status)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {modalTable && (
        <SeatSelectionModal
          table={modalTable}
          onClose={() => setModalTableId(null)}
          onToggleSeat={(seatId) => handleToggleSeat(modalTable.id, seatId)}
        />
      )}
    </>
  );
}
