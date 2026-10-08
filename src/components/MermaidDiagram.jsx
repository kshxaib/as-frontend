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
  text = text.replace(/^```(?:mermaid|flowchart|graph)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
  text = text.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');

  const headerMatch = text.search(/^(?:graph\s+|flowchart\s+|sequenceDiagram|stateDiagram(?:-v2)?|erDiagram|classDiagram|pie|gitGraph)/m);
  if (headerMatch > 0) {
    text = text.slice(headerMatch).trim();
  }

  const lines = text.split('\n');
  const validLines = [];
  let foundHeader = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!foundHeader) {
      if (/^(?:graph\s+|flowchart\s+|sequenceDiagram|stateDiagram(?:-v2)?|erDiagram|classDiagram|pie|gitGraph)/i.test(trimmed)) {
        foundHeader = true;
        validLines.push(line);
      }
      continue;
    }

    if (/^(?:In this diagram|This diagram|Note:|Here,|Where\b|The above|As shown)/i.test(trimmed)) {
      break;
    }
    validLines.push(line);
  }

  text = (validLines.length > 0 ? validLines.join('\n') : text).trim();

  text = text.replace(/\[([^[\]\n]+)\]/g, (match, label) => {
    if (label.includes('(') || label.includes(')') || label.includes('"')) {
      const cleanLabel = label.replace(/\(([^)]+)\)/g, '- $1').replace(/["'()]/g, '').trim();
      return `[${cleanLabel}]`;
    }
    return match;
  });

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
          return;
        }
      } catch {
        cleanupStrayMermaidErrors();
      }

      try {
        const lines = code.split('\n').map((l) => {
          return l.replace(/\[(.*?)\]/g, (_m, inner) => `[${inner.replace(/[^a-zA-Z0-9\s_-]/g, ' ').trim()}]`);
        }).join('\n');

        const diagramId2 = getSafeDiagramId();
        const res2 = await mermaid.render(diagramId2, lines);
        cleanupStrayMermaidErrors();

        const renderedSvg2 = typeof res2 === 'string' ? res2 : res2?.svg || '';
        if (renderedSvg2) {
          svgCache.set(code, renderedSvg2);
          if (isMounted) {
            setSvgContent(renderedSvg2);
            setHasError(false);
          }
          return;
        }
      } catch {
        cleanupStrayMermaidErrors();
      }

      if (isMounted) {
        setHasError(true);
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
