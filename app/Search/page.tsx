// File: app/search/page.tsx

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import SkeletonCard from '../components/ui/SkeletonCard';
import SearchResultCard from '../components/ui/SearchResultCard';

function SearchResultsContent() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    setResults([]);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
  }, [query]);

  useEffect(() => {
    const fetchData = async () => {
      if (!query || !hasMore) return;
      if (page === 1) setInitialLoading(true);
      setLoading(true);

      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/multi`,
          {
            params: {
              api_key: API_KEY,
              query,
              page,
            },
          }
        );

        const newItems = res.data.results.filter(
          (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
        );

        setResults((prev) => [...(page === 1 ? [] : prev), ...newItems]);
        setHasMore(res.data.page < res.data.total_pages);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [query, page, API_KEY, hasMore]);

  return (
    <div className="px-4 mt-15 py-8 max-w-7xl mx-auto text-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-rose-500 to-pink-500"></div>
        <h1 className="text-xl font-semibold tracking-tight">
          Search Results for: <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">{query}</span>
        </h1>
      </div>

      {initialLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, idx) => <SkeletonCard key={idx} />)}
        </div>
      )}

      {!initialLoading && (
        <>
          {results.length === 0 ? (
            <p className="text-slate-500 py-12 text-center">No results found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((item: any) => <SearchResultCard key={`${item.media_type}-${item.id}`} item={item} />)}
            </div>
          )}
        </>
      )}

      {!initialLoading && hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-white/5 backdrop-blur-sm border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white px-6 py-2.5 rounded-full font-medium text-sm transition"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchResults() {
  return (
    <Suspense
      fallback={
        <div className="px-4 py-6 max-w-7xl mx-auto text-white">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
            {Array.from({ length: 10 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}