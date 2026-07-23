import type { Exercise } from '../types'
import { FuriganaText } from './FuriganaText'

interface ExplanationPanelProps {
  exercise: Exercise
  /** When false, hide until user reveals / answers */
  revealed?: boolean
}

export function ExplanationPanel({ exercise, revealed = true }: ExplanationPanelProps) {
  if (!revealed) return null
  if (!exercise.translation && !exercise.grammar && !exercise.ruby) return null

  const isJp = exercise.language === 'jp'
  const reading = exercise.ruby ?? (isJp ? exercise.content : undefined)

  return (
    <div className="explain-panel">
      {isJp && reading && (
        <div>
          <h3>日文讀音</h3>
          <FuriganaText text={reading} className="furigana-line" as="p" />
        </div>
      )}
      {exercise.translation && (
        <div>
          <h3>中文說明</h3>
          <p>{exercise.translation}</p>
        </div>
      )}
      {exercise.grammar && (
        <div>
          <h3>文法解釋</h3>
          {isJp ? (
            <FuriganaText text={exercise.grammar} className="furigana-line" as="p" />
          ) : (
            <p>{exercise.grammar}</p>
          )}
        </div>
      )}
      {exercise.source && (
        <div>
          <h3>出處</h3>
          <p className="source-line">出自《{exercise.source}》</p>
        </div>
      )}
    </div>
  )
}
