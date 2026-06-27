// priorityHelpers.js
// Centralized helper functions for priority colors and labels.
// Keeping this logic in one place means that when we later let Gemini AI
// auto-predict priorities, only this file (and the AI call itself) needs updating -
// no component will need to change its rendering logic.

// Maps a priority string to its Tailwind badge classes (background + text color)
export function getPriorityColor(priority) {
  switch (priority) {
    case 'High':
      // Red gradient for high priority - most urgent
      return 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
    case 'Medium':
      // Yellow gradient for medium priority - dark text for readability
      return 'bg-gradient-to-r from-yellow-400 to-amber-400 text-gray-900'
    case 'Low':
      // Green gradient for low priority - least urgent
      return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
    default:
      // Fallback for any unexpected/missing priority value
      return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
  }
}

// Maps a priority string to its emoji + label for display
export function getPriorityLabel(priority) {
  switch (priority) {
    case 'High':
      return '🔴 High'
    case 'Medium':
      return '🟡 Medium'
    case 'Low':
      return '🟢 Low'
    default:
      return '⚪ Unknown'
  }
}

// The list of all valid priority options - used to populate dropdowns
// so there is a single source of truth for allowed priority values
export const PRIORITY_OPTIONS = ['High', 'Medium', 'Low']