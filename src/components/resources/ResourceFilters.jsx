import { ArrowUpDownIcon, ChevronDownIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react"

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
import { RESOURCE_SORT_OPTIONS } from "./resource-meta"
import { cn } from "@/lib/utils"

function FilterTrigger({ icon: Icon, label, className }) {
  return (
    <DropdownMenuTrigger
      render={
        <Button variant="outline" size="default" className={cn("max-w-[16rem]", className)}>
          <Icon aria-hidden="true" className="text-muted-foreground" />
          <span className="truncate">{label}</span>
          <ChevronDownIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
        </Button>
      }
    />
  )
}

/**
 * ResourceFilters — search + subject filter + sort.
 * All options operate client-side on the already-loaded collection;
 * every control is real (no decorative controls).
 */
export function ResourceFilters({
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
    RESOURCE_SORT_OPTIONS.find((option) => option.id === sortId) ??
    RESOURCE_SORT_OPTIONS[0]

  const subjectLabel =
    selectedSubject === "ALL" ? "All Subjects" : selectedSubject

  return (
    <div
      data-slot="resource-filters"
      className="flex flex-col gap-3 lg:flex-row lg:items-center"
    >
      {/* Search — §8 ghost search field */}
      <div className="relative max-w-md flex-1 lg:min-w-72">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by title, subject, or chapter…"
          aria-label="Search resources by title, subject, or chapter"
          className="border-transparent bg-muted/70 pl-9 focus-visible:border-ring focus-visible:bg-card"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {subjects.length > 0 && (
          <DropdownMenu>
            <FilterTrigger icon={SlidersHorizontalIcon} label={subjectLabel} />
            <DropdownMenuContent align="start" sideOffset={6} className="min-w-[13rem]">
              <DropdownMenuRadioGroup
                value={selectedSubject}
                onValueChange={(value) => onSelectSubject(value)}
              >
                <DropdownMenuLabel>Filter by subject</DropdownMenuLabel>
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
              {RESOURCE_SORT_OPTIONS.map((option) => (
                <DropdownMenuRadioItem key={option.id} value={option.id}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <p
          data-slot="resource-count"
          aria-live="polite"
          className="ml-auto font-mono text-meta uppercase tracking-wider text-muted-foreground lg:ml-2"
        >
          {shownCount} / {totalCount} docs
        </p>
      </div>
    </div>
  )
}
