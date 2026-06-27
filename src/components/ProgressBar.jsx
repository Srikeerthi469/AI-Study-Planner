// Animated progress bar showing percentage of completed tasks
function ProgressBar({ percentage }) {
  return (
    <div className="w-full max-w-xl mx-auto mb-8 bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl shadow-md shadow-indigo-100 p-5">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">Overall Progress</span>
        <span className="text-sm font-bold text-indigo-600">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200/70 rounded-full h-3.5 overflow-hidden">
        <div
          key={percentage} // forces re-trigger of animation when percentage changes
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3.5 rounded-full transition-all duration-700 ease-out animate-progress"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
