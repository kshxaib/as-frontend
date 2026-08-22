import { useReducedMotion } from "@/lib/motion"
import { getAnswerStatus } from "./solutions-meta"
import { cn } from "@/lib/utils"

const STATUS_DOT_CLASS = {
  success: "bg-success",
  destructive: "bg-destructive",
  info: "bg-info",
  neutral: "bg-muted-foreground/60",
}

function statusTone(status) {
  return getAnswerStatus(status).tone
}

/**
 * AnswerIndex — jump navigation over the visible solutions.
 * Horizontal chip strip on mobile, sticky rail on desktop.
 * Dots reflect ONLY real answer statuses (aria-labelled per item).
 */
export function AnswerIndex({ answers }) {
  const reduceMotion = useReducedMotion()

  if (answers.length === 0) return null

  const jump = (answer) => {
    document
      .getElementById(`solutions-answer-${answer.id}`)
      ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" })
  }

  return (
    <nav
      data-slot="answer-index"
      aria-label="Solution index"
      className="flex flex-col lg:sticky lg:top-20 lg:max-h-[calc(100vh-7rem)] lg:w-44 lg:shrink-0 lg:overflow-y-auto lg:pr-1"
    >
      <p className="hidden font-mono text-meta uppercase tracking-wider text-muted-foreground lg:block">
        Solutions · Status
      </p>

      <ol className="mt-0 flex flex-row gap-1.5 overflow-x-auto scrollbar-none lg:mt-1.5 lg:flex-col lg:overflow-visible">
        {answers.map((answer) => {
          const tone = statusTone(answer.status)
          return (
            <li key={answer.id} className="shrink-0">
              <button
                type="button"
                onClick={() => jump(answer)}
                aria-label={`Jump to solution for question ${answer.question_number} — ${getAnswerStatus(answer.status).label}`}
                className={cn(
                  "flex items-center rounded-md border border-border bg-card px-3 py-2 font-mono text-meta tabular-nums text-muted-foreground outline-none transition-colors duration-(--motion-fast) ease-standard",
                  "hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
                  "lg:w-full lg:justify-between lg:border-transparent lg:bg-transparent lg:px-2.5 lg:py-1.5"
                )}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-foreground">
                    {answer.question_number}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn("size-1.5 rounded-full", STATUS_DOT_CLASS[tone])}
                  />
                </span>
                <span aria-hidden="true">{answer.marks}M</span>
              </button>
            </li>
          )
        })}
      </ol>

      <p className="mt-3 hidden border-t border-border pt-3 text-body-sm leading-relaxed text-muted-foreground lg:block">
        Dots show answer status:
        <br />
        <span aria-hidden="true" className="mr-1 inline-block size-1.5 rounded-full bg-success align-middle" />
        solved,
        <span aria-hidden="true" className="mx-1 inline-block size-1.5 rounded-full bg-destructive align-middle" />
        failed,
        <span aria-hidden="true" className="mx-1 inline-block size-1.5 rounded-full bg-muted-foreground/60 align-middle" />
        pending.
      </p>
    </nav>
  )
}
