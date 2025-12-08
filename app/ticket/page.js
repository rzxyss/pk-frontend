"use client";

import { useState, useEffect } from "react";
import { Car, CheckCircle, XCircle, Plus, Trash2, LogOut } from "lucide-react";
import axios from "axios";
import Link from "next/link";

export default function TicketPage() {
  const [ticketData, setTicketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [gateStatus, setGateStatus] = useState("close");
  const [gateLoading, setGateLoading] = useState(false);

  useEffect(() => {
    fetchTicketData();
    fetchGateStatus();
    const interval = setInterval(() => {
      fetchTicketData();
      fetchGateStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTicketData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets`
      );
      setTicketData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching ticket data:", error);
      setLoading(false);
    }
  };

  const fetchGateStatus = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gate/status`
      );
      setGateStatus(response.data.data.gate_status || "close");
    } catch (error) {
      console.error("Error fetching gate status:", error);
    }
  };

  const handleControlGate = async (action) => {
    setGateLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gate/control`,
        {
          action: action,
        }
      );
      setGateStatus(action);
      alert(`Gate berhasil di-${action}!`);
    } catch (error) {
      console.error("Error controlling gate:", error);
      alert(
        "Gagal mengontrol gate: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setGateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tiket ini?")) {
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/${id}`
      );
      alert("Tiket berhasil dihapus!");
      fetchTicketData();
    } catch (error) {
      console.error("Error deleting ticket:", error);
      alert(
        "Gagal menghapus tiket: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleCheckout = async (id) => {
    if (!confirm("Apakah Anda yakin ingin checkout tiket ini?")) {
      return;
    }

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/${id}/checkout`
      );

      // Otomatis open gate setelah checkout
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gate/control`,
        {
          action: "open",
        }
      );

      alert("Checkout berhasil!");
      fetchTicketData();
      fetchGateStatus();
    } catch (error) {
      console.error("Error checkout ticket:", error);
      alert(
        "Gagal checkout tiket: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredData =
    filter === "all"
      ? ticketData
      : filter === "active"
      ? ticketData.filter((item) => item.is_paid === 0)
      : ticketData.filter((item) => item.is_paid === 1);

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "paid", label: "Paid" },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Manajemen Tiket
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola tiket parkir dan riwayat transaksi
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              handleControlGate(gateStatus === "open" ? "close" : "open")
            }
            disabled={gateLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              gateStatus === "open"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {gateLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <LogOut size={16} />
            )}
            {gateStatus === "open" ? "Close Gate" : "Open Gate"}
          </button>
          <Link
            href="/ticket/create"
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Tambah Tiket
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Data Tiket
              </h2>
              <div className="flex gap-2">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilter(opt.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === opt.value
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nomor Plat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parkir
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Car size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {item.number_plate}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.parking_number || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(item.check_in)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(item.check_out)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.is_paid === 1 ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          <CheckCircle size={12} />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          <XCircle size={12} />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        {item.is_paid === 0 && (
                          <button
                            onClick={() => handleCheckout(item.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Checkout"
                          >
                            <LogOut size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Menampilkan {filteredData.length} dari {ticketData.length} data
              </p>
              <div className="text-sm text-gray-600">
                Terakhir diperbarui: {new Date().toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
