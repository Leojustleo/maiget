import { useEffect, useState } from 'react'

const STAGES = [
  'Initializing search engines…',
  'Probing social networks…',
  'Checking tech platforms…',
  'Scanning gaming sites…',
  'Aggregating results…',
]

interface Props {
  username: string
}

export function LoadingState({ username }: Props) {
  const [stage, setStage] = useState(0)
  const [dots, setDots] = useState(1)

  useEffect(() => {
    const stageTimer = setInterval(() => {
      setStage((s) => (s < STAGES.length - 1 ? s + 1 : s))
    }, 700)
    const dotTimer = setInterval(() => {
      setDots((d) => (d % 3) + 1)
    }, 400)
    return () => {
      clearInterval(stageTimer)
      clearInterval(dotTimer)
    }
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 text-center space-y-8">
      {/* Animated ring */}
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 rounded-full border-2 border-violet-500/20" />
        <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-t-2 border-violet-400/50 animate-spin [animation-duration:1.5s] [animation-direction:reverse]" />
        <div className="absolute inset-0 flex items-center justify-center text-violet-400 text-xs font-mono">
          {String.fromCodePoint(0x1f50d)}
        </div>
      </div>

      <div>
        <p className="text-slate-300 font-medium">
          Searching for <span className="text-violet-400 font-bold">@{username}</span>
        </p>
        <p className="text-slate-500 text-sm mt-1">
          {STAGES[stage]}{'·'.repeat(dots)}
        </p>
      </div>

      {/* Skeleton cards */}
      <div className="space-y-2 text-left">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="shimmer h-14 rounded-xl opacity-40"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
