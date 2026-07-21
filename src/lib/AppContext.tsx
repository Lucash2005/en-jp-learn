import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getExercisesFor } from '../data/exercises'
import {
  addGoal,
  completeExercise,
  completeOnboarding,
  getTodayProgress,
  loadProfile,
  removeGoal,
  resetProfile,
  saveProfile,
} from './profile'
import type {
  Exercise,
  Language,
  LearningGoal,
  Level,
  Skill,
  UserProfile,
  View,
} from '../types'
import { SKILL_MINUTES } from '../types'

interface AppState {
  profile: UserProfile
  view: View
  activeSkill: Skill | null
  activeExercise: Exercise | null
  setView: (view: View) => void
  finishOnboarding: (data: { displayName: string; language: Language; level: Level }) => void
  startSkill: (skill: Skill) => void
  submitExercise: (correct: boolean) => void
  skipExercise: () => void
  createGoal: (goal: Omit<LearningGoal, 'id' | 'createdAt' | 'completedDays'>) => void
  deleteGoal: (id: string) => void
  updateSettings: (data: Partial<Pick<UserProfile, 'displayName' | 'language' | 'level'>>) => void
  resetAll: () => void
  todayMinutes: number
  todaySkills: Skill[]
  nextExercise: Exercise | null
}

const AppContext = createContext<AppState | null>(null)

function pickExercise(
  profile: UserProfile,
  skill: Skill,
  excludeId?: string,
): Exercise | null {
  const pool = getExercisesFor(profile.language, profile.level, skill)
  const unfinished = pool.filter(
    (e) => !profile.completedExerciseIds.includes(e.id) && e.id !== excludeId,
  )
  const source = unfinished.length > 0 ? unfinished : pool.filter((e) => e.id !== excludeId)
  if (source.length === 0) return pool[0] ?? null
  return source[Math.floor(Math.random() * source.length)]
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile())
  const [view, setView] = useState<View>(() =>
    loadProfile().onboardingComplete ? 'home' : 'onboarding',
  )
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null)
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null)

  useEffect(() => {
    saveProfile(profile)
  }, [profile])

  const today = useMemo(() => getTodayProgress(profile), [profile])

  const finishOnboarding = useCallback(
    (data: { displayName: string; language: Language; level: Level }) => {
      setProfile((p) => completeOnboarding(p, data))
      setView('home')
    },
    [],
  )

  const startSkill = useCallback(
    (skill: Skill) => {
      setActiveSkill(skill)
      setActiveExercise(pickExercise(profile, skill))
      setView('practice')
    },
    [profile],
  )

  const advance = useCallback(
    (markComplete: boolean) => {
      if (!activeSkill || !activeExercise) return
      setProfile((p) => {
        const next = markComplete
          ? completeExercise(p, activeExercise.id, activeSkill, SKILL_MINUTES)
          : p
        const exercise = pickExercise(
          markComplete
            ? {
                ...next,
                completedExerciseIds: [...next.completedExerciseIds, activeExercise.id],
              }
            : next,
          activeSkill,
          activeExercise.id,
        )
        setActiveExercise(exercise)
        return next
      })
    },
    [activeSkill, activeExercise],
  )

  const submitExercise = useCallback(
    (_correct: boolean) => {
      advance(true)
    },
    [advance],
  )

  const skipExercise = useCallback(() => {
    if (!activeSkill || !activeExercise) return
    setActiveExercise(pickExercise(profile, activeSkill, activeExercise.id))
  }, [activeSkill, activeExercise, profile])

  const createGoal = useCallback(
    (goal: Omit<LearningGoal, 'id' | 'createdAt' | 'completedDays'>) => {
      setProfile((p) => addGoal(p, goal))
    },
    [],
  )

  const deleteGoal = useCallback((id: string) => {
    setProfile((p) => removeGoal(p, id))
  }, [])

  const updateSettings = useCallback(
    (data: Partial<Pick<UserProfile, 'displayName' | 'language' | 'level'>>) => {
      setProfile((p) => ({ ...p, ...data }))
    },
    [],
  )

  const resetAll = useCallback(() => {
    const fresh = resetProfile()
    setProfile(fresh)
    setActiveSkill(null)
    setActiveExercise(null)
    setView('onboarding')
  }, [])

  const value: AppState = {
    profile,
    view,
    activeSkill,
    activeExercise,
    setView,
    finishOnboarding,
    startSkill,
    submitExercise,
    skipExercise,
    createGoal,
    deleteGoal,
    updateSettings,
    resetAll,
    todayMinutes: today.minutesCompleted,
    todaySkills: today.skillsCompleted,
    nextExercise: activeExercise,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
