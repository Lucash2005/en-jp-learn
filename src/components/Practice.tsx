import { useEffect, useState } from 'react'
import { useApp } from '../lib/AppContext'
import { SKILL_LABELS } from '../types'

export function Practice() {
  const {
    activeSkill,
    activeExercise,
    submitExercise,
    skipExercise,
    setView,
  } = useApp()
  const [selected, setSelected] = useState<string | null>(null)
  const [written, setWritten] = useState('')
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'review'>('idle')
  const [speakDone, setSpeakDone] = useState(false)

  useEffect(() => {
    setSelected(null)
    setWritten('')
    setFeedback('idle')
    setSpeakDone(false)
  }, [activeExercise?.id])

  if (!activeSkill || !activeExercise) {
    return (
      <section className="screen practice">
        <p>找不到練習內容。</p>
        <button type="button" className="btn primary" onClick={() => setView('home')}>
          回首頁
        </button>
      </section>
    )
  }

  const exercise = activeExercise
  const isChoice = Boolean(exercise.options?.length)
  const isSpeak = exercise.skill === 'speak'
  const isFreeWrite = exercise.skill === 'write' && !isChoice

  const check = () => {
    if (isSpeak) {
      setSpeakDone(true)
      setFeedback('review')
      return
    }
    if (isChoice) {
      if (!selected) return
      const ok = selected === exercise.answer
      setFeedback(ok ? 'correct' : 'review')
      return
    }
    if (isFreeWrite) {
      if (!written.trim()) return
      setFeedback('review')
    }
  }

  const continueNext = () => {
    submitExercise(feedback === 'correct')
  }

  return (
    <section className="screen practice">
      <header className="practice-top animate-fade">
        <button type="button" className="btn ghost tight" onClick={() => setView('home')}>
          ← 結束
        </button>
        <span className="practice-skill">{SKILL_LABELS[activeSkill]} · 練習</span>
        <button type="button" className="btn ghost tight" onClick={skipExercise}>
          換題
        </button>
      </header>

      <article className="practice-card animate-rise" key={exercise.id}>
        <p className="prompt">{exercise.prompt}</p>
        <div className={`content-block skill-${exercise.skill}`}>
          <p className="content-main">{exercise.content}</p>
        </div>

        {exercise.hint && feedback === 'idle' && <p className="hint">提示：{exercise.hint}</p>}

        {isChoice && (
          <div className="options">
            {exercise.options!.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`option ${selected === opt ? 'selected' : ''} ${
                  feedback !== 'idle' && opt === exercise.answer ? 'correct' : ''
                } ${
                  feedback !== 'idle' && selected === opt && opt !== exercise.answer
                    ? 'wrong'
                    : ''
                }`}
                disabled={feedback !== 'idle'}
                onClick={() => setSelected(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {isFreeWrite && (
          <textarea
            className="field area"
            rows={3}
            value={written}
            onChange={(e) => setWritten(e.target.value)}
            placeholder="在此寫下你的答案…"
            disabled={feedback !== 'idle'}
          />
        )}

        {isSpeak && feedback === 'idle' && (
          <p className="speak-guide">朗讀兩到三遍後，點「完成跟讀」。</p>
        )}

        {feedback !== 'idle' && (
          <div className={`feedback ${feedback}`}>
            {feedback === 'correct' && <p>答對了，繼續保持。</p>}
            {feedback === 'review' && isSpeak && speakDone && (
              <p>跟讀完成。可對照語氣再練一次，或進入下一題。</p>
            )}
            {feedback === 'review' && isFreeWrite && (
              <p>
                參考寫法：<strong>{exercise.content}</strong>
              </p>
            )}
            {feedback === 'review' && isChoice && selected !== exercise.answer && (
              <p>
                正解：<strong>{exercise.answer}</strong>
              </p>
            )}
          </div>
        )}
      </article>

      <div className="practice-actions">
        {feedback === 'idle' ? (
          <button
            type="button"
            className="btn primary wide"
            onClick={check}
            disabled={isChoice ? !selected : isFreeWrite ? !written.trim() : false}
          >
            {isSpeak ? '完成跟讀' : '核對'}
          </button>
        ) : (
          <button type="button" className="btn primary wide" onClick={continueNext}>
            下一題 · 計入進度
          </button>
        )}
      </div>
    </section>
  )
}
