import { useEffect, useState } from 'react'
import type { Language } from '../types'
import { isSpeechSynthesisSupported, speakText, stopSpeaking } from '../lib/speech'

interface AudioPlayButtonProps {
  text: string
  language: Language
  label?: string
  rate?: number
  className?: string
}

export function AudioPlayButton({
  text,
  language,
  label = '播放聲音',
  rate,
  className = '',
}: AudioPlayButtonProps) {
  const [playing, setPlaying] = useState(false)
  const supported = isSpeechSynthesisSupported()

  useEffect(() => {
    return () => stopSpeaking()
  }, [])

  if (!supported) {
    return <p className="hint">此裝置不支援語音播放。</p>
  }

  return (
    <button
      type="button"
      className={`btn audio-btn ${playing ? 'playing' : ''} ${className}`.trim()}
      onClick={() => {
        if (playing) {
          stopSpeaking()
          setPlaying(false)
          return
        }
        setPlaying(true)
        speakText(text, language, {
          rate,
          onEnd: () => setPlaying(false),
        })
      }}
    >
      {playing ? '停止播放' : label}
    </button>
  )
}
