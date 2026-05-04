import { useState, type FormEvent } from 'react'
import { Search, Loader2 } from 'lucide-react'

export const PRESETS = [
  { label: 'Quick', sites: 100, hint: '~5s' },
  { label: 'Standard', sites: 500, hint: '~20s' },
  { label: 'Deep', sites: 1500, hint: '~1min' },
  { label: 'Full', sites: 3150, hint: '~3min' },
] as const

interface Props {
  onSearch: (username: string) => void
  loading: boolean
  top: number
  onTopChange: (top: number) => void
}

export function SearchBar({ onSearch, loading, top, onTopChange }: Props) {
  const [value, setValue] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || loading) return
    onSearch(trimmed)
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <div className="absolute left-4 text-slate-400">
            {loading ? (
              <Loader2 size={20} className="animate-spin text-violet-400" />
            ) : (
              <Search size={20} />
            )}
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a username..."
            disabled={loading}
            autoFocus
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-36 py-4 text-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!value.trim() || loading}
            className="absolute right-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-lg transition-all text-sm"
          >
            {loading ? 'Searching…' : 'Search'}
          </button>
        </div>
      </form>

      {/* Depth selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 shrink-0">Scan depth:</span>
        <div className="flex gap-1.5">
          {PRESETS.map((p) => {
            const active = top === p.sites
            return (
              <button
                key={p.sites}
                type="button"
                disabled={loading}
                onClick={() => onTopChange(p.sites)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  active
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {p.label}
                <span className={`ml-1.5 ${active ? 'text-violet-200' : 'text-slate-600'}`}>
                  {p.hint}
                </span>
              </button>
            )
          })}
        </div>
        <span className="ml-auto text-xs text-slate-600 font-mono">{top.toLocaleString()} sites</span>
      </div>
    </div>
  )
}
