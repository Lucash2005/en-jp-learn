import { useEffect, useRef, useState } from 'react'
import type { Language } from '../types'
import {
  getSpeechRecognitionCtor,
  isSpeechRecognitionSupported,
  pronunciationScore,
  scoreLabel,
  speakText,
  stopSpeaking,
} from '../lib/speech'
import { AudioPlayButton } from './AudioPlayButton'

interface PronunciationPracticeProps {
  targetText: string
  language: Language
  onCompared?: (score: number) => void
}

export function PronunciationPractice({
  targetText,
  language,
  onCompared,
}: PronunciationPracticeProps) {
  const [listening, setListening] = useState(false)
  const [heard, setHeard] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const supported = isSpeechRecognitionSupported()

  useEffect(() => {
    setHeard('')
    setScore(null)
    setError(null)
    setListening(false)
    recognitionRef.current?.abort()
    stopSpeaking()
  }, [targetText])

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()
      stopSpeaking()
    }
  }, [])

  const startListening = () => {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) {
      setError('此瀏覽器不支援語音辨識。可先聽範讀，再自行跟讀。')
      return
    }

    setError(null)
    setHeard('')
    setScore(null)
    stopSpeaking()

    const recognition = new Ctor()
    recognition.lang = language === 'jp' ? 'ja-JP' : 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false

    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? ''
      setHeard(transcript)
      const nextScore = pronunciationScore(targetText, transcript, language)
      setScore(nextScore)
      onCompared?.(nextScore)
    }

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        setError('需要麥克風權限才能比對發音。')
      } else if (event.error === 'no-speech') {
        setError('沒有偵測到聲音，請靠近麥克風再試。')
      } else {
        setError('辨識失敗，請再試一次。')
      }
      setListening(false)
    }

    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    try {
      recognition.start()
      setListening(true)
    } catch {
      setError('無法啟動錄音，請稍後再試。')
      setListening(false)
    }
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  return (
    <div className="pronunciation">
      <div className="pronunciation-actions">
        <AudioPlayButton text={targetText} language={language} label="聽範讀" rate={0.9} />
        {supported ? (
          <button
            type="button"
            className={`btn primary ${listening ? 'recording' : ''}`}
            onClick={listening ? stopListening : startListening}
          >
            {listening ? '停止辨識' : '開始跟讀比對'}
          </button>
        ) : (
          <button
            type="button"
            className="btn ghost"
            onClick={() => speakText(targetText, language, { rate: 0.85 })}
          >
            再聽一次慢速
          </button>
        )}
      </div>

      {!supported && (
        <p className="hint">
          目前瀏覽器不支援即時發音比對（部分 iPhone Safari 會如此）。請聽範讀後跟讀，完成後點下方按鈕繼續。
        </p>
      )}

      {listening && <p className="listen-pulse">正在聽你說…</p>}
      {error && <p className="hint warn">{error}</p>}

      {score !== null && (
        <div className="score-card">
          <div className="score-ring" style={{ ['--p' as string]: `${score}%` }}>
            <strong>{score}</strong>
            <span>分</span>
          </div>
          <div>
            <p className="score-label">{scoreLabel(score)}</p>
            {heard && (
              <p className="heard">
                辨識結果：<strong>{heard}</strong>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
