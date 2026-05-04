import { useState } from 'react'
import { SearchBar } from './components/SearchBar'
import { ResultsPanel } from './components/ResultsPanel'
import { LoadingState } from './components/LoadingState'
import { searchUsername, mockSearch } from './api'
import type { SearchResult, SearchStatus } from './types'
import { Radar } from 'lucide-react'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export default function App() {
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [result, setResult] = useState<SearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentUsername, setCurrentUsername] = useState('')

  async function handleSearch(username: string) {
    setStatus('loading')
    setResult(null)
    setError(null)
    setCurrentUsername(username)

    try {
      const data = USE_MOCK ? await mockSearch(username) : await searchUsername(username)
      setResult(data)
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Radar size={22} className="text-violet-400" />
          <span className="font-bold text-lg tracking-tight">Maiget</span>
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full font-mono">
            powered by maigret
          </span>
        </div>
        <a
          href="https://github.com/soxoj/maigret"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          GitHub
        </a>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-violet-950/50 border border-violet-700/30 text-violet-300 text-xs font-medium px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            OSINT username intelligence
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Find anyone,<br />anywhere.
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Search a username across 3,000+ platforms instantly. Built on{' '}
            <a
              href="https://github.com/soxoj/maigret"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
            >
              Maigret
            </a>
            .
          </p>
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} loading={status === 'loading'} />

        {/* States */}
        {status === 'loading' && <LoadingState username={currentUsername} />}
        {status === 'error' && (
          <div className="mt-8 bg-red-950/40 border border-red-700/40 text-red-300 rounded-xl p-4 max-w-md text-sm">
            {error}
          </div>
        )}
        {status === 'done' && result && <ResultsPanel result={result} />}

        {/* Idle hint */}
        {status === 'idle' && (
          <p className="mt-6 text-slate-600 text-sm">
            Try:{' '}
            <button onClick={() => handleSearch('soxoj')} className="text-slate-500 hover:text-violet-400 underline underline-offset-2 transition-colors">
              soxoj
            </button>
            {' · '}
            <button onClick={() => handleSearch('torvalds')} className="text-slate-500 hover:text-violet-400 underline underline-offset-2 transition-colors">
              torvalds
            </button>
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 px-6 py-4 text-center text-xs text-slate-600">
        For lawful use only · Data sourced from public profiles
      </footer>
    </div>
  )
}
