import { useState } from "react"
import { DownloadIcon, GlobeIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { buildSolvedPdfFilename } from "./pdf-export-meta"

/**
 * PdfExportActions — the export cluster for a solved answer set.
 *
 * Honest states only (§3/§20): the backend generates the PDF
 * synchronously as part of the download request, so the only real
 * states are idle → preparing → done/failure (failures surface through
 * the global error banner). No progress percentages exist; none shown.
 *
 * Behavior preserved exactly: same store call, same filename template,
 * same share toggle labels/visibility semantics.
 */
export function PdfExportActions({
  answerSetId,
  questionBankName,
  subject,
  isShared = false,
  onDownload,
  onToggleShare,
}) {
  const [isPreparing, setIsPreparing] = useState(false)

  if (!answerSetId) return null

  const handleDownload = async () => {
    setIsPreparing(true)
    try {
      await onDownload(buildSolvedPdfFilename(subject, questionBankName))
    } finally {
      setIsPreparing(false)
    }
  }

  return (
    <>
      <Button variant="gold" onClick={handleDownload} disabled={isPreparing}>
        {isPreparing ? (
          <>
            <Loader2Icon aria-hidden="true" className="animate-spin" />
            Preparing…
          </>
        ) : (
          <>
            <DownloadIcon aria-hidden="true" />
            Download Solved PDF
          </>
        )}
      </Button>

      <Button
        variant={isShared ? "gold" : "outline"}
        onClick={onToggleShare}
        disabled={isPreparing}
      >
        <GlobeIcon aria-hidden="true" />
        {isShared ? "Shared in Community" : "Share with Community"}
      </Button>
    </>
  )
}
