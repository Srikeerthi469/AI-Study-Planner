// Form to collect subject, exam date, topics (with priority), and daily study hours
import { useState } from 'react'
import { PRIORITY_OPTIONS } from '../utils/priorityHelpers.js'

// Generates a unique id for each topic row (used as React key, not saved to plan)
let rowIdCounter = 0
function generateRowId() {
  rowIdCounter += 1
  return `row-${rowIdCounter}-${Date.now()}`
}

function PlannerForm({ onGenerate }) {
  // Form state
  const [subject, setSubject] = useState('')
  const [examDate, setExamDate] = useState('')
  const [dailyHours, setDailyHours] = useState('')
  const [errors, setErrors] = useState({})

  // CHANGED: topics is now an array of { rowId, topic, priority } objects
  // instead of a single textarea string. This lets each topic carry its own priority.
  const [topicRows, setTopicRows] = useState([
    { rowId: generateRowId(), topic: '', priority: 'Medium' },
  ])

  // Update the topic text of a specific row
  const handleTopicChange = (rowId, newText) => {
    setTopicRows((prevRows) =>
      prevRows.map((row) => (row.rowId === rowId ? { ...row, topic: newText } : row))
    )
  }

  // Update the priority of a specific row
  const handlePriorityChange = (rowId, newPriority) => {
    setTopicRows((prevRows) =>
      prevRows.map((row) =>
        row.rowId === rowId ? { ...row, priority: newPriority } : row
      )
    )
  }

  // Add a new empty topic row
  const addTopicRow = () => {
    setTopicRows((prevRows) => [
      ...prevRows,
      { rowId: generateRowId(), topic: '', priority: 'Medium' },
    ])
  }

  // Remove a topic row (but always keep at least one row visible)
  const removeTopicRow = (rowId) => {
    setTopicRows((prevRows) =>
      prevRows.length > 1 ? prevRows.filter((row) => row.rowId !== rowId) : prevRows
    )
  }

  // Validate all fields, return true if valid
  const validate = () => {
    const newErrors = {}

    if (!subject.trim()) newErrors.subject = 'Subject name is required.'

    if (!examDate) {
      newErrors.examDate = 'Exam date is required.'
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const selectedDate = new Date(examDate)
      if (selectedDate <= today) {
        newErrors.examDate = 'Exam date must be in the future.'
      }
    }

    // CHANGED: validate that at least one topic row has non-empty text
    const hasAtLeastOneTopic = topicRows.some((row) => row.topic.trim().length > 0)
    if (!hasAtLeastOneTopic) {
      newErrors.topics = 'Please enter at least one topic.'
    }

    if (!dailyHours) {
      newErrors.dailyHours = 'Daily study hours is required.'
    } else if (Number(dailyHours) <= 0) {
      newErrors.dailyHours = 'Daily study hours must be greater than 0.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) return

    // CHANGED: build an array of { topic, priority } objects instead of plain strings,
    // filtering out any empty rows the user left blank
    const topicList = topicRows
      .filter((row) => row.topic.trim().length > 0)
      .map((row) => ({
        topic: row.topic.trim(),
        priority: row.priority,
      }))

    const formData = {
      subject,
      examDate,
      topics: topicList, // now an array of objects: { topic, priority }
      dailyHours: Number(dailyHours),
    }

    onGenerate(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl shadow-indigo-100 p-6 sm:p-10 max-w-xl mx-auto space-y-6"
    >
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1">
          Create Your Study Plan
        </h2>
        <p className="text-gray-500 text-sm">
          Fill in your exam details and we'll build a day-wise plan for you.
        </p>
      </div>

      {/* Subject Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Subject Name
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Database Management Systems"
          className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white"
        />
        {errors.subject && (
          <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.subject}</p>
        )}
      </div>

      {/* Exam Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Exam Date
        </label>
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white"
        />
        {errors.examDate && (
          <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.examDate}</p>
        )}
      </div>

      {/* CHANGED: Topics section - now a dynamic list with per-topic priority selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Topics &amp; Priority
        </label>

        <div className="space-y-3">
          {topicRows.map((row) => (
            <div key={row.rowId} className="flex gap-2 items-center">
              {/* Topic name input */}
              <input
                type="text"
                value={row.topic}
                onChange={(e) => handleTopicChange(row.rowId, e.target.value)}
                placeholder="e.g. ER Model"
                className="flex-1 bg-white/80 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white"
              />

              {/* Priority dropdown for this topic */}
              <select
                value={row.priority}
                onChange={(e) => handlePriorityChange(row.rowId, e.target.value)}
                className="bg-white/80 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* Remove row button - hidden when it's the only row */}
              {topicRows.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTopicRow(row.rowId)}
                  className="text-gray-400 hover:text-red-500 transition-colors px-2 py-2.5"
                  aria-label="Remove topic"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add another topic row */}
        <button
          type="button"
          onClick={addTopicRow}
          className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          + Add another topic
        </button>

        {errors.topics && (
          <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.topics}</p>
        )}
      </div>

      {/* Daily Study Hours */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Daily Study Hours
        </label>
        <input
          type="number"
          value={dailyHours}
          onChange={(e) => setDailyHours(e.target.value)}
          placeholder="e.g. 3"
          className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white"
        />
        {errors.dailyHours && (
          <p className="text-red-500 text-sm mt-1.5 font-medium">{errors.dailyHours}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3.5 rounded-full shadow-lg shadow-indigo-300/50 hover:shadow-xl hover:shadow-indigo-300/60 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
      >
        Generate Study Plan
      </button>
    </form>
  )
}

export default PlannerForm
