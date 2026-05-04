import { useState, type FormEvent } from 'react'
import { Search, Loader2 } from 'lucide-react'

interface Props {
  onSearch: (username: string) => void
  loading: boolean
}

export function SearchBar({ onSearch, loading }: Props) {
  const [value, setValue] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || loading) return
    onSearch(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
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
  )
}
