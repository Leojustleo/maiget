import type { SearchResult } from './types'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

export async function searchUsername(username: string): Promise<SearchResult> {
  const res = await fetch(`${BASE_URL}/api/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error ?? `HTTP ${res.status}`)
  }
  return res.json()
}

// Mock for local dev without a backend running
export function mockSearch(username: string): Promise<SearchResult> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        username,
        total_found: 7,
        elapsed_seconds: 4.2,
        accounts: [
          { site: 'GitHub', url: `https://github.com/${username}`, status: 'found', category: 'Tech' },
          { site: 'Twitter / X', url: `https://x.com/${username}`, status: 'found', category: 'Social' },
          { site: 'Reddit', url: `https://reddit.com/user/${username}`, status: 'found', category: 'Social' },
          { site: 'Instagram', url: `https://instagram.com/${username}`, status: 'found', category: 'Social' },
          { site: 'HackerNews', url: `https://news.ycombinator.com/user?id=${username}`, status: 'found', category: 'Tech' },
          { site: 'Dev.to', url: `https://dev.to/${username}`, status: 'found', category: 'Tech' },
          { site: 'Keybase', url: `https://keybase.io/${username}`, status: 'found', category: 'Tech' },
          { site: 'Facebook', url: `https://facebook.com/${username}`, status: 'not_found', category: 'Social' },
          { site: 'TikTok', url: `https://tiktok.com/@${username}`, status: 'not_found', category: 'Social' },
        ],
      })
    }, 2800)
  )
}
