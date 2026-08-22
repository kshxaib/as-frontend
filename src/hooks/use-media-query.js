import { useEffect, useState } from "react"

/**
 * Reactive media-query hook for shell breakpoints
 * (DS §13/§17: desktop ≥1024 full sidebar, tablet 768–1023 rail, mobile drawer).
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [query])

  return matches
}
