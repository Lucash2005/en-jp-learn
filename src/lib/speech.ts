import type { Language } from '../types'

const LANG_CODE: Record<Language, string> = {
  en: 'en-US',
  jp: 'ja-JP',
}

export function getSpeakableText(raw: string): string {
  return raw
    .replace(/^[「『"']+|[」』"']+$/g, '')
    .replace(/[「」『』]/g, '')
    .trim()
}

export function stopSpeaking(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
}

export function speakText(
  text: string,
  language: Language,
  options?: { rate?: number; onEnd?: () => void },
): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    options?.onEnd?.()
    return
  }

  stopSpeaking()
  const utter = new SpeechSynthesisUtterance(getSpeakableText(text))
  utter.lang = LANG_CODE[language]
  utter.rate = options?.rate ?? 0.92

  const voices = window.speechSynthesis.getVoices()
  const preferred = voices.find(
    (v) => v.lang === LANG_CODE[language] || v.lang.startsWith(language === 'jp' ? 'ja' : 'en'),
  )
  if (preferred) utter.voice = preferred

  utter.onend = () => options?.onEnd?.()
  utter.onerror = () => options?.onEnd?.()
  window.speechSynthesis.speak(utter)
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

type RecognitionCtor = new () => SpeechRecognition

export function getSpeechRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as Window &
    typeof globalThis & {
      webkitSpeechRecognition?: RecognitionCtor
      SpeechRecognition?: RecognitionCtor
    }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionCtor() !== null
}

/** Normalize for fuzzy pronunciation compare */
export function normalizeForCompare(text: string, language: Language): string {
  let t = getSpeakableText(text).toLowerCase()
  if (language === 'en') {
    t = t.replace(/[^a-z0-9\s']/g, ' ').replace(/\s+/g, ' ').trim()
  } else {
    t = t.replace(/[、。！？!?,.〜～\s]/g, '')
  }
  return t
}

function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[m][n]
}

/** Returns 0–100 similarity score */
export function pronunciationScore(
  expected: string,
  heard: string,
  language: Language,
): number {
  const a = normalizeForCompare(expected, language)
  const b = normalizeForCompare(heard, language)
  if (!a || !b) return 0
  if (a === b) return 100
  const dist = levenshtein(a, b)
  const maxLen = Math.max(a.length, b.length)
  return Math.max(0, Math.round((1 - dist / maxLen) * 100))
}

export function scoreLabel(score: number): string {
  if (score >= 90) return '非常接近'
  if (score >= 75) return '不錯，再練一次會更穩'
  if (score >= 55) return '大致聽得懂，注意幾個音'
  return '再跟讀一次，放慢速度'
}
