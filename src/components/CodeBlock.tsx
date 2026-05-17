interface CodeBlockProps {
  code: string
  label?: string
}

function CodeBlock({ code, label = 'Code snippet' }: CodeBlockProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-950/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.03),0_0_0_1px_rgba(34,211,238,0.04)]">
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200/85">
        <span>{label}</span>
        <span>Python / ML</span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-6 text-slate-50 sm:px-5 sm:text-sm">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  )
}

export default CodeBlock
