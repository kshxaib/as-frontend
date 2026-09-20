import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

let mermaidInitialized = false;
let idCounter = 0;
const svgCache = new Map();

function ensureMermaidInit() {
  if (mermaidInitialized) return;
  try {
    mermaid.initialize({
      startOnLoad: false,
      suppressErrorRendering: true,
      securityLevel: 'loose',
      theme: 'base',
      themeVariables: {
        darkMode: false,
        background: '#FFFFFF',
        primaryColor: '#EAF0FF',
        primaryBorderColor: '#0057FF',
        primaryTextColor: '#19243B',
        secondaryColor: '#F1F0EC',
        secondaryBorderColor: '#C6CAD3',
        secondaryTextColor: '#526078',
        tertiaryColor: '#FFFFFF',
        tertiaryBorderColor: '#E2E0D9',
        tertiaryTextColor: '#687184',
        lineColor: '#526078',
        textColor: '#19243B',
        mainBkg: '#EAF0FF',
        nodeBorder: '#0057FF',
        clusterBkg: '#F8F7F4',
        clusterBorder: '#E2E0D9',
        titleColor: '#19243B',
        edgeLabelBackground: '#FFFFFF',
        nodeTextColor: '#19243B',
        actorTextColor: '#19243B',
        actorLineColor: '#526078',
        actorBkg: '#EAF0FF',
        actorBorder: '#0057FF',
        signalColor: '#19243B',
        signalTextColor: '#19243B',
        labelBoxBkgColor: '#FFFFFF',
        labelBoxBorderColor: '#E2E0D9',
        labelTextColor: '#19243B',
        noteBkgColor: '#FFF7E8',
        noteTextColor: '#8A5700',
        noteBorderColor: '#F5D08A',
        fontFamily: "'Geist', system-ui, -apple-system, sans-serif",
        fontSize: '13px',
      },
      flowchart: { curve: 'basis', padding: 16 },
      sequence: { mirrorActors: false },
      er: { useMaxWidth: true },
    });
    mermaidInitialized = true;
  } catch {
  }
}

function sanitizeMermaidCode(raw) {
  if (!raw) return '';
  let text = String(raw).trim();
  text = text.replace(/^```(?:mermaid)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
  text = text.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
  return text;
}

function cleanupStrayMermaidErrors() {
  try {
    const stray = document.querySelectorAll('body > #dmermaid, body > svg[aria-roledescription="error"], #dmermaid');
    stray.forEach((el) => el.remove());
  } catch {
  }
}

function getSafeDiagramId() {
  idCounter += 1;
  return `acad_mermaid_chart_${idCounter}_${Date.now()}`;
}

export function MermaidDiagram({ chart }) {
  const rawCode = typeof chart === 'string' ? chart.trim() : String(chart || '').trim();
  const code = sanitizeMermaidCode(rawCode);

  const [svgContent, setSvgContent] = useState(() => svgCache.get(code) || '');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!code) return;

    if (svgCache.has(code)) {
      setSvgContent(svgCache.get(code));
      setHasError(false);
      return;
    }

    let isMounted = true;
    ensureMermaidInit();

    (async () => {
      try {
        const diagramId = getSafeDiagramId();
        const res = await mermaid.render(diagramId, code);
        cleanupStrayMermaidErrors();

        const renderedSvg = typeof res === 'string' ? res : res?.svg || '';
        if (renderedSvg) {
          svgCache.set(code, renderedSvg);
          if (isMounted) {
            setSvgContent(renderedSvg);
            setHasError(false);
          }
        } else if (isMounted) {
          setHasError(true);
        }
      } catch {
        cleanupStrayMermaidErrors();
        if (isMounted) {
          setHasError(true);
        }
      }
    })();

    return () => {
      isMounted = false;
      cleanupStrayMermaidErrors();
    };
  }, [code]);

  if (hasError) {
    return (
      <div className="my-4 rounded-xl border border-[#E2E0D9] bg-[#F8F7F4] p-4 font-mono text-xs text-[#19243B] overflow-x-auto whitespace-pre">
        {rawCode}
      </div>
    );
  }

  if (!svgContent) {
    return null;
  }

  return (
    <div className="my-5 rounded-2xl border border-[#E2E0D9] bg-white p-5 sm:p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.04)] overflow-x-auto flex justify-center items-center">
      <div
        className="w-full flex justify-center items-center [&_svg]:max-w-full [&_svg]:h-auto"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
}

export default MermaidDiagram;
