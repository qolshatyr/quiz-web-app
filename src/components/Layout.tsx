import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface LayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  eyebrow?: string
  actions?: ReactNode
}

function Layout({ title, subtitle, children, eyebrow, actions }: LayoutProps) {
  return (
    <div className="app-shell min-h-screen px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <header className="surface-card rounded-[2rem] p-5 sm:p-6 lg:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <Link
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-slate-950/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200 transition hover:border-cyan-300 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                to="/"
              >
                Exam Prep Hub
              </Link>
              {eyebrow ? (
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-violet-300/80">
                  {eyebrow}
                </p>
              ) : null}
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.8rem]">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">{subtitle}</p>
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        </header>

        <main className="space-y-6">{children}</main>
      </div>
    </div>
  )
}

export default Layout
