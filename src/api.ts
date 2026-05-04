import type { SearchResult } from './types'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export async function searchUsername(username: string, top: number): Promise<SearchResult> {
  const res = await fetch(`${BASE_URL}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, top }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error ?? `HTTP ${res.status}`)
  }
  return res.json()
}

export function mockSearch(username: string, top: number): Promise<SearchResult> {
  const delay = Math.min(800 + top * 2, 4000)
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        username,
        total_found: 7,
        elapsed_seconds: +(delay / 1000).toFixed(1),
        accounts: [
          { site: 'GitHub', url: `https://github.com/${username}`, status: 'found', category: 'Coding' },
          { site: 'Twitter / X', url: `https://x.com/${username}`, status: 'found', category: 'Social' },
          { site: 'Reddit', url: `https://reddit.com/user/${username}`, status: 'found', category: 'Social' },
          { site: 'Instagram', url: `https://instagram.com/${username}`, status: 'found', category: 'Photo' },
          { site: 'HackerNews', url: `https://news.ycombinator.com/user?id=${username}`, status: 'found', category: 'News' },
          { site: 'Dev.to', url: `https://dev.to/${username}`, status: 'found', category: 'Coding' },
          { site: 'Keybase', url: `https://keybase.io/${username}`, status: 'found', category: 'Coding' },
          { site: 'Facebook', url: `https://facebook.com/${username}`, status: 'not_found', category: 'Social' },
          { site: 'TikTok', url: `https://tiktok.com/@${username}`, status: 'not_found', category: 'Video' },
        ],
      })
    }, delay)
  )
}
