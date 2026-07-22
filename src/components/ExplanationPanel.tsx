import type { Exercise } from '../types'

interface ExplanationPanelProps {
  exercise: Exercise
  /** When false, hide until user reveals / answers */
  revealed?: boolean
}

export function ExplanationPanel({ exercise, revealed = true }: ExplanationPanelProps) {
  if (!revealed) return null
  if (!exercise.translation && !exercise.grammar) return null

  return (
    <div className="explain-panel">
      {exercise.translation && (
        <div>
          <h3>中文說明</h3>
          <p>{exercise.translation}</p>
        </div>
      )}
      {exercise.grammar && (
        <div>
          <h3>文法解釋</h3>
          <p>{exercise.grammar}</p>
        </div>
      )}
    </div>
  )
}
