import { useEffect, useState } from 'react'
import { useApp } from '../lib/AppContext'
import { getSpeakableText } from '../lib/speech'
import { SKILL_LABELS } from '../types'
import { AudioPlayButton } from './AudioPlayButton'
import { ExplanationPanel } from './ExplanationPanel'
import { PronunciationPractice } from './PronunciationPractice'

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
  const [speakScore, setSpeakScore] = useState<number | null>(null)
  const [showExplain, setShowExplain] = useState(false)

  useEffect(() => {
    setSelected(null)
    setWritten('')
    setFeedback('idle')
    setSpeakDone(false)
    setSpeakScore(null)
    setShowExplain(false)
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
  const isListen = exercise.skill === 'listen'
  const isFreeWrite = exercise.skill === 'write' && !isChoice
  const audioText = exercise.audioText ?? getSpeakableText(exercise.content)
  const showContentText = !isListen || feedback !== 'idle' || showExplain

  const check = () => {
    if (isSpeak) {
      setSpeakDone(true)
      setFeedback(speakScore !== null && speakScore >= 75 ? 'correct' : 'review')
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
    submitExercise(feedback === 'correct' || (isSpeak && (speakScore ?? 0) >= 55))
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
          {showContentText ? (
            <p className="content-main">{exercise.content}</p>
          ) : (
            <p className="content-main muted-listen">先聽音訊，再選出意思</p>
          )}
        </div>

        {isListen && (
          <div className="audio-row">
            <AudioPlayButton text={audioText} language={exercise.language} label="播放聽力" />
            {feedback === 'idle' && (
              <button
                type="button"
                className="btn ghost tight"
                onClick={() => setShowExplain((v) => !v)}
              >
                {showExplain ? '隱藏原文' : '查看原文'}
              </button>
            )}
          </div>
        )}

        {isSpeak && (
          <PronunciationPractice
            targetText={audioText}
            language={exercise.language}
            onCompared={(s) => {
              setSpeakScore(s)
              setSpeakDone(true)
            }}
          />
        )}

        {!isListen && !isSpeak && (exercise.skill === 'read' || exercise.skill === 'write') && (
          <div className="audio-row">
            <AudioPlayButton text={audioText} language={exercise.language} label="朗讀內容" />
          </div>
        )}

        {exercise.hint && feedback === 'idle' && <p className="hint">提示：{exercise.hint}</p>}

        <ExplanationPanel
          exercise={exercise}
          revealed={feedback !== 'idle' || isSpeak || (!isListen && !isSpeak)}
        />

        {isSpeak && feedback === 'idle' && !speakDone && (
          <p className="speak-guide">先聽範讀，再點「開始跟讀比對」；也可直接完成跟讀。</p>
        )}

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

        {feedback !== 'idle' && (
          <div className={`feedback ${feedback}`}>
            {feedback === 'correct' && !isSpeak && <p>答對了，繼續保持。</p>}
            {isSpeak && (
              <p>
                {speakScore !== null
                  ? `發音比對 ${speakScore} 分。可再練一次或進入下一題。`
                  : '跟讀完成。可對照範讀再練一次，或進入下一題。'}
              </p>
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
            disabled={
              isChoice ? !selected : isFreeWrite ? !written.trim() : isSpeak ? false : false
            }
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
