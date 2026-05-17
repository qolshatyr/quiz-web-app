import type { ReactNode } from 'react'

interface InlineCodeProps {
  children: ReactNode
}

function InlineCode({ children }: InlineCodeProps) {
  return (
    <code className="rounded-md border border-cyan-400/25 bg-slate-950/90 px-1.5 py-0.5 font-mono text-[0.92em] text-cyan-100">
      {children}
    </code>
  )
}

export default InlineCode
