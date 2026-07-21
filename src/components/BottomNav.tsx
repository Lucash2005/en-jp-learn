import { useApp } from '../lib/AppContext'
import type { View } from '../types'

const TABS: { id: View; label: string }[] = [
  { id: 'home', label: '今日' },
  { id: 'goals', label: '目標' },
  { id: 'progress', label: '進度' },
]

export function BottomNav() {
  const { view, setView } = useApp()
  if (view === 'onboarding' || view === 'practice') return null

  return (
    <nav className="bottom-nav" aria-label="主導覽">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={view === tab.id ? 'active' : ''}
          onClick={() => setView(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
