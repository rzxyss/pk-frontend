export default function DashboardCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
}) {
  const isPositive = trend === "up";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        {Icon && (
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
            <Icon size={20} className="text-gray-600" strokeWidth={2} />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <h3 className="text-3xl font-semibold text-gray-900">{value}</h3>
      </div>

      {/* Change indicator */}
      {/* {change && (
        <div className="flex items-center gap-1">
          <span
            className={`text-sm font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? "↑" : "↓"} {change}
          </span>
          <span className="text-sm text-gray-500">vs last month</span>
        </div>
      )} */}
    </div>
  );
}
