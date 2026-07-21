import type { DailyProgress, Language, Level, LearningGoal, Skill, UserProfile } from '../types'
import { DAILY_MINUTES } from '../types'

const STORAGE_KEY = 'yanqiao-profile-v1'

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function emptySkillMinutes(): Record<Skill, number> {
  return { speak: 0, listen: 0, read: 0, write: 0 }
}

export function createDefaultProfile(): UserProfile {
  return {
    displayName: '',
    language: 'en',
    level: 'beginner',
    onboardingComplete: false,
    streak: 0,
    lastStudyDate: null,
    totalMinutes: 0,
    skillMinutes: emptySkillMinutes(),
    dailyHistory: [],
    goals: [],
    completedExerciseIds: [],
  }
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultProfile()
    return { ...createDefaultProfile(), ...JSON.parse(raw) }
  } catch {
    return createDefaultProfile()
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export function getTodayProgress(profile: UserProfile): DailyProgress {
  const date = todayKey()
  return (
    profile.dailyHistory.find((d) => d.date === date) ?? {
      date,
      minutesCompleted: 0,
      skillsCompleted: [],
      exerciseIds: [],
    }
  )
}

function yesterdayKey(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export function completeExercise(
  profile: UserProfile,
  exerciseId: string,
  skill: Skill,
  minutes: number,
): UserProfile {
  const today = getTodayProgress(profile)
  if (today.exerciseIds.includes(exerciseId)) return profile

  const minutesCompleted = Math.min(DAILY_MINUTES, today.minutesCompleted + minutes)
  const skillsCompleted = today.skillsCompleted.includes(skill)
    ? today.skillsCompleted
    : [...today.skillsCompleted, skill]

  const updatedToday: DailyProgress = {
    ...today,
    minutesCompleted,
    skillsCompleted,
    exerciseIds: [...today.exerciseIds, exerciseId],
  }

  const history = profile.dailyHistory.filter((d) => d.date !== today.date)
  history.push(updatedToday)

  let streak = profile.streak
  if (profile.lastStudyDate !== today.date) {
    if (profile.lastStudyDate === yesterdayKey() || profile.lastStudyDate === null) {
      streak = profile.lastStudyDate === null ? 1 : profile.streak + 1
    } else {
      streak = 1
    }
  }

  const goals = profile.goals.map((g) => {
    if (g.language !== profile.language) return g
    if (g.skill && g.skill !== skill) return g
    // Count a day once toward goal when first study happens today
    if (profile.lastStudyDate === today.date) return g
    return { ...g, completedDays: Math.min(g.targetDays, g.completedDays + 1) }
  })

  return {
    ...profile,
    streak,
    lastStudyDate: today.date,
    totalMinutes: profile.totalMinutes + minutes,
    skillMinutes: {
      ...profile.skillMinutes,
      [skill]: profile.skillMinutes[skill] + minutes,
    },
    dailyHistory: history,
    goals,
    completedExerciseIds: [...profile.completedExerciseIds, exerciseId],
  }
}

export function completeOnboarding(
  profile: UserProfile,
  data: { displayName: string; language: Language; level: Level },
): UserProfile {
  return {
    ...profile,
    ...data,
    onboardingComplete: true,
    goals:
      profile.goals.length > 0
        ? profile.goals
        : [
            {
              id: crypto.randomUUID(),
              title: `連續 7 天完成每日 ${DAILY_MINUTES} 分鐘`,
              targetDays: 7,
              completedDays: 0,
              language: data.language,
              createdAt: new Date().toISOString(),
            },
          ],
  }
}

export function addGoal(
  profile: UserProfile,
  goal: Omit<LearningGoal, 'id' | 'createdAt' | 'completedDays'>,
): UserProfile {
  const next: LearningGoal = {
    ...goal,
    id: crypto.randomUUID(),
    completedDays: 0,
    createdAt: new Date().toISOString(),
  }
  return { ...profile, goals: [...profile.goals, next] }
}

export function removeGoal(profile: UserProfile, goalId: string): UserProfile {
  return { ...profile, goals: profile.goals.filter((g) => g.id !== goalId) }
}

export function resetProfile(): UserProfile {
  const fresh = createDefaultProfile()
  saveProfile(fresh)
  return fresh
}
