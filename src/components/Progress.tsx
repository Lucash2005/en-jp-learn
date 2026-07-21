import { useApp } from '../lib/AppContext'
import {
  DAILY_MINUTES,
  LANGUAGE_LABELS,
  LEVEL_LABELS,
  SKILL_LABELS,
  type Language,
  type Level,
  type Skill,
} from '../types'

const SKILLS: Skill[] = ['speak', 'listen', 'read', 'write']

export function Progress() {
  const { profile, updateSettings, resetAll, todayMinutes } = useApp()
  const maxSkill = Math.max(1, ...SKILLS.map((s) => profile.skillMinutes[s]))
  const recent = [...profile.dailyHistory].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7)

  return (
    <section className="screen progress">
      <header className="section-head animate-fade">
        <h1>進度與設定</h1>
        <p>累積 {profile.totalMinutes} 分鐘 · 連續 {profile.streak} 天</p>
      </header>

      <div className="stat-grid animate-rise">
        <div className="stat">
          <span>今日</span>
          <strong>
            {todayMinutes}/{DAILY_MINUTES}
          </strong>
        </div>
        <div className="stat">
          <span>總練習</span>
          <strong>{profile.completedExerciseIds.length}</strong>
        </div>
      </div>

      <h2 className="subhead">四技能分鐘數</h2>
      <ul className="skill-bars">
        {SKILLS.map((skill, i) => {
          const mins = profile.skillMinutes[skill]
          const pct = Math.round((mins / maxSkill) * 100)
          return (
            <li key={skill} className={`animate-rise delay-${i + 1}`}>
              <div className="skill-bar-label">
                <span>{SKILL_LABELS[skill]}</span>
                <span>{mins} 分</span>
              </div>
              <div className="bar">
                <span style={{ width: `${pct}%` }} />
              </div>
            </li>
          )
        })}
      </ul>

      <h2 className="subhead">近七日</h2>
      <ul className="history">
        {recent.length === 0 && <li className="empty">還沒有紀錄，今天開始第一天。</li>}
        {recent.map((d) => (
          <li key={d.date}>
            <span>{d.date}</span>
            <span>
              {d.minutesCompleted} 分 · {d.skillsCompleted.map((s) => SKILL_LABELS[s]).join('')}
            </span>
          </li>
        ))}
      </ul>

      <h2 className="subhead">學習設定</h2>
      <div className="settings panel-soft animate-rise">
        <label>
          顯示名稱
          <input
            className="field"
            value={profile.displayName}
            onChange={(e) => updateSettings({ displayName: e.target.value })}
          />
        </label>
        <label>
          語言
          <select
            className="field"
            value={profile.language}
            onChange={(e) => updateSettings({ language: e.target.value as Language })}
          >
            {(Object.keys(LANGUAGE_LABELS) as Language[]).map((l) => (
              <option key={l} value={l}>
                {LANGUAGE_LABELS[l]}
              </option>
            ))}
          </select>
        </label>
        <label>
          程度
          <select
            className="field"
            value={profile.level}
            onChange={(e) => updateSettings({ level: e.target.value as Level })}
          >
            {(Object.keys(LEVEL_LABELS) as Level[]).map((l) => (
              <option key={l} value={l}>
                {LEVEL_LABELS[l]}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="btn ghost danger"
          onClick={() => {
            if (confirm('確定重置所有進度？')) resetAll()
          }}
        >
          重置全部資料
        </button>
      </div>
    </section>
  )
}
