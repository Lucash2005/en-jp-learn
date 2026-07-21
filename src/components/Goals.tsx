import { useState, type FormEvent } from 'react'
import { useApp } from '../lib/AppContext'
import {
  LANGUAGE_LABELS,
  SKILL_LABELS,
  type Language,
  type Skill,
} from '../types'

export function Goals() {
  const { profile, createGoal, deleteGoal } = useApp()
  const [title, setTitle] = useState('')
  const [targetDays, setTargetDays] = useState(7)
  const [skill, setSkill] = useState<Skill | ''>('')
  const [open, setOpen] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    createGoal({
      title: title.trim(),
      targetDays,
      language: profile.language as Language,
      skill: skill || undefined,
    })
    setTitle('')
    setTargetDays(7)
    setSkill('')
    setOpen(false)
  }

  return (
    <section className="screen goals">
      <header className="section-head animate-fade">
        <h1>學習目標</h1>
        <p>把每日練習連成可追蹤的橋段。</p>
      </header>

      <ul className="goal-list">
        {profile.goals.length === 0 && (
          <li className="empty">尚未設定目標。先定一個小目標開始。</li>
        )}
        {profile.goals.map((g, i) => {
          const pct = Math.min(100, Math.round((g.completedDays / g.targetDays) * 100))
          return (
            <li key={g.id} className={`goal-item animate-rise delay-${(i % 3) + 1}`}>
              <div className="goal-top">
                <strong>{g.title}</strong>
                <button
                  type="button"
                  className="btn ghost tight"
                  onClick={() => deleteGoal(g.id)}
                  aria-label="刪除目標"
                >
                  刪除
                </button>
              </div>
              <p className="muted">
                {LANGUAGE_LABELS[g.language]}
                {g.skill ? ` · ${SKILL_LABELS[g.skill]}` : ' · 綜合'}
              </p>
              <div className="bar">
                <span style={{ width: `${pct}%` }} />
              </div>
              <p className="goal-meta">
                {g.completedDays} / {g.targetDays} 天 · {pct}%
              </p>
            </li>
          )
        })}
      </ul>

      {!open ? (
        <button type="button" className="btn primary wide" onClick={() => setOpen(true)}>
          新增目標
        </button>
      ) : (
        <form className="goal-form animate-rise" onSubmit={submit}>
          <label>
            目標名稱
            <input
              className="field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：連續 14 天聽力"
              required
            />
          </label>
          <label>
            目標天數
            <input
              className="field"
              type="number"
              min={3}
              max={90}
              value={targetDays}
              onChange={(e) => setTargetDays(Number(e.target.value))}
            />
          </label>
          <label>
            聚焦技能（可選）
            <select
              className="field"
              value={skill}
              onChange={(e) => setSkill(e.target.value as Skill | '')}
            >
              <option value="">綜合</option>
              {(Object.keys(SKILL_LABELS) as Skill[]).map((s) => (
                <option key={s} value={s}>
                  {SKILL_LABELS[s]}
                </option>
              ))}
            </select>
          </label>
          <div className="row-actions">
            <button type="button" className="btn ghost" onClick={() => setOpen(false)}>
              取消
            </button>
            <button type="submit" className="btn primary">
              儲存
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
