"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Tv, Star } from "lucide-react";

interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  origin_country: string[];
}

interface Genre {
  id: number;
  name: string;
}

export default function TvPage() {
  const [featuredTvShows, setFeaturedTvShows] = useState<TVShow[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("popularity.desc");

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  // Fetch TV genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, [API_KEY]);

  // Fetch DIFFERENT featured TV shows (trending + airing today + top rated)
  useEffect(() => {
    const fetchFeaturedTvShows = async () => {
      try {
        // Mix trending, airing today, and top rated TV shows for featured section
        const [trendingResponse, airingTodayResponse, topRatedResponse] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/tv/airing_today?api_key=${API_KEY}&page=1`),
          axios.get(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&page=1`)
        ]);

        // Mix different sources for variety
        const trendingShows = trendingResponse.data.results.slice(0, 4);
        const airingShows = airingTodayResponse.data.results.slice(0, 3);
        const topRatedShows = topRatedResponse.data.results.slice(0, 3);

        const combinedFeatured = [...trendingShows, ...airingShows, ...topRatedShows];
        const uniqueFeatured = Array.from(
          new Map(combinedFeatured.map((s: TVShow) => [s.id, s])).values()
        );
        setFeaturedTvShows(uniqueFeatured.slice(0, 10));
      } catch (error) {
        console.error("Error fetching featured TV shows:", error);
      }
    };
    fetchFeaturedTvShows();
  }, [API_KEY]);

  // Fetch all TV shows (discover with different criteria than featured)
  useEffect(() => {
    const fetchTvShows = async () => {
      setLoading(true);
      try {
        let url = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&page=${currentPage}&sort_by=${sortBy}`;
        
        if (selectedGenre) {
          url += `&with_genres=${selectedGenre}`;
        }

        // Add filters to get more recent and active TV shows
        const currentYear = new Date().getFullYear();
        url += `&first_air_date.gte=${currentYear - 5}-01-01`; // Shows from last 5 years
        url += `&vote_count.gte=10`; // Shows with at least 10 votes for quality

        const response = await axios.get(url);
        setTvShows(response.data.results);
        setTotalPages(Math.min(response.data.total_pages, 500));
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTvShows();
  }, [currentPage, selectedGenre, sortBy, API_KEY]);

  const handleGenreFilter = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPaginationRange = () => {
    const range = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="min-h-screen mt-15 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-rose-500 to-pink-500"></div>
            <h2 className="text-xl font-semibold tracking-tight">Featured TV Series</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredTvShows.map((show) => (
              <Link key={show.id} href={`/Tv/${show.id}`} className="group block">
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/5 hover:shadow-rose-500/10 hover:shadow-xl hover:scale-[1.03] hover:border-white/10 transition-all duration-300">
                  <div className="aspect-[2/3] overflow-hidden">
                    {show.poster_path ? (
                      <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center"><Tv size={40} className="text-slate-600" /></div>
                    )}
                  </div>
                  <span className="absolute top-2.5 left-2.5 z-10 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-rose-400 uppercase tracking-wider">Featured</span>
                  {show.vote_average > 0 && (
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-white/10 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      <Star size={11} className="fill-yellow-400 text-yellow-400" />{show.vote_average.toFixed(1)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <h3 className="text-white text-sm font-medium line-clamp-2">{show.name}</h3>
                    {show.first_air_date && <p className="text-slate-400 text-xs mt-1">{new Date(show.first_air_date).getFullYear()}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-rose-500 to-pink-500"></div>
            <h2 className="text-xl font-semibold tracking-tight">All TV Series</h2>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="relative w-10 h-10"><div className="absolute inset-0 rounded-full border-2 border-slate-800"></div><div className="absolute inset-0 rounded-full border-2 border-transparent border-t-rose-500 animate-spin"></div></div>
            </div>
          )}

          {!loading && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
                {tvShows.map((show) => (
                  <Link key={show.id} href={`/Tv/${show.id}`} className="group block">
                    <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/5 hover:shadow-rose-500/10 hover:shadow-xl hover:scale-[1.03] hover:border-white/10 transition-all duration-300">
                      <div className="aspect-[2/3] overflow-hidden">
                        {show.poster_path ? (
                          <img src={`https://image.tmdb.org/t/p/w500${show.poster_path}`} alt={show.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center"><Tv size={40} className="text-slate-600" /></div>
                        )}
                      </div>
                      {show.vote_average > 0 && (
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-white/10 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                          <Star size={11} className="fill-yellow-400 text-yellow-400" />{show.vote_average.toFixed(1)}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <h3 className="text-white text-sm font-medium line-clamp-2">{show.name}</h3>
                        {show.first_air_date && <p className="text-slate-400 text-xs mt-1">{new Date(show.first_air_date).getFullYear()}</p>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition">
                    <ChevronLeft size={18} />
                  </button>
                  {getPaginationRange().map((page) => (
                    <button key={page} onClick={() => handlePageChange(page)} className={`px-4 py-2 rounded-full text-sm transition ${page === currentPage ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white' : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'}`}>
                      {page}
                    </button>
                  ))}
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition">
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}