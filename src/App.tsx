import { AppProvider, useApp } from './lib/AppContext'
import { Onboarding } from './components/Onboarding'
import { Home } from './components/Home'
import { Practice } from './components/Practice'
import { Goals } from './components/Goals'
import { Progress } from './components/Progress'
import { BottomNav } from './components/BottomNav'
import './App.css'

function Shell() {
  const { view } = useApp()

  return (
    <div className="app-shell">
      <main className="app-main">
        {view === 'onboarding' && <Onboarding />}
        {view === 'home' && <Home />}
        {view === 'practice' && <Practice />}
        {view === 'goals' && <Goals />}
        {view === 'progress' && <Progress />}
      </main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
