import { useState } from "react"

import { useAuthStore } from "@/store/useAuthStore"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

/**
 * AuthModal — Phase 10 rebuild on the shared Dialog primitive.
 *
 * Contract preserved exactly: register sends (username, password, name),
 * login sends (username, password); backend error strings pass through
 * untouched; mode switching clears the error; submit is disabled only
 * during the real request. No OAuth / password reset / email flows are
 * invented — the backend has none.
 */
export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    isLoading,
    error,
    closeAuthModal,
    setAuthModalMode,
    login,
    register,
    clearError,
  } = useAuthStore()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (authModalMode === "login") {
      await login(username, password)
    } else {
      await register(username, password, name)
    }
  }

  const switchMode = (mode) => {
    clearError()
    setAuthModalMode(mode)
  }

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="sm:max-w-md" aria-describedby="auth-description">
        <DialogHeader>
          <DialogTitle className="font-serif text-title-lg">
            {authModalMode === "login" ? "Welcome back" : "Create your workspace"}
          </DialogTitle>
          <DialogDescription id="auth-description">
            {authModalMode === "login"
              ? "Continue to your Reading Room."
              : "Register to organize resources, solve papers, and tune AI answers."}
          </DialogDescription>
        </DialogHeader>

        {/* Mode switcher */}
        <div
          role="group"
          aria-label="Authentication mode"
          className="flex rounded-md border border-border bg-muted/50 p-1"
        >
          {[
            { id: "login", label: "Sign In" },
            { id: "register", label: "Register" },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              aria-pressed={authModalMode === mode.id}
              onClick={() => switchMode(mode.id)}
              className={cn(
                "flex-1 rounded-sm py-1.5 text-body-sm font-medium outline-none transition-colors duration-(--motion-fast) ease-standard focus-visible:ring-[3px] focus-visible:ring-ring/30",
                authModalMode === mode.id
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Backend error passthrough */}
        {error && (
          <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-body-sm leading-relaxed text-destructive"
          >
            {error}
          </p>
        )}

        {/* Fields preserved exactly: name (register) · username · password */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {authModalMode === "register" && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-name" className="text-body-sm font-medium text-foreground">
                Full Name
              </label>
              <Input
                id="auth-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Alex Johnson"
                autoComplete="name"
                aria-invalid={!name.trim()}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-username" className="text-body-sm font-medium text-foreground">
              Username
            </label>
            <Input
              id="auth-username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., student42"
              autoComplete="username"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="auth-password" className="text-body-sm font-medium text-foreground">
              Password
            </label>
            <Input
              id="auth-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={authModalMode === "login" ? "current-password" : "new-password"}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="mt-1 w-full" size="lg">
            {isLoading
              ? "Authenticating…"
              : authModalMode === "login"
                ? "Sign in to AcademicStack"
                : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-body-sm text-muted-foreground">
          {authModalMode === "login" ? "Don't have an account? " : "Already registered? "}
          <button
            type="button"
            onClick={() => switchMode(authModalMode === "login" ? "register" : "login")}
            className="rounded-sm font-medium text-primary outline-none underline-offset-4 hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/30"
          >
            {authModalMode === "login" ? "Create one now" : "Sign in here"}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  )
}
