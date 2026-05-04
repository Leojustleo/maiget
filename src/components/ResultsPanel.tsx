import { CheckCircle2, Clock, Download } from 'lucide-react'
import type { SearchResult } from '../types'
import { ResultCard } from './ResultCard'

interface Props {
  result: SearchResult
}

export function ResultsPanel({ result }: Props) {
  const found = result.accounts.filter((a) => a.status === 'found')
  const notFound = result.accounts.filter((a) => a.status !== 'found')

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `maigret-${result.username}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 size={18} />
            <span className="font-bold text-xl">{result.total_found}</span>
            <span className="text-slate-400 text-sm">accounts found</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm">
            <Clock size={14} />
            <span>{result.elapsed_seconds.toFixed(1)}s</span>
          </div>
        </div>
        <button
          onClick={downloadJSON}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-all"
        >
          <Download size={14} />
          Export JSON
        </button>
      </div>

      {/* Found accounts */}
      {found.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
            Found — {found.length}
          </h3>
          {found.map((a, i) => (
            <ResultCard key={a.site} account={a} index={i} />
          ))}
        </div>
      )}

      {/* Not found */}
      {notFound.length > 0 && (
        <details className="group">
          <summary className="cursor-pointer list-none flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-colors">
            <span className="group-open:rotate-90 inline-block transition-transform">›</span>
            Not found — {notFound.length}
          </summary>
          <div className="mt-3 space-y-2">
            {notFound.map((a, i) => (
              <ResultCard key={a.site} account={a} index={i} />
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
