import { useState } from 'react'
import { useApp } from '../lib/AppContext'
import type { Language, Level } from '../types'
import { LANGUAGE_LABELS, LEVEL_LABELS, DAILY_MINUTES } from '../types'

export function Onboarding() {
  const { finishOnboarding } = useApp()
  const [step, setStep] = useState(0)
  const [displayName, setDisplayName] = useState('')
  const [language, setLanguage] = useState<Language>('en')
  const [level, setLevel] = useState<Level>('beginner')

  return (
    <section className="screen onboarding">
      <div className="onboarding-bg" aria-hidden="true" />
      <div className="onboarding-inner">
        {step === 0 && (
          <div className="hero-block animate-rise">
            <p className="brand">言橋</p>
            <h1 className="hero-title">每日二十分鐘，架起語言之橋</h1>
            <p className="hero-lead">
              依程度練習說、聽、讀、寫。英語與日語，一步一橋。
            </p>
            <button type="button" className="btn primary" onClick={() => setStep(1)}>
              開始橋上練習
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="panel animate-rise">
            <h2>怎麼稱呼你？</h2>
            <p className="muted">可留空，之後也能改。</p>
            <input
              className="field"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="例如：小橋"
              maxLength={20}
              autoFocus
            />
            <div className="row-actions">
              <button type="button" className="btn ghost" onClick={() => setStep(0)}>
                返回
              </button>
              <button type="button" className="btn primary" onClick={() => setStep(2)}>
                下一步
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="panel animate-rise">
            <h2>想學哪種語言？</h2>
            <p className="muted">之後可在進度頁切換。</p>
            <div className="choice-grid">
              {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`choice ${language === lang ? 'selected' : ''}`}
                  onClick={() => setLanguage(lang)}
                >
                  <span className="choice-label">{LANGUAGE_LABELS[lang]}</span>
                  <span className="choice-sub">{lang === 'en' ? 'English' : '日本語'}</span>
                </button>
              ))}
            </div>
            <div className="row-actions">
              <button type="button" className="btn ghost" onClick={() => setStep(1)}>
                返回
              </button>
              <button type="button" className="btn primary" onClick={() => setStep(3)}>
                下一步
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="panel animate-rise">
            <h2>目前程度？</h2>
            <p className="muted">內容會依程度調整難度。</p>
            <div className="choice-stack">
              {(Object.keys(LEVEL_LABELS) as Level[]).map((lv) => (
                <button
                  key={lv}
                  type="button"
                  className={`choice wide ${level === lv ? 'selected' : ''}`}
                  onClick={() => setLevel(lv)}
                >
                  <span className="choice-label">{LEVEL_LABELS[lv]}</span>
                  <span className="choice-sub">
                    {lv === 'beginner' && '建立基礎句型與日常詞彙'}
                    {lv === 'intermediate' && '強化理解與自然表達'}
                    {lv === 'advanced' && '精煉思辨與語感'}
                  </span>
                </button>
              ))}
            </div>
            <div className="row-actions">
              <button type="button" className="btn ghost" onClick={() => setStep(2)}>
                返回
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={() =>
                  finishOnboarding({
                    displayName: displayName.trim() || '學習者',
                    language,
                    level,
                  })
                }
              >
                設定每日 {DAILY_MINUTES} 分鐘目標
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
