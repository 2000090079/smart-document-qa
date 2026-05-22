export default function StatCard({ label, value, change, icon, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
  };

  const isPositive = change >= 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        <span className={`p-2 rounded-lg text-lg ${colors[color]}`}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      {change !== undefined && (
        <p className={`text-xs mt-1 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}% from last month
        </p>
      )}
    </div>
  );
}
