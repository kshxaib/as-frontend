import {
  BookOpen,
  FileText,
  Layers,
  FileCheck2,
  Globe,
  KeyRound,
} from "lucide-react"

/**
 * Navigation config — DESIGN_SYSTEM.md §13 "The Stacks".
 * Tab ids mirror useQuestionBankStore.activeTab exactly (no router yet).
 */
export const NAV_GROUPS = [
  {
    id: "library",
    label: "Library",
    items: [
      { id: "resources", label: "Resources", icon: BookOpen },
      { id: "question_banks", label: "Question Banks", icon: FileText },
    ],
  },
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { id: "review", label: "Review", icon: Layers },
      { id: "solutions", label: "Solutions", icon: FileCheck2 },
    ],
  },
  {
    id: "commons",
    label: "Commons",
    items: [{ id: "community", label: "Community Hub", icon: Globe }],
  },
  {
    id: "account",
    label: "Account",
    items: [{ id: "profile", label: "Profile & Keys", icon: KeyRound }],
  },
]

export function getPageTitle(tabId) {
  for (const group of NAV_GROUPS) {
    const item = group.items.find((i) => i.id === tabId)
    if (item) return item.label
  }
  return ""
}

/**
 * Pipeline wayfinding stages (DS §13) — ① Resources → ② Questions
 * → ③ Review → ④ Solutions → ⑤ Export.
 * `tabId` = nav destination; `isReady` is derived from real store data only.
 */
export const PIPELINE_STAGES = [
  { step: 1, label: "Resources", tabId: "resources" },
  { step: 2, label: "Questions", tabId: "question_banks" },
  { step: 3, label: "Review", tabId: "review" },
  { step: 4, label: "Solutions", tabId: "solutions" },
  { step: 5, label: "Export", tabId: "solutions" },
]
