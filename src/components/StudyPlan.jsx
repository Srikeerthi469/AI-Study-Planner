// Displays the day-wise study plan as glassmorphism cards with checkboxes
import ProgressBar from './ProgressBar.jsx'
import StatsDashboard from './StatsDashboard.jsx'
import StudyTips from './StudyTips.jsx'
import CountdownTimer from './CountdownTimer.jsx'
import AISuggestions from './AISuggestions.jsx' // NEW
import PDFExport from './PDFExport.jsx'
import { getPriorityColor, getPriorityLabel } from '../utils/priorityHelpers.js'

// CHANGED: now also receives `dailyHours`, needed to build the Gemini prompt
function StudyPlan({ plan, onToggleTask, examDate, planCreatedAt, subject, dailyHours }) {
  if (!plan || plan.length === 0) return null

  // Calculate completion percentage across all tasks
  const allTasks = plan.flatMap((day) => day.tasks)
  const completedCount = allTasks.filter((task) => task.completed).length
  const percentage =
    allTasks.length > 0 ? Math.round((completedCount / allTasks.length) * 100) : 0

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <div className="text-center mb-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
          Your Study Plan
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mb-6">
          Track your daily topics and watch your progress grow
        </p>
      </div>

      {/* 1. Statistics Dashboard */}
      <StatsDashboard plan={plan} />

      {/* 2. Exam Countdown Timer */}
      <CountdownTimer examDate={examDate} planCreatedAt={planCreatedAt} />

      {/* 3. AI Study Tip card */}
      <StudyTips />

      {/* 4. NEW: Gemini AI Suggestions card */}
      <AISuggestions
        plan={plan}
        subject={subject}
        examDate={examDate}
        dailyHours={dailyHours}
      />

      {/* 5. Progress Bar */}
      <ProgressBar percentage={percentage} />

      {/* 6. Daily Study Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plan.map((day, index) => {
          const dayCompleted = day.tasks.filter((t) => t.completed).length
          const dayTotal = day.tasks.length
          const isDayDone = dayCompleted === dayTotal

          return (
            <div
              key={day.day}
              style={{ animationDelay: `${index * 60}ms` }}
              className="animate-fade-in-up bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl shadow-lg shadow-indigo-100 p-6 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Day {day.day}
                </h3>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    isDayDone
                      ? 'bg-green-100 text-green-700'
                      : 'bg-indigo-50 text-indigo-600'
                  }`}
                >
                  {dayCompleted}/{dayTotal} done
                </span>
              </div>

              <ul className="space-y-3">
                {day.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-start justify-between gap-3 group cursor-pointer hover:bg-white/40 rounded-xl px-2 py-1.5 -mx-2 transition-colors duration-200"
                    onClick={() => onToggleTask(day.day, task.id)}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleTask(day.day, task.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 w-4.5 h-4.5 accent-indigo-600 cursor-pointer flex-shrink-0"
                      />
                      <span
                        className={`text-sm sm:text-base transition-colors duration-200 break-words ${
                          task.completed
                            ? 'line-through text-gray-400'
                            : 'text-gray-700 group-hover:text-indigo-600'
                        }`}
                      >
                        {task.topic}
                      </span>
                    </div>

                    <span
                      className={`flex-shrink-0 text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm whitespace-nowrap ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {getPriorityLabel(task.priority)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* 7. PDF Export - kept at the bottom, as the last item in the requested order */}
      <div className="mt-10">
        <PDFExport plan={plan} subject={subject} examDate={examDate} />
      </div>
    </div>
  )
}

export default StudyPlan
