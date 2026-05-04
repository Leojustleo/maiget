export interface Account {
  site: string;
  url: string;
  status: 'found' | 'not_found' | 'error';
  category?: string;
  country?: string;
}

export interface SearchResult {
  username: string;
  total_found: number;
  accounts: Account[];
  elapsed_seconds: number;
}

export type SearchStatus = 'idle' | 'loading' | 'done' | 'error';
