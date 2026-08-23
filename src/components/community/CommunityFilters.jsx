import { ArrowUpDownIcon, BookOpenIcon, ChevronDownIcon, FileCheck2Icon, SearchIcon, SlidersHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { COMMUNITY_SORT_OPTIONS } from "./community-meta"

const TABS = [
  {
    id: "resources",
    label: "Public Notes & Textbooks",
    icon: BookOpenIcon,
  },
  {
    id: "solved_sets",
    label: "Solved Question Banks",
    icon: FileCheck2Icon,
  },
]

function FilterTrigger({ icon: Icon, label }) {
  return (
    <DropdownMenuTrigger
      render={
        <Button variant="outline" size="default" className="max-w-[14rem]">
          <Icon aria-hidden="true" className="text-muted-foreground" />
          <span className="truncate">{label}</span>
          <ChevronDownIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
        </Button>
      }
    />
  )
}

/**
 * CommunityFilters — collection tabs + search + subject filter + sort.
 * All client-side over the loaded feeds (the community endpoints are
 * unfiltered); values and semantics preserved from the original page.
 */
export function CommunityFilters({
  activeSubTab,
  onSelectSubTab,
  resourcesCount,
  solvedSetsCount,
  searchQuery,
  onSearchChange,
  subjects,
  selectedSubject,
  onSelectSubject,
  sortId,
  onSelectSort,
  shownCount,
  totalCount,
}) {
  const activeSort =
    COMMUNITY_SORT_OPTIONS.find((option) => option.id === sortId) ??
    COMMUNITY_SORT_OPTIONS[0]

  const subjectLabel = selectedSubject === "ALL" ? "All Subjects" : selectedSubject

  return (
    <div data-slot="community-filters" className="flex flex-col gap-3">
      {/* Collection toggle — aria-pressed group (single swapped panel) */}
      <div
        role="group"
        aria-label="Community collection"
        className="flex flex-wrap items-center gap-2"
      >
        {TABS.map((tab) => {
          const isSelected = activeSubTab === tab.id
          const count = tab.id === "resources" ? resourcesCount : solvedSetsCount
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={isSelected ? "primary" : "outline"}
              aria-pressed={isSelected}
              onClick={() => onSelectSubTab(tab.id)}
            >
              <Icon aria-hidden="true" className={isSelected ? undefined : "text-muted-foreground"} />
              {tab.label}
              <span className="rounded-full bg-background/15 px-1.5 py-px font-mono text-meta tabular-nums text-current opacity-80">
                {count}
              </span>
            </Button>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search — §8 ghost field, archive-flavoured placeholder */}
        <div className="relative max-w-md flex-1 lg:min-w-72">
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search the commons by title, subject, or chapter…"
            aria-label="Search community resources"
            className="border-transparent bg-muted/70 pl-9 focus-visible:border-ring focus-visible:bg-card"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {subjects.length > 0 && (
            <DropdownMenu>
              <FilterTrigger icon={SlidersHorizontalIcon} label={subjectLabel} />
              <DropdownMenuContent align="start" sideOffset={6} className="min-w-[13rem]">
                <DropdownMenuLabel>Filter by subject</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={selectedSubject}
                  onValueChange={(value) => onSelectSubject(value)}
                >
                  <DropdownMenuRadioItem value="ALL">All Subjects</DropdownMenuRadioItem>
                  {subjects.map((subject) => (
                    <DropdownMenuRadioItem key={subject} value={subject}>
                      <span className="truncate">{subject}</span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <DropdownMenu>
            <FilterTrigger icon={ArrowUpDownIcon} label={`Sort: ${activeSort.label}`} />
            <DropdownMenuContent align="end" sideOffset={6}>
              <DropdownMenuRadioGroup
                value={sortId}
                onValueChange={(value) => onSelectSort(value)}
              >
                {COMMUNITY_SORT_OPTIONS.map((option) => (
                  <DropdownMenuRadioItem key={option.id} value={option.id}>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <p
            aria-live="polite"
            className="ml-auto font-mono text-meta uppercase tracking-wider tabular-nums text-muted-foreground lg:ml-2"
          >
            {shownCount} / {totalCount} shown
          </p>
        </div>
      </div>
    </div>
  )
}
