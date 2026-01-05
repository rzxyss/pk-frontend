"use client";

import { useState, useEffect } from "react";
import DashboardCard from "@/components/DashboardCard";
import { Car, Ticket, DollarSign, TrendingUp, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [parkingData, setParkingData] = useState([]);
  const [ticketData, setTicketData] = useState([]);
  const [stats, setStats] = useState([
    {
      title: "Total Active Parking",
      value: "0",
      change: "0%",
      trend: "up",
      icon: Car,
    },
    {
      title: "Total Tickets",
      value: "0",
      change: "0%",
      trend: "up",
      icon: Ticket,
    },
    {
      title: "Active Tickets",
      value: "0",
      change: "0%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Parking Capacity",
      value: "0%",
      change: "0%",
      trend: "up",
      icon: Clock,
    },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch parking data
      const parkingResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/parkir`
      );
      const parkingResult = await parkingResponse.json();

      // Fetch ticket data
      const ticketResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets`
      );
      const ticketResult = await ticketResponse.json();

      if (parkingResult.success && parkingResult.data) {
        setParkingData(parkingResult.data);
      }

      if (ticketResult.success && ticketResult.data) {
        setTicketData(ticketResult.data);
      }

      // Calculate statistics
      calculateStats(parkingResult.data || [], ticketResult.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "-") return "-";

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

  const calculateRevenue7Days = (tickets) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const revenue = {};

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      revenue[dayName] = 0;
    }

    // Calculate revenue from tickets
    tickets.forEach((ticket) => {
      if (ticket.check_in && ticket.check_out) {
        const checkIn = new Date(ticket.check_in);
        const checkOut = new Date(ticket.check_out);

        // Calculate hours
        const diffMs = checkOut - checkIn;
        const diffHours = Math.ceil(diffMs / (1000 * 60 * 60)); // Round up to nearest hour

        // Revenue per hour = Rp 2.000
        const ticketRevenue = diffHours * 2000;

        // Get day name
        const dayName = days[checkIn.getDay()];

        // Check if within last 7 days
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);

        if (checkIn >= sevenDaysAgo && checkIn <= today) {
          if (revenue[dayName] !== undefined) {
            revenue[dayName] += ticketRevenue;
          }
        }
      }
    });

    // Convert to array format for chart
    const result = Object.keys(revenue).map((day) => ({
      day: day,
      amount: revenue[day],
    }));

    return result;
  };

  const calculateStats = (parkings, tickets) => {
    // Count active tickets (status aktif)
    const activeTickets = tickets.filter((t) => t.is_paid != 1).length;
    const totalTickets = tickets.length;

    // Total parkir (semua data parkir)
    const totalParkir = parkings.length;

    // Calculate capacity (assuming max 150 slots)
    const maxCapacity = 150;
    const capacityPercentage =
      totalParkir > 0 ? ((totalParkir / maxCapacity) * 100).toFixed(0) : 0;

    setStats([
      {
        title: "Total Parking Locations",
        value: totalParkir.toString(),
        change: "0%",
        trend: "up",
        icon: Car,
      },
      {
        title: "Total Tickets",
        value: totalTickets.toString(),
        change: "0%",
        trend: "up",
        icon: Ticket,
      },
      {
        title: "Active Tickets",
        value: activeTickets.toString(),
        change: "0%",
        trend: "up",
        icon: DollarSign,
      },
      {
        title: "Capacity Filled",
        value: `${capacityPercentage}`,
        change: "0%",
        trend: totalParkir > 100 ? "up" : "down",
        icon: TrendingUp,
      },
    ]);
  };

  // Data untuk chart pendapatan 7 hari terakhir dari data ticket real
  const revenueData = calculateRevenue7Days(ticketData);

  // Calculate total revenue
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.amount, 0);

  // Calculate parking status from real data
  const maxCapacity = 4;
  const currentParkir = parkingData.filter((p) => p.is_used === 1).length;
  const availableSlots = maxCapacity - currentParkir;

  const parkingStatusData = [
    { name: "Occupied", value: currentParkir, color: "#3b82f6" },
    {
      name: "Available",
      value: availableSlots > 0 ? availableSlots : 0,
      color: "#10b981",
    },
  ];

  // Get recent parking from real data (last 4)
  const recentParkings = parkingData
    .slice(-4)
    .reverse()
    .map((parking, index) => ({
      id: `P-${parking.id}`,
      name: `Area ${parking.id}`,
      status: parking.is_used,
    }));

  // Get recent tickets from real data (last 4)
  const recentTicketsList = ticketData
    .slice(-4)
    .reverse()
    .map((ticket) => ({
      id: `TK-${ticket.id}`,
      plate: ticket.number_plate || "-",
      status: ticket.is_paid != 1 ? "Active" : "Paid",
      check_in: formatDate(ticket.check_in),
      check_out: formatDate(ticket.check_out),
    }));

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome to the Parking Team Information System Dashboard
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Last 7 Days Revenue
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Total: Rp {totalRevenue.toLocaleString("id-ID")}
            </p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                formatter={(value) => `Rp ${value.toLocaleString()}`}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Parking Status Pie Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Parking Status
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={parkingStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {parkingStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                Occupied
              </span>
              <span className="font-semibold">
                {currentParkir} / {maxCapacity}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                Available
              </span>
              <span className="font-semibold">
                {availableSlots > 0 ? availableSlots : 0} / {maxCapacity}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Parking Entries */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Parking Activities
            </h2>
            <Link
              href="/parkir"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading parking data...
              </div>
            ) : recentParkings.length > 0 ? (
              recentParkings.map((parking) => (
                <div
                  key={parking.id}
                  className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full bg-green-500`}></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {parking.name}
                      </p>
                      <p className="text-xs text-gray-500">{parking.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        parking.status === 1
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {parking.status === 1 ? "Used" : "Available"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No parking data yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Tickets
            </h2>
            <Link
              href="/ticket"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading ticket data...
              </div>
            ) : recentTicketsList.length > 0 ? (
              recentTicketsList.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {ticket.plate}
                      {/* {ticket.customer} */}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {ticket.check_in} • {ticket.check_out}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {ticket.plate}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        ticket.status === "Active"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {ticket.status === "Active" ? "Active" : "Paid"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No ticket data yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
