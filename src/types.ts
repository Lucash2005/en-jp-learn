export type Language = 'en' | 'jp'
export type Level = 'beginner' | 'intermediate' | 'advanced'
export type Skill = 'speak' | 'listen' | 'read' | 'write'
export type View = 'onboarding' | 'home' | 'practice' | 'goals' | 'progress'

export const DAILY_MINUTES = 20
export const SKILL_MINUTES = 5

export const LEVEL_LABELS: Record<Level, string> = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '高級',
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: '英語',
  jp: '日語',
}

export const SKILL_LABELS: Record<Skill, string> = {
  speak: '說',
  listen: '聽',
  read: '讀',
  write: '寫',
}

export const SKILL_DESCRIPTIONS: Record<Skill, string> = {
  speak: '跟讀與口語表達',
  listen: '聽力理解與辨識',
  read: '閱讀理解與詞彙',
  write: '造句與書寫練習',
}

export interface Exercise {
  id: string
  skill: Skill
  language: Language
  level: Level
  prompt: string
  /** Primary sentence / passage / model answer shown in UI */
  content: string
  /** Japanese content with furigana markup, e.g. 海[うみ] */
  ruby?: string
  /** Clean text used for TTS / pronunciation target */
  audioText?: string
  /** Chinese explanation of the sentence/passage */
  translation?: string
  /** Grammar / usage note (may include 漢字[かんじ] markup) */
  grammar?: string
  /** Quote source, e.g. movie or anime title */
  source?: string
  hint?: string
  options?: string[]
  answer?: string
}

export interface DailyProgress {
  date: string
  minutesCompleted: number
  skillsCompleted: Skill[]
  exerciseIds: string[]
}

export interface LearningGoal {
  id: string
  title: string
  targetDays: number
  completedDays: number
  language: Language
  skill?: Skill
  createdAt: string
}

export interface UserProfile {
  displayName: string
  language: Language
  level: Level
  onboardingComplete: boolean
  streak: number
  lastStudyDate: string | null
  totalMinutes: number
  skillMinutes: Record<Skill, number>
  dailyHistory: DailyProgress[]
  goals: LearningGoal[]
  completedExerciseIds: string[]
}
