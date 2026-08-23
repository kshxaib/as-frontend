import { CalendarIcon, DownloadIcon, UserIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { formatSharedDate } from "./community-meta"

/**
 * CommunitySolvedSetCard — a shared solved question bank.
 * Real fields only: solved/total counts are actual backend figures.
 * The payload has NO status field, so the old fabricated
 * "AI Verified" badge is intentionally gone.
 */
export function CommunitySolvedSetCard({ answerSet, onDownload }) {
  const {
    question_bank_name,
    subject,
    author_name,
    total_questions,
    completed_questions,
    created_at,
  } = answerSet

  const addedLabel = formatSharedDate(created_at)

  return (
    <Card
      data-slot="community-solved-set-card"
      className="h-full gap-0 p-5 transition-[box-shadow,translate,border-color] duration-(--motion-fast) ease-standard hover:-translate-y-0.5 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <Badge variant="secondary" className="max-w-[55%] truncate">
          {subject}
        </Badge>
        <Badge variant="gold">
          Solved paper
        </Badge>
      </div>

      <h3 className="mt-3 line-clamp-2 font-serif text-title-sm text-card-foreground">
        {question_bank_name}
      </h3>

      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-meta uppercase tracking-wider text-muted-foreground">
        <span className="tabular-nums">
          {completed_questions} / {total_questions} solved
        </span>
        {addedLabel && (
          <span className="inline-flex items-center gap-1 normal-case tracking-normal">
            <CalendarIcon aria-hidden="true" className="size-3" />
            {addedLabel}
          </span>
        )}
      </p>

      <div className="mt-4 flex min-h-[22px] items-center gap-1.5 text-body-sm text-muted-foreground">
        <UserIcon aria-hidden="true" className="size-3.5 shrink-0" />
        <span className="truncate">Shared by {author_name}</span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-body-sm font-medium text-muted-foreground">With citations</span>
        <Button
          variant="gold"
          size="sm"
          onClick={() => onDownload(answerSet.id, answerSet)}
        >
          <DownloadIcon aria-hidden="true" />
          Download Solved PDF
        </Button>
      </div>
    </Card>
  )
}
