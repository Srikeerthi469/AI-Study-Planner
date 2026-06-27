// aiPrompt.js
// Builds the prompt text sent to Gemini. Kept in its own file so the prompt
// wording can be tuned/improved later without touching the service layer
// or the UI component.

// Converts the day-wise plan into simple summary data Gemini can reason about:
// total topics, completed topics, remaining topics, and a flat topic+priority list.
function summarizePlan(plan) {
  const allTasks = plan.flatMap((day) => day.tasks)

  const completedTopics = allTasks.filter((task) => task.completed)
  const remainingTopics = allTasks.filter((task) => !task.completed)

  // Build a readable "Topic (Priority)" list for the prompt
  const topicListText = allTasks
    .map((task) => `- ${task.topic} (Priority: ${task.priority || 'N/A'})`)
    .join('\n')

  return {
    totalTopics: allTasks.length,
    completedCount: completedTopics.length,
    remainingCount: remainingTopics.length,
    topicListText,
  }
}

// Calculates days remaining until the exam date (minimum 0)
function calculateRemainingDays(examDate) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const exam = new Date(examDate)
  const diffDays = Math.ceil((exam - today) / (1000 * 60 * 60 * 24))
  return Math.max(diffDays, 0)
}

// Builds the full prompt string sent to Gemini.
// Receives: subject, examDate, dailyHours, plan (day-wise array)
export function buildStudyPrompt({ subject, examDate, dailyHours, plan }) {
  const { totalTopics, completedCount, remainingCount, topicListText } = summarizePlan(plan)
  const remainingDays = calculateRemainingDays(examDate)

  // The prompt structure mirrors the example given in the requirements,
  // explicitly asking for 7 numbered sections, returned as bullet points.
  return `You are an expert study mentor.
Analyze this student's study plan and provide personalized recommendations.

Student Details:
- Subject: ${subject}
- Exam Date: ${examDate}
- Daily Study Hours: ${dailyHours}
- Remaining Days Until Exam: ${remainingDays}
- Total Topics: ${totalTopics}
- Completed Topics: ${completedCount}
- Remaining Topics: ${remainingCount}

Topics and Priority Levels:
${topicListText}

Return your response covering exactly these 7 points:
1. Which topics should be studied first.
2. Difficult topics.
3. Revision strategy.
4. Daily study advice.
5. Time management advice.
6. Common mistakes to avoid.
7. Motivation in one sentence.

Keep the response concise using bullet points (use "•" for each bullet). Do not include any preamble or closing remarks - just the bullet points organized clearly under short headings for each of the 7 sections.`
}