import { useApp } from '../lib/AppContext'
import {
  DAILY_MINUTES,
  LANGUAGE_LABELS,
  LEVEL_LABELS,
  SKILL_DESCRIPTIONS,
  SKILL_LABELS,
  type Skill,
} from '../types'

const SKILLS: Skill[] = ['speak', 'listen', 'read', 'write']

export function Home() {
  const { profile, todayMinutes, todaySkills, startSkill, setView } = useApp()
  const progress = Math.min(100, Math.round((todayMinutes / DAILY_MINUTES) * 100))
  const remaining = Math.max(0, DAILY_MINUTES - todayMinutes)
  const greeting = profile.displayName || '學習者'

  return (
    <section className="screen home">
      <header className="topbar animate-fade">
        <div>
          <p className="brand compact">言橋</p>
          <p className="greeting">你好，{greeting}</p>
        </div>
        <button type="button" className="chip" onClick={() => setView('progress')}>
          {LANGUAGE_LABELS[profile.language]} · {LEVEL_LABELS[profile.level]}
        </button>
      </header>

      <div className="daily-hero animate-rise">
        <div className="ring-wrap" style={{ ['--p' as string]: `${progress}%` }}>
          <div className="ring">
            <div className="ring-core">
              <strong>{todayMinutes}</strong>
              <span>/ {DAILY_MINUTES} 分</span>
            </div>
          </div>
        </div>
        <div className="daily-copy">
          <h1>今日橋段</h1>
          <p>
            {remaining === 0
              ? '今日目標已完成，可自由加練任一技能。'
              : `還差 ${remaining} 分鐘。四技能各約 5 分鐘。`}
          </p>
          <p className="streak">連續學習 {profile.streak} 天</p>
        </div>
      </div>

      <div className="skill-list">
        {SKILLS.map((skill, i) => {
          const done = todaySkills.includes(skill)
          return (
            <button
              key={skill}
              type="button"
              className={`skill-row animate-rise delay-${i + 1} ${done ? 'done' : ''}`}
              onClick={() => startSkill(skill)}
            >
              <span className="skill-mark">{SKILL_LABELS[skill]}</span>
              <span className="skill-text">
                <strong>{SKILL_DESCRIPTIONS[skill]}</strong>
                <small>{done ? '今日已練習' : '約 5 分鐘'}</small>
              </span>
              <span className="skill-go" aria-hidden="true">
                →
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
