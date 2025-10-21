import type React from "react"

interface StepItem {
  id ?: string
  stepNumber: number
  title: string
  details: string
  projectId?: string
}

interface TimelineProps {
  data?: StepItem[]
  className?: string
}

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`rounded-2xl bg-white p-12 text-sm leading-7 text-gray-700 shadow-lg shadow-black/5 dark:bg-gray-950 dark:text-gray-300 dark:shadow-white/5 ${className}`}
  >
    {children}
  </div>
)

const StepBadge = ({ number }: { number: number }) => (
  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-white text-xs font-bold shadow-md">
    {number}
  </span>
)

export default function TimelinePage3({ data = [], className = "" }: TimelineProps) {
  // Sort by stepNumber to ensure correct order
  const sortedData = [...data].sort((a, b) => a.stepNumber - b.stepNumber)

  return (
    <div
      className={`relative grid min-h-screen grid-cols-[1fr_2.5rem_auto_2.5rem_1fr] grid-rows-[1fr_1px_auto_1px_1fr] ${className}`}
    >
      <div className="col-start-3 row-start-3 flex max-w-2xl flex-col p-2">
        <Card>
          <h1 className="text-3xl font-bold text-gray-950 dark:text-white mb-12 tracking-tight">
            Implementation Steps
          </h1>

          <div className="space-y-10">
            {sortedData.map((step, index) => (
              <div key={step.id} className="relative group transition-all duration-300 hover:translate-x-1">
                {index !== sortedData.length - 1 && (
                  <div className="absolute left-3 top-8 h-full w-0.5 bg-gradient-to-b from-sky-400 via-sky-300 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                <div className="flex gap-6">
                  <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center mt-1">
                    <StepBadge number={step.stepNumber} />
                  </div>

                  <div className="flex-1 space-y-3 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg text-gray-950 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors duration-300">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:bg-gray-50 dark:group-hover:bg-gray-800/30 rounded-lg p-3 -m-3 transition-all duration-300">
                      {step.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Pattern borders */}
      <div className="relative -right-px col-start-2 row-span-full row-start-1 border-x border-x-[var(--pattern-fg)] bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"></div>
      <div className="relative -left-px col-start-4 row-span-full row-start-1 border-x border-x-[var(--pattern-fg)] bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px] bg-fixed"></div>
      <div className="relative -bottom-px col-span-full col-start-1 row-start-2 h-px bg-[var(--pattern-fg)]"></div>
      <div className="relative -top-px col-span-full col-start-1 row-start-4 h-px bg-[var(--pattern-fg)]"></div>
    </div>
  )
}
