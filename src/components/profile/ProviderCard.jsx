import { EyeIcon, EyeOffIcon, ExternalLinkIcon, KeyRoundIcon, Loader2Icon, SparklesIcon, Trash2Icon, ZapIcon, CpuIcon, FlameIcon, LayersIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProviderStatus } from "./ProviderStatus"

const PROVIDER_ICONS = {
  sparkles: SparklesIcon,
  zap: ZapIcon,
  cpu: CpuIcon,
  flame: FlameIcon,
  layers: LayersIcon,
}

/**
 * ProviderCard — one AI provider's configuration (§7).
 *
 * Security posture (unchanged from the original page):
 *  - the input is password-style and holds ONLY what the user types
 *    this session; stored keys are never fetched or prefilled
 *  - the eye toggle reveals just the in-progress typing
 *  - the field is cleared after a successful save
 */
export function ProviderCard({
  provider,
  value,
  onValueChange,
  isShowing,
  onToggleShow,
  isProcessing,
  configured,
  onSave,
  onRemoveRequest,
}) {
  const Icon = PROVIDER_ICONS[provider.iconKey]

  return (
    <Card data-slot="provider-card" className="h-full gap-0 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground"
          >
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="text-title-sm leading-snug text-card-foreground">
              {provider.name}
            </h3>
            <p className="mt-1 text-body-sm leading-relaxed text-muted-foreground">
              {provider.description}
            </p>
          </div>
        </div>
        <Badge variant={provider.required ? "outline" : "secondary"} className="shrink-0">
          {provider.tag}
        </Badge>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <ProviderStatus configured={configured} />
        <a
          href={provider.getKeyUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-sm font-medium text-primary outline-none underline-offset-4 hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/30"
        >
          Get free key
          <ExternalLinkIcon aria-hidden="true" className="size-3.5" />
        </a>
      </div>

      {/* Key form — password-style; never prefilled; cleared after save */}
      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <KeyRoundIcon
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type={isShowing ? "text" : "password"}
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
            placeholder={configured ? "••••••••••••••••••••••••" : provider.placeholder}
            disabled={isProcessing}
            autoComplete="off"
            spellCheck={false}
            aria-label={`${provider.name} API key`}
            className="pl-9 pr-10 font-mono"
          />
          <button
            type="button"
            onClick={onToggleShow}
            aria-label={isShowing ? `Hide ${provider.name} key input` : `Show ${provider.name} key input`}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/30 outline-none"
          >
            {isShowing ? (
              <EyeOffIcon aria-hidden="true" className="size-4" />
            ) : (
              <EyeIcon aria-hidden="true" className="size-4" />
            )}
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {configured && (
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Remove ${provider.name} key`}
              title={`Remove ${provider.name} key`}
              onClick={onRemoveRequest}
              disabled={isProcessing}
              className="hover:bg-destructive/10 hover:text-destructive focus-visible:text-destructive"
            >
              {isProcessing ? (
                <Loader2Icon aria-hidden="true" className="animate-spin" />
              ) : (
                <Trash2Icon aria-hidden="true" />
              )}
            </Button>
          )}

          <Button
            size="sm"
            variant={configured ? "outline" : "primary"}
            onClick={onSave}
            disabled={isProcessing || !value.trim()}
          >
            {isProcessing && <Loader2Icon aria-hidden="true" className="animate-spin" />}
            {configured ? "Update Key" : "Save Key"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
