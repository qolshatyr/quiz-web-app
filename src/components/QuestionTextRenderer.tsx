import { Fragment } from 'react'
import type { ReactNode } from 'react'
import {
  detectCodeSegments,
  normalizeCodeSpacing,
  splitTextForInlineCode,
} from '../utils/textFormatting'
import CodeBlock from './CodeBlock'
import InlineCode from './InlineCode'

interface QuestionTextRendererProps {
  text: string
  allowBlocks?: boolean
  className?: string
  paragraphClassName?: string
  codeLabel?: string
}

function renderInlineContent(text: string): ReactNode[] {
  const parts = splitTextForInlineCode(text).filter((part) => part !== undefined && part !== '')

  return parts.map((part, index) => {
    const sanitized = part.startsWith('`') && part.endsWith('`') ? part.slice(1, -1) : part
    const isInlineCode =
      part.startsWith('`') ||
      /(?:[A-Za-z_][\w]*\([^)\n]{0,60}\)|[A-Za-z_]+(?:_[A-Za-z0-9]+)+|[A-Za-z_]+\.[A-Za-z_][\w]*|(?:cv|alpha|C|n_neighbors|test_size)\s*=)/u.test(
        part,
      )

    if (!isInlineCode) {
      return <Fragment key={`${part}-${index}`}>{part}</Fragment>
    }

    return <InlineCode key={`${sanitized}-${index}`}>{sanitized}</InlineCode>
  })
}

function renderTextBlock(text: string, paragraphClassName: string) {
  return text.split(/\n{2,}/u).map((paragraph, paragraphIndex) => {
    const lines = paragraph.split('\n')

    return (
      <p key={`${paragraph}-${paragraphIndex}`} className={paragraphClassName}>
        {lines.map((line, lineIndex) => (
          <Fragment key={`${line}-${lineIndex}`}>
            {lineIndex > 0 ? <br /> : null}
            {renderInlineContent(line)}
          </Fragment>
        ))}
      </p>
    )
  })
}

function QuestionTextRenderer({
  text,
  allowBlocks = true,
  className = '',
  paragraphClassName = 'text-sm leading-7 text-slate-100 sm:text-base',
  codeLabel,
}: QuestionTextRendererProps) {
  const segments = detectCodeSegments(text)

  return (
    <div className={`space-y-4 ${className}`.trim()}>
      {segments.map((segment, index) => {
        if (segment.type === 'code' && allowBlocks) {
          return (
            <CodeBlock
              key={`${segment.content}-${index}`}
              code={normalizeCodeSpacing(segment.content)}
              label={codeLabel}
            />
          )
        }

        return (
          <div key={`${segment.content}-${index}`} className="space-y-3">
            {renderTextBlock(segment.content, paragraphClassName)}
          </div>
        )
      })}
    </div>
  )
}

export default QuestionTextRenderer
