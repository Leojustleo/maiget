import { ExternalLink, CheckCircle2, XCircle } from 'lucide-react'
import type { Account } from '../types'

interface Props {
  account: Account
  index: number
}

const CATEGORY_COLORS: Record<string, string> = {
  Tech: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
  Social: 'bg-purple-900/40 text-purple-300 border-purple-700/50',
  Gaming: 'bg-green-900/40 text-green-300 border-green-700/50',
  Shopping: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50',
  default: 'bg-slate-800/60 text-slate-400 border-slate-700/50',
}

export function ResultCard({ account, index }: Props) {
  const found = account.status === 'found'
  const colorClass = CATEGORY_COLORS[account.category ?? 'default'] ?? CATEGORY_COLORS.default

  return (
    <div
      className={`group relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
        found
          ? 'bg-slate-900/70 border-slate-700 hover:border-violet-500/60 hover:bg-slate-900'
          : 'bg-slate-900/30 border-slate-800/50 opacity-50'
      }`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className={`flex-shrink-0 ${found ? 'text-emerald-400' : 'text-slate-600'}`}>
        {found ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-semibold truncate ${found ? 'text-white' : 'text-slate-500'}`}>
          {account.site}
        </p>
        {found && (
          <p className="text-sm text-slate-400 truncate">{account.url}</p>
        )}
      </div>

      {account.category && (
        <span className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
          {account.category}
        </span>
      )}

      {found && (
        <a
          href={account.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-slate-500 hover:text-violet-400 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink size={16} />
        </a>
      )}
    </div>
  )
}
