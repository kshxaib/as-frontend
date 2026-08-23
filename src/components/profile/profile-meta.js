/**
 * Non-component metadata for the profile/settings feature.
 * Kept out of JSX files so they stay fast-refresh friendly.
 *
 * Security notes:
 *  - validateKeyFormat is preserved VERBATIM from the original page.
 *  - The backend never returns stored key values — only boolean
 *    has_*_key flags (users/schemas.py UserProfileResponse) — so no
 *    input is ever prefilled and no key is ever rendered.
 */

export const PROVIDERS = [
  {
    id: "gemini",
    name: "Google Gemini",
    tag: "Required",
    required: true,
    description:
      "Free vector embeddings (gemini-embedding-001) that power Qdrant indexing, plus RAG fallback generation.",
    placeholder: "AIzaSy…",
    keyFlag: "has_gemini_key",
    getKeyUrl:
      "https://aistudio.google.com/app/api-keys?project=gen-lang-client-0528736665",
    iconKey: "sparkles",
  },
  {
    id: "groq",
    name: "Groq Cloud",
    tag: "Required",
    required: true,
    description: "Ultra-fast RAG answer generation (Llama 3.3 70B).",
    placeholder: "gsk_…",
    keyFlag: "has_groq_key",
    getKeyUrl: "https://console.groq.com/keys",
    iconKey: "zap",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    tag: "Required",
    required: true,
    description:
      "High-volume question extraction and academic AI reviewer passes via free models.",
    placeholder: "sk-or-v1-…",
    keyFlag: "has_openrouter_key",
    getKeyUrl: "https://openrouter.ai/workspaces/default/keys",
    iconKey: "cpu",
  },
  {
    id: "nvidia",
    name: "NVIDIA NIM",
    tag: "Required",
    required: true,
    description:
      "Heavy academic reviewer and high-grade RAG verification (free tier).",
    placeholder: "nvapi-…",
    keyFlag: "has_nvidia_key",
    getKeyUrl: "https://build.nvidia.com/",
    iconKey: "flame",
  },
  {
    id: "openai",
    name: "OpenAI API",
    tag: "Optional backup",
    required: false,
    description:
      "Optional safety net (gpt-4o-mini). Used only if all four free providers above are exhausted.",
    placeholder: "sk-proj-…",
    keyFlag: "has_openai_key",
    getKeyUrl: "https://platform.openai.com/api-keys",
    iconKey: "layers",
  },
]

export const REQUIRED_PROVIDER_COUNT = 4

/** Preserved VERBATIM from the original page — do not loosen these rules. */
export function validateKeyFormat(provider, key) {
  const clean = key.trim();
  if (provider === 'gemini') {
    if (clean.startsWith('gsk_') || clean.startsWith('nvapi-') || clean.startsWith('sk-or-') || clean.length < 25) {
      return "Invalid Google Gemini API key. Gemini keys usually start with 'AIzaSy' or 'AQ.' and must be at least 25 characters.";
    }
  } else if (provider === 'groq') {
    if (!clean.startsWith('gsk_') || clean.length < 20) {
      return "Invalid Groq API key format. Keys must start with 'gsk_' and be at least 20 characters long.";
    }
  } else if (provider === 'openrouter') {
    if (!clean.startsWith('sk-or-') || clean.length < 20) {
      return "Invalid OpenRouter API key format. Keys must start with 'sk-or-' and be at least 20 characters long.";
    }
  } else if (provider === 'nvidia') {
    if (!clean.startsWith('nvapi-') || clean.length < 20) {
      return "Invalid NVIDIA NIM API key format. Keys must start with 'nvapi-' and be at least 20 characters long.";
    }
  } else if (provider === 'openai') {
    if (!clean.startsWith('sk-') || clean.startsWith('sk-or-') || clean.length < 20) {
      return "Invalid OpenAI API key format. Keys must start with 'sk-' and be at least 20 characters long.";
    }
  }
  return null;
}
