// Home page: Hero section + Planner Form + Generated Study Plan
import { useState, useEffect, useRef } from 'react'
import PlannerForm from '../components/PlannerForm.jsx'
import StudyPlan from '../components/StudyPlan.jsx'

// Keys used to store data in localStorage
const STORAGE_KEYS = {
  FORM_DATA: 'aiStudyPlanner_formData',
  PLAN: 'aiStudyPlanner_plan',
  PLAN_META: 'aiStudyPlanner_planMeta',
}

function Home() {
  const [plan, setPlan] = useState([])

  // CHANGED: planMeta now also stores `dailyHours`, needed by AISuggestions for the Gemini prompt
  const [planMeta, setPlanMeta] = useState({
    examDate: null,
    planCreatedAt: null,
    subject: '',
    dailyHours: null,
  })

  const formSectionRef = useRef(null)

  // Load saved data from localStorage when the page first loads
  useEffect(() => {
    const savedPlan = localStorage.getItem(STORAGE_KEYS.PLAN)
    if (savedPlan) {
      setPlan(JSON.parse(savedPlan))
    }

    const savedMeta = localStorage.getItem(STORAGE_KEYS.PLAN_META)
    if (savedMeta) {
      setPlanMeta(JSON.parse(savedMeta))
    }
  }, [])

  // Save plan to localStorage whenever it changes
  useEffect(() => {
    if (plan.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan))
    }
  }, [plan])

  // Scroll down to the form when "Get Started" is clicked
  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Generate the day-wise study plan based on form data
  const generatePlan = (formData) => {
    // Save form inputs to localStorage
    localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData))

    // CHANGED: also destructure `dailyHours` so it can be saved into planMeta
    const { examDate, topics, subject, dailyHours } = formData

    // Calculate number of days remaining until the exam
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const exam = new Date(examDate)
    const daysRemaining = Math.ceil((exam - today) / (1000 * 60 * 60 * 24))

    // Use however many days are available, but at least 1 day
    const totalDays = Math.max(daysRemaining, 1)

    // Distribute topics evenly across the available days
    const newPlan = []
    for (let i = 0; i < totalDays; i++) {
      newPlan.push({ day: i + 1, tasks: [] })
    }

    topics.forEach((topicItem, index) => {
      const dayIndex = index % totalDays
      newPlan[dayIndex].tasks.push({
        id: `${dayIndex}-${index}-${Date.now()}`,
        topic: topicItem.topic,
        priority: topicItem.priority,
        completed: false,
      })
    })

    const filteredPlan = newPlan.filter((day) => day.tasks.length > 0)

    setPlan(filteredPlan)

    // CHANGED: planMeta now also includes dailyHours (needed for the Gemini prompt)
    const newMeta = {
      examDate,
      planCreatedAt: new Date().toISOString(),
      subject,
      dailyHours,
    }
    setPlanMeta(newMeta)
    localStorage.setItem(STORAGE_KEYS.PLAN_META, JSON.stringify(newMeta))
  }

  // Toggle a task's completed status, then save updated plan to localStorage
  const toggleTask = (dayNumber, taskId) => {
    setPlan((prevPlan) => {
      const updatedPlan = prevPlan.map((day) => {
        if (day.day !== dayNumber) return day
        return {
          ...day,
          tasks: day.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
        }
      })
      return updatedPlan
    })
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 via-indigo-50 to-purple-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white py-24 sm:py-32 px-4 text-center">
        <div className="absolute top-[-60px] left-[-60px] w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-80px] right-[-60px] w-96 h-96 bg-pink-300/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-block bg-white/15 backdrop-blur-md border border-white/20 text-indigo-50 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            ✨ Smarter exam prep starts here
          </span>

          <h1 className="text-4xl sm:text-6xl font-extrabold mb-5 tracking-tight leading-tight">
            AI Study Planner
          </h1>

          <p className="text-lg sm:text-xl text-indigo-100 mb-10 leading-relaxed">
            Generate personalized study schedules for your exams
          </p>

          <button
            onClick={scrollToForm}
            className="bg-white text-indigo-700 font-bold px-9 py-3.5 rounded-full shadow-xl shadow-purple-900/30 hover:shadow-2xl hover:bg-indigo-50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Planner Form Section */}
      <section ref={formSectionRef} className="py-16 sm:py-20 px-4">
        <PlannerForm onGenerate={generatePlan} />
      </section>

      {/* Study Plan Display Section */}
      {plan.length > 0 && (
        <section className="pb-20 sm:pb-28">
          {/* CHANGED: dailyHours now passed down too, for the Gemini AI suggestions */}
          <StudyPlan
            plan={plan}
            onToggleTask={toggleTask}
            examDate={planMeta.examDate}
            planCreatedAt={planMeta.planCreatedAt}
            subject={planMeta.subject}
            dailyHours={planMeta.dailyHours}
          />
        </section>
      )}
    </div>
  )
}

export default Home
