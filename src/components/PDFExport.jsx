// PDFExport.jsx
// Generates a clean, professional PDF of the full study plan and triggers
// an automatic download when the user clicks the button. Uses jsPDF only
// (no other PDF libraries), with manual pagination so long plans flow
// cleanly across multiple pages.

import jsPDF from 'jspdf'

// Reusable button component - receives plan/subject/examDate as props
// so it stays generic and could be reused anywhere a plan is available.
function PDFExport({ plan, subject, examDate }) {
  // Builds and downloads the PDF when the button is clicked
  const handleDownloadPDF = () => {
    if (!plan || plan.length === 0) return // safety check - nothing to export

    // Flatten all tasks to calculate progress summary
    const allTasks = plan.flatMap((day) => day.tasks)
    const completedCount = allTasks.filter((task) => task.completed).length
    const remainingCount = allTasks.length - completedCount
    const progressPercentage =
      allTasks.length > 0 ? Math.round((completedCount / allTasks.length) * 100) : 0

    // Create a new A4 portrait PDF document
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })

    // ---- Page/layout constants ----
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const marginLeft = 50
    const marginRight = 50
    const marginBottom = 60
    const contentWidth = pageWidth - marginLeft - marginRight

    let cursorY = 60 // tracks the current vertical position on the page

    // Helper: adds a new page and resets the cursor, used whenever content
    // would overflow the current page (keeps margins clean throughout)
    const addNewPageIfNeeded = (heightNeeded) => {
      if (cursorY + heightNeeded > pageHeight - marginBottom) {
        doc.addPage()
        cursorY = 60
      }
    }

    // ---- Header section ----
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.setTextColor(79, 70, 229) // indigo-600
    doc.text('AI Study Planner', marginLeft, cursorY)
    cursorY += 28

    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.setFont('helvetica', 'normal')

    doc.text(`Subject: ${subject || 'N/A'}`, marginLeft, cursorY)
    cursorY += 16

    const formattedExamDate = examDate
      ? new Date(examDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'N/A'
    doc.text(`Exam Date: ${formattedExamDate}`, marginLeft, cursorY)
    cursorY += 16

    const generationDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    doc.text(`Generation Date: ${generationDate}`, marginLeft, cursorY)
    cursorY += 16

    // Divider line
    doc.setDrawColor(180, 180, 200)
    doc.line(marginLeft, cursorY, pageWidth - marginRight, cursorY)
    cursorY += 26

    // ---- Day-by-day study plan section ----
    plan.forEach((day) => {
      // Reserve space for the day heading; start a new page if it won't fit
      addNewPageIfNeeded(30)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.setTextColor(99, 102, 241) // indigo-500
      doc.text(`Day ${day.day}`, marginLeft, cursorY)
      cursorY += 18

      day.tasks.forEach((task) => {
        // Each task takes roughly 3 lines (topic, priority, status) - reserve space
        addNewPageIfNeeded(46)

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.setTextColor(30, 30, 30)
        doc.text(`• ${task.topic}`, marginLeft + 10, cursorY)
        cursorY += 14

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(90, 90, 90)
        doc.text(`Priority: ${task.priority || 'N/A'}`, marginLeft + 20, cursorY)
        cursorY += 13

        const statusText = task.completed ? 'Completed' : 'Pending'
        doc.text(`Status: ${statusText}`, marginLeft + 20, cursorY)
        cursorY += 18
      })

      cursorY += 6 // extra spacing between days
    })

    // ---- Progress summary section ----
    addNewPageIfNeeded(100)

    doc.setDrawColor(180, 180, 200)
    doc.line(marginLeft, cursorY, pageWidth - marginRight, cursorY)
    cursorY += 24

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(79, 70, 229)
    doc.text('Progress Summary', marginLeft, cursorY)
    cursorY += 20

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)

    doc.text(`Progress: ${progressPercentage}%`, marginLeft, cursorY)
    cursorY += 16
    doc.text(`Completed Topics: ${completedCount}`, marginLeft, cursorY)
    cursorY += 16
    doc.text(`Remaining Topics: ${remainingCount}`, marginLeft, cursorY)
    cursorY += 26

    // ---- Footer note ----
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    doc.setTextColor(140, 140, 140)
    doc.text('Generated using AI Study Planner', marginLeft, cursorY)

    // ---- Trigger automatic download ----
    // File name includes the subject (sanitized) for easy identification
    const safeSubjectName = (subject || 'Study_Plan').replace(/[^a-zA-Z0-9]/g, '_')
    doc.save(`${safeSubjectName}_Study_Plan.pdf`)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 mb-6 flex justify-center sm:justify-end">
      <button
        onClick={handleDownloadPDF}
        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-indigo-300/50 hover:shadow-xl hover:shadow-indigo-300/60 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto justify-center"
      >
        {/* Download icon (inline SVG, no external icon library needed) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
        <span>Download Study Plan</span>
      </button>
    </div>
  )
}

export default PDFExport