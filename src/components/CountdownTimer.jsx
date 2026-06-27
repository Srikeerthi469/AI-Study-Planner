// CountdownTimer.jsx
// Displays a live countdown to the exam date, plus a circular progress ring
// showing how much of the (planCreatedAt -> examDate) time window has elapsed.
//
// Structured to be easily extended later for:
// - Google Calendar sync (just feed in a synced examDate)
// - Notification reminders (hook into the same interval tick)
// - AI schedule adjustments (re-run plan when countdown crosses a threshold)
// - Multiple exams (wrap this component in a list, one instance per exam)

import { useState, useEffect } from 'react'

// Pure helper - calculates {days, hours, minutes, seconds, isPast} from a target date.
// Kept outside the component so it's reusable/testable and has no dependency on state.
function getTimeRemaining(examDate) {
  const total = new Date(examDate).getTime() - new Date().getTime()

  if (isNaN(total)) {
    // examDate missing or invalid - treat as no countdown available
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false, isInvalid: true }
  }

  const isPast = total <= 0

  // Use absolute value so we always show positive numbers, even right at zero
  const safeTotal = Math.max(total, 0)

  const days = Math.floor(safeTotal / (1000 * 60 * 60 * 24))
  const hours = Math.floor((safeTotal / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((safeTotal / (1000 * 60)) % 60)
  const seconds = Math.floor((safeTotal / 1000) % 60)

  return { total, days, hours, minutes, seconds, isPast, isInvalid: false }
}

// Pads a number with a leading zero (e.g. 6 -> "06") for a cleaner digital look
function padNumber(num) {
  return String(num).padStart(2, '0')
}

function CountdownTimer({ examDate, planCreatedAt }) {
  // Holds the current breakdown of remaining time, recalculated every second
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(examDate))

  // Set up a ticking interval that recalculates the countdown every second
  useEffect(() => {
    // Recalculate immediately in case examDate just changed
    setTimeLeft(getTimeRemaining(examDate))

    const intervalId = setInterval(() => {
      setTimeLeft(getTimeRemaining(examDate))
    }, 1000)

    // Always clean up the interval when the component unmounts
    // or when examDate changes (avoids stacking multiple intervals)
    return () => clearInterval(intervalId)
  }, [examDate])

  // ---- Circular progress ring calculation ----
  // Percentage of time elapsed between planCreatedAt and examDate.
  // If planCreatedAt is missing, fall back to 0% (ring just won't be very meaningful).
  let elapsedPercentage = 0
  if (planCreatedAt && examDate && !timeLeft.isInvalid) {
    const start = new Date(planCreatedAt).getTime()
    const end = new Date(examDate).getTime()
    const now = Date.now()

    const totalWindow = end - start
    const elapsed = now - start

    if (totalWindow > 0) {
      elapsedPercentage = Math.min(100, Math.max(0, (elapsed / totalWindow) * 100))
    } else {
      elapsedPercentage = 100
    }
  }

  // SVG circle math for the progress ring
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (elapsedPercentage / 100) * circumference

  // Four countdown unit cards - defined as data so the JSX below stays clean
  // and so adding a 5th unit (e.g. "Weeks") later is a one-line change.
  const countdownUnits = [
    { label: 'Days', value: timeLeft.days, gradient: 'from-indigo-500 to-blue-500' },
    { label: 'Hours', value: timeLeft.hours, gradient: 'from-purple-500 to-indigo-500' },
    { label: 'Minutes', value: timeLeft.minutes, gradient: 'from-pink-500 to-purple-500' },
    { label: 'Seconds', value: timeLeft.seconds, gradient: 'from-rose-500 to-pink-500' },
  ]

  return (
    <div className="relative max-w-3xl mx-auto mb-8 overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg shadow-indigo-100 p-6 sm:p-8">
      {/* Subtle gradient border glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-pink-400/20 pointer-events-none"></div>

      {/* Decorative floating glow blobs */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-300/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-300/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Title with circular progress ring around the clock icon */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {/* Circular progress ring wrapping the clock emoji */}
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 100 100">
              {/* Background track circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-gray-200"
              />
              {/* Animated progress circle - shows % of time elapsed toward exam */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="text-indigo-500 transition-all duration-1000 ease-linear"
                stroke="url(#countdownGradient)"
              />
              {/* Gradient definition used by the progress circle stroke */}
              <defs>
                <linearGradient id="countdownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            {/* Clock emoji centered inside the ring */}
            <span className="absolute inset-0 flex items-center justify-center text-xl">
              ⏰
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Exam Countdown
          </h3>
        </div>

        {/* Conditional rendering: exam day / exam passed / normal countdown */}
        {timeLeft.isInvalid ? (
          <p className="text-center text-gray-500 text-sm">Exam date not set.</p>
        ) : timeLeft.isPast ? (
          timeLeft.total === 0 && timeLeft.days === 0 ? (
            // Exam day arrived but we can't tell "today" vs "passed" purely from total<=0,
            // so we treat total<=0 as already passed, and total===0 edge case rarely hits.
            <div className="text-center py-4">
              <p className="text-2xl font-extrabold text-gray-800 mb-1">✅ Exam Completed</p>
              <p className="text-gray-500 text-sm">Hope you did your best!</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-2xl font-extrabold text-gray-800 mb-1">✅ Exam Completed</p>
              <p className="text-gray-500 text-sm">Hope you did your best!</p>
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {countdownUnits.map((unit) => (
              <div
                key={unit.label}
                className="relative bg-white/80 rounded-2xl shadow-md p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Floating glow behind each card */}
                <div
                  className={`absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br ${unit.gradient} opacity-20 rounded-full blur-2xl pointer-events-none`}
                ></div>

                <p
                  className={`relative z-10 text-2xl sm:text-3xl font-extrabold bg-gradient-to-br ${unit.gradient} bg-clip-text text-transparent`}
                >
                  {padNumber(unit.value)}
                </p>
                <p className="relative z-10 text-xs sm:text-sm font-medium text-gray-500 mt-1">
                  {unit.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Special "exam is today" message - shown only when days/hours/min/sec are all 0
            but exam hasn't technically passed yet (edge case near midnight of exam day) */}
        {!timeLeft.isInvalid &&
          !timeLeft.isPast &&
          timeLeft.days === 0 &&
          timeLeft.hours === 0 &&
          timeLeft.minutes === 0 &&
          timeLeft.seconds === 0 && (
            <div className="text-center mt-4">
              <p className="text-xl font-extrabold text-gray-800">🎉 Good Luck!</p>
              <p className="text-gray-500 text-sm">Your exam is today.</p>
            </div>
          )}
      </div>
    </div>
  )
}

export default CountdownTimer