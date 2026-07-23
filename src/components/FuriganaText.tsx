import type { ReactNode } from 'react'

type Token =
  | { type: 'text'; value: string }
  | { type: 'ruby'; base: string; reading: string }

/** Parse `漢字[かんじ]` markup into tokens. */
export function parseFurigana(input: string): Token[] {
  const tokens: Token[] = []
  const re = /([\u4e00-\u9fff々〆ヵヶ]+(?:の[\u4e00-\u9fff々〆ヵヶ]+)*)\[([ぁ-んァ-ンヴー]+)\]/g
  let last = 0
  let match: RegExpExecArray | null
  while ((match = re.exec(input)) !== null) {
    if (match.index > last) {
      tokens.push({ type: 'text', value: input.slice(last, match.index) })
    }
    tokens.push({ type: 'ruby', base: match[1], reading: match[2] })
    last = match.index + match[0].length
  }
  if (last < input.length) {
    tokens.push({ type: 'text', value: input.slice(last) })
  }
  return tokens
}

/** Strip furigana markup → plain text */
export function stripFurigana(input: string): string {
  return input.replace(
    /([\u4e00-\u9fff々〆ヵヶ]+(?:の[\u4e00-\u9fff々〆ヵヶ]+)*)\[([ぁ-んァ-ンヴー]+)\]/g,
    '$1',
  )
}

interface FuriganaTextProps {
  text: string
  className?: string
  as?: 'p' | 'span' | 'div' | 'strong'
}

export function FuriganaText({ text, className, as: Tag = 'span' }: FuriganaTextProps) {
  const tokens = parseFurigana(text)
  const nodes: ReactNode[] = tokens.map((token, i) => {
    if (token.type === 'text') return <span key={i}>{token.value}</span>
    return (
      <ruby key={i}>
        {token.base}
        <rt>{token.reading}</rt>
      </ruby>
    )
  })

  return <Tag className={className}>{nodes}</Tag>
}
