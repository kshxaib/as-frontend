/**
 * PDF export metadata — single source for the download filename.
 * Template preserved EXACTLY from the original Solutions page
 * (consumers/tests may depend on it).
 */
export function buildSolvedPdfFilename(subject, questionBankName) {
  return `AcademicStack_${(subject || "Subject").replace(/\s+/g, "_")}_${(
    questionBankName || "QB"
  ).replace(/\s+/g, "_")}_Solved.pdf`
}
