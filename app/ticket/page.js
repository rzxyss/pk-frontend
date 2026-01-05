"use client";

import { useState, useEffect } from "react";
import { Car, CheckCircle, XCircle, Plus, Trash2, LogOut } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import Swal from "sweetalert2";

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
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: `Gate has been ${action}ed successfully!`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error controlling gate:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          "Failed to control gate: " +
          (error.response?.data?.message || error.message),
      });
    } finally {
      setGateLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/${id}`
      );
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Ticket has been deleted successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      fetchTicketData();
    } catch (error) {
      console.error("Error deleting ticket:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          "Failed to delete ticket: " +
          (error.response?.data?.message || error.message),
      });
    }
  };

  const handleCheckout = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Checkout",
      text: "Are you sure you want to checkout this ticket?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, checkout!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
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

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Checkout completed successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      fetchTicketData();
      fetchGateStatus();
    } catch (error) {
      console.error("Error checkout ticket:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          "Failed to checkout ticket: " +
          (error.response?.data?.message || error.message),
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = String(date.getDate()).padStart(2, "0");
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day} ${month} ${year}, ${hours}:${minutes}`;
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
            Management Parking Tickets
          </h1>
          <p className="text-gray-600 mt-1">
            Manage parking tickets and transaction history
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
            Create Ticket
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
                Tickets Data
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
                    Number Plate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parking Number
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
                Showing {filteredData.length} of {ticketData.length} entries
              </p>
              <div className="text-sm text-gray-600">
                Last updated:{" "}
                {(() => {
                  const date = new Date();
                  const months = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ];
                  const day = String(date.getDate()).padStart(2, "0");
                  const month = months[date.getMonth()];
                  const year = date.getFullYear();
                  const hours = String(date.getHours()).padStart(2, "0");
                  const minutes = String(date.getMinutes()).padStart(2, "0");
                  return `${day} ${month} ${year}, ${hours}:${minutes}`;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
