import { useReducedMotion } from "@/lib/motion"
import { getMarksSourceConfig } from "./question-review-meta"
import { cn } from "@/lib/utils"

const SOURCE_DOT_CLASS = {
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
}

/**
 * QuestionIndex — jump navigation over the VISIBLE question list.
 * Horizontal chip strip on mobile; sticky rail on desktop.
 * Items show only real data: folio number, marks, and a marks-source
 * dot (legend provided; this is NOT an invented review status).
 */
export function QuestionIndex({ questions, onJump }) {
  const reduceMotion = useReducedMotion()

  if (questions.length === 0) return null

  const jump = (question) => {
    const target = document.getElementById(`review-question-${question.id}`)
    target?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    })
    onJump?.(question)
  }

  return (
    <nav
      data-slot="question-index"
      aria-label="Question index"
      className="flex flex-col lg:sticky lg:top-20 lg:max-h-[calc(100vh-7rem)] lg:w-44 lg:shrink-0 lg:overflow-y-auto lg:pr-1"
    >
      <p className="hidden font-mono text-meta uppercase tracking-wider text-muted-foreground lg:block">
        Index · Marks Source
      </p>

      <ol className="mt-0 flex flex-row gap-1.5 overflow-x-auto scrollbar-none lg:mt-1.5 lg:flex-col lg:overflow-visible">
        {questions.map((question) => {
          const config = getMarksSourceConfig(question.marks_source)
          return (
            <li key={question.id} className="shrink-0">
              <button
                type="button"
                onClick={() => jump(question)}
                aria-label={`Jump to question ${question.question_number} — ${config.label}, ${question.marks} marks`}
                className={cn(
                  "group/index flex items-center rounded-md border border-border bg-card px-3 py-2 font-mono text-meta tabular-nums text-muted-foreground outline-none transition-colors duration-(--motion-fast) ease-standard",
                  "hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30",
                  "lg:w-full lg:justify-between lg:border-transparent lg:bg-transparent lg:px-2.5 lg:py-1.5"
                )}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-foreground">
                    {question.question_number}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-1.5 rounded-full",
                      SOURCE_DOT_CLASS[config.tone]
                    )}
                  />
                </span>
                <span aria-hidden="true">{question.marks}M</span>
              </button>
            </li>
          )
        })}
      </ol>

      {/* Legend — explains the dots without inventing review states */}
      <p className="mt-3 hidden border-t border-border pt-3 text-body-sm leading-relaxed text-muted-foreground lg:block">
        Dots show the marks source:
        <br />
        <span
          aria-hidden="true"
          className="mr-1 inline-block size-1.5 rounded-full bg-success align-middle"
        />
        explicit / verified,
        <span
          aria-hidden="true"
          className="mx-1 inline-block size-1.5 rounded-full bg-warning align-middle"
        />
        AI estimated.
      </p>
    </nav>
  )
}
