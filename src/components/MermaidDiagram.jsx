import React, { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';
import { Copy, Check, Code2, Image } from 'lucide-react';

// Initialize mermaid once with our dark academic theme
let mermaidInitialized = false;
function ensureMermaidInit() {
  if (mermaidInitialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
      darkMode: true,
      background: '#0f1117',
      primaryColor: '#1e293b',
      primaryBorderColor: '#334155',
      primaryTextColor: '#e2e8f0',
      secondaryColor: '#1a1f2e',
      secondaryBorderColor: '#475569',
      secondaryTextColor: '#cbd5e1',
      tertiaryColor: '#0d1117',
      tertiaryBorderColor: '#334155',
      tertiaryTextColor: '#94a3b8',
      lineColor: '#64748b',
      textColor: '#e2e8f0',
      mainBkg: '#1e293b',
      nodeBorder: '#475569',
      clusterBkg: '#1a1f2e',
      clusterBorder: '#334155',
      titleColor: '#e2e8f0',
      edgeLabelBackground: '#1e293b',
      nodeTextColor: '#e2e8f0',
      actorTextColor: '#e2e8f0',
      actorLineColor: '#475569',
      signalColor: '#e2e8f0',
      signalTextColor: '#e2e8f0',
      labelBoxBkgColor: '#1e293b',
      labelBoxBorderColor: '#475569',
      labelTextColor: '#e2e8f0',
      noteBkgColor: '#1a1f2e',
      noteTextColor: '#cbd5e1',
      noteBorderColor: '#334155',
      fontFamily: "'JetBrains Mono', 'Geist', monospace",
      fontSize: '13px',
    },
    flowchart: { curve: 'basis', padding: 12 },
    sequence: { mirrorActors: false },
    er: { useMaxWidth: true },
  });
  mermaidInitialized = true;
}

// Running counter to ensure unique IDs across renders
let diagramCounter = 0;

export function MermaidDiagram({ chart }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');
  const [renderError, setRenderError] = useState(null);
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);
  const idRef = useRef(`mermaid-diagram-${++diagramCounter}`);

  const code = typeof chart === 'string' ? chart.trim() : String(chart).trim();

  useEffect(() => {
    if (!code) return;
    let cancelled = false;

    ensureMermaidInit();

    (async () => {
      try {
        const { svg } = await mermaid.render(idRef.current, code);
        if (!cancelled) {
          setSvgContent(svg);
          setRenderError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setRenderError(err?.message || 'Failed to render Mermaid diagram.');
          setSvgContent('');
        }
      }
    })();

    return () => { cancelled = true; };
  }, [code]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  }, [code]);

  // If rendering failed, show the code block with a subtle warning badge
  if (renderError) {
    return (
      <div className="mermaid-diagram-wrapper mermaid-error">
        <div className="mermaid-toolbar">
          <span className="mermaid-badge mermaid-badge--error">⚠ Diagram syntax issue</span>
          <button onClick={handleCopy} className="mermaid-btn" title="Copy code">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <pre className="mermaid-code-fallback"><code>{code}</code></pre>
      </div>
    );
  }

  return (
    <div className="mermaid-diagram-wrapper">
      {/* Toolbar */}
      <div className="mermaid-toolbar">
        <span className="mermaid-badge">📐 Diagram</span>
        <div className="mermaid-toolbar-actions">
          <button
            onClick={() => setShowRaw(prev => !prev)}
            className="mermaid-btn"
            title={showRaw ? 'View rendered diagram' : 'View raw code'}
          >
            {showRaw ? <Image className="h-3.5 w-3.5" /> : <Code2 className="h-3.5 w-3.5" />}
            <span>{showRaw ? 'Diagram' : 'Code'}</span>
          </button>
          <button onClick={handleCopy} className="mermaid-btn" title="Copy Mermaid code">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {showRaw ? (
        <pre className="mermaid-code-fallback"><code>{code}</code></pre>
      ) : (
        <div
          ref={containerRef}
          className="mermaid-svg-container"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}
    </div>
  );
}
