'use client'

import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showCopy?: boolean
}

export default function CodeBlock({
  code,
  language = 'markdown',
  filename,
  showCopy = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split('\n')

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/80 shadow-2xl shadow-black/40">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
          </div>
          {filename && (
            <span className="text-xs text-zinc-500 font-mono">{filename}</span>
          )}
          {!filename && language && (
            <span className="text-xs text-zinc-600 uppercase tracking-wider font-mono">
              {language}
            </span>
          )}
        </div>
        {showCopy && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-md transition-all duration-200"
          >
            {copied ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="select-none pl-4 pr-3 py-0.5 text-zinc-600 text-right font-mono text-xs w-10 align-top pt-0.5">
                  {i + 1}
                </td>
                <td className="pr-6 py-0.5 font-mono text-xs text-zinc-300 whitespace-pre">
                  {renderLine(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function renderLine(line: string) {
  // Minimal syntax highlighting for markdown/CSS/shell
  if (line.startsWith('#')) {
    return <span className="text-violet-400 font-medium">{line}</span>
  }
  if (line.startsWith('//') || line.startsWith('--')) {
    return <span className="text-zinc-600 italic">{line}</span>
  }
  if (line.startsWith('$') || line.startsWith('>')) {
    return (
      <>
        <span className="text-violet-400">{line[0]}</span>
        <span className="text-zinc-300">{line.slice(1)}</span>
      </>
    )
  }
  if (line.includes(':') && !line.startsWith(' ')) {
    const colonIdx = line.indexOf(':')
    return (
      <>
        <span className="text-sky-400">{line.slice(0, colonIdx)}</span>
        <span className="text-zinc-500">:</span>
        <span className="text-emerald-400">{line.slice(colonIdx + 1)}</span>
      </>
    )
  }
  if (line.trim().startsWith('-')) {
    return (
      <>
        <span className="text-violet-500">{line.match(/^\s*-/)?.[0]}</span>
        <span className="text-zinc-300">{line.slice((line.match(/^\s*-/)?.[0]?.length ?? 0))}</span>
      </>
    )
  }
  return <span>{line}</span>
}
