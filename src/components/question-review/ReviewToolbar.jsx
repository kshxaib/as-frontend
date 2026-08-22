import { ChevronDownIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react"

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
import { MARK_FILTER_VALUES, SOURCE_FILTER_OPTIONS } from "./question-review-meta"
import { cn } from "@/lib/utils"

/**
 * ReviewToolbar — search + marks filter pills + marks-source menu.
 * All client-side over the loaded questions; values preserved exactly
 * from the original page (ALL / 2 / 5 / 10 and the three source keys).
 */
export function ReviewToolbar({
  searchQuery,
  onSearchChange,
  selectedMarkFilter,
  onSelectMarkFilter,
  selectedSourceFilter,
  onSelectSourceFilter,
  shownCount,
  totalCount,
}) {
  const sourceLabel =
    SOURCE_FILTER_OPTIONS.find((option) => option.value === selectedSourceFilter)?.label ??
    "All Sources"

  return (
    <div
      data-slot="review-toolbar"
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 xl:flex-row xl:items-center"
    >
      {/* Search — §8 ghost search field */}
      <div className="relative max-w-md flex-1">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search questions by keyword…"
          aria-label="Search questions by keyword"
          className="border-transparent bg-muted/70 pl-9 focus-visible:border-ring focus-visible:bg-card"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Marks pills — segmented toggle group */}
        <div
          role="group"
          aria-label="Filter by marks"
          className="flex items-center gap-1.5"
        >
          <SlidersHorizontalIcon
            aria-hidden="true"
            className="mr-0.5 size-3.5 text-muted-foreground"
          />
          {MARK_FILTER_VALUES.map((filter) => {
            const isSelected = selectedMarkFilter === filter
            return (
              <Button
                key={String(filter)}
                variant={isSelected ? "primary" : "outline"}
                size="xs"
                aria-pressed={isSelected}
                onClick={() => onSelectMarkFilter(filter)}
                className="tabular-nums"
              >
                {filter === "ALL" ? "All" : `${filter}M`}
              </Button>
            )
          })}
        </div>

        <div aria-hidden="true" className="hidden h-4 w-px bg-border sm:block" />

        {/* Marks-source filter — Base UI menu pattern (§20.11) */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="xs" className={cn("max-w-[12rem]")}>
                <span className="truncate">{sourceLabel}</span>
                <ChevronDownIcon aria-hidden="true" className="size-3 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" sideOffset={6}>
            <DropdownMenuLabel>Filter by marks source</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={selectedSourceFilter}
              onValueChange={(value) => onSelectSourceFilter(value)}
            >
              {SOURCE_FILTER_OPTIONS.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <p
          aria-live="polite"
          className="ml-auto font-mono text-meta uppercase tracking-wider tabular-nums text-muted-foreground"
        >
          {shownCount} / {totalCount} shown
        </p>
      </div>
    </div>
  )
}
