import DashboardCard from "@/components/DashboardCard";
import { Users, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Parkir",
      value: "2,543",
      change: "12.5%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Total Orders",
      value: "1,834",
      change: "8.2%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Revenue",
      value: "$48,572",
      change: "23.1%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Growth",
      value: "+18.3%",
      change: "4.3%",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, here's what's happening today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <DashboardCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent activity section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
              View all
            </button>
          </div>

          <div className="space-y-4">
            {[
              {
                id: "#3492",
                customer: "Sarah Johnson",
                amount: "$129.00",
                status: "Completed",
              },
              {
                id: "#3491",
                customer: "Michael Chen",
                amount: "$89.00",
                status: "Processing",
              },
              {
                id: "#3490",
                customer: "Emma Davis",
                amount: "$249.00",
                status: "Completed",
              },
              {
                id: "#3489",
                customer: "James Wilson",
                amount: "$159.00",
                status: "Pending",
              },
            ].map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {order.customer}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{order.id}</p>
                </div>
                <div className="text-right mr-8">
                  <p className="text-sm font-medium text-gray-900">
                    {order.amount}
                  </p>
                </div>
                <div>
                  <span
                    className={`
                    inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium
                    ${
                      order.status === "Completed"
                        ? "bg-green-50 text-green-700"
                        : ""
                    }
                    ${
                      order.status === "Processing"
                        ? "bg-blue-50 text-blue-700"
                        : ""
                    }
                    ${
                      order.status === "Pending"
                        ? "bg-gray-100 text-gray-700"
                        : ""
                    }
                  `}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {[
              "Create New Order",
              "Add User",
              "Generate Report",
              "View Analytics",
            ].map((action, index) => (
              <button
                key={index}
                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
