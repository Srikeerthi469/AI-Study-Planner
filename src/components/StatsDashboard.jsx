// Statistics Dashboard - shows 4 glassmorphism stat cards above the study plan
// Receives plan as a prop and calculates all values from it (no separate state needed,
// so it automatically stays in sync whenever a checkbox is toggled in the parent)

function StatsDashboard({ plan }) {
  // Flatten all tasks across all days into one array
  const allTasks = plan.flatMap((day) => day.tasks)

  const totalTopics = allTasks.length
  const completedTopics = allTasks.filter((task) => task.completed).length
  const remainingTopics = totalTopics - completedTopics
  const progressPercentage =
    totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

  // Stat card definitions - easy to extend later
  const stats = [
    {
      label: 'Total Topics',
      value: totalTopics,
      gradient: 'from-indigo-500 to-blue-500',
      bgGlow: 'bg-indigo-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
      ),
    },
    {
      label: 'Completed',
      value: completedTopics,
      gradient: 'from-green-500 to-emerald-500',
      bgGlow: 'bg-green-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      label: 'Remaining',
      value: remainingTopics,
      gradient: 'from-orange-500 to-amber-500',
      bgGlow: 'bg-orange-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
    },
    {
      label: 'Progress',
      value: `${progressPercentage}%`,
      gradient: 'from-purple-500 to-pink-500',
      bgGlow: 'bg-purple-100',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="relative bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg shadow-indigo-100 p-4 sm:p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          {/* Decorative glow blob */}
          <div className={`absolute -top-6 -right-6 w-20 h-20 ${stat.bgGlow} rounded-full blur-2xl opacity-60 pointer-events-none`}></div>

          <div className="relative z-10 flex items-center justify-between mb-3">
            <div className={`bg-gradient-to-br ${stat.gradient} text-white rounded-xl p-2.5 shadow-md`}>
              {stat.icon}
            </div>
          </div>

          <p className="relative z-10 text-2xl sm:text-3xl font-extrabold text-gray-800 mb-0.5">
            {stat.value}
          </p>
          <p className="relative z-10 text-xs sm:text-sm font-medium text-gray-500">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  )
}

export default StatsDashboard