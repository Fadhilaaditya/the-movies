"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
}

export default function CategoryPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const params = useParams();
  const searchParams = useSearchParams();
  
  const genreId = params.id as string;
  const genreName = searchParams.get('name') || 'Movies';
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  // Fetch movies by genre
  useEffect(() => {
    const fetchMoviesByGenre = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${currentPage}&sort_by=popularity.desc`
        );
        
        setMovies(response.data.results);
        setTotalPages(Math.min(response.data.total_pages, 500)); // TMDB limit
      } catch (error) {
        console.error("Error fetching movies by genre:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByGenre();
  }, [genreId, currentPage, API_KEY]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit',
      month: 'short', 
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-slate-950 min-h-screen text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative w-10 h-10"><div className="absolute inset-0 rounded-full border-2 border-slate-800"></div><div className="absolute inset-0 rounded-full border-2 border-transparent border-t-rose-500 animate-spin"></div></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 mt-15 min-h-screen text-white">
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{genreName}</h1>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 mx-auto mt-4"></div>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-rose-500 to-pink-500"></div>
            <h2 className="text-lg font-medium text-slate-300">Results</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <Link key={movie.id} href={`/Movie/${movie.id}`} className="group block">
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/5 hover:shadow-rose-500/10 hover:shadow-xl hover:scale-[1.03] hover:border-white/10 transition-all duration-300">
                  {movie.poster_path && (
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full h-[200px] sm:h-[220px] md:h-[260px] object-cover group-hover:scale-110 transition-transform duration-300" />
                  )}
                  {!movie.poster_path && (
                    <div className="w-full h-[220px] bg-slate-800 flex items-center justify-center text-slate-600">No image</div>
                  )}
                  {movie.vote_average > 0 && (
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-white/10 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      <Star size={11} className="fill-yellow-400 text-yellow-400" />{movie.vote_average.toFixed(1)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <h3 className="text-white text-sm font-medium line-clamp-2">{movie.title}</h3>
                    {movie.release_date && <p className="text-slate-400 text-xs mt-1">{new Date(movie.release_date).getFullYear()}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 mb-8">
            <div className="flex items-center gap-2">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 text-sm bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-full transition">
                Previous
              </button>
              {getPaginationNumbers().map((page, index) => (
                <div key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-slate-600">...</span>
                  ) : (
                    <button onClick={() => handlePageChange(page as number)} className={`px-4 py-2 text-sm rounded-full transition ${currentPage === page ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white' : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'}`}>
                      {page}
                    </button>
                  )}
                </div>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 text-sm bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-full transition">
                Next
              </button>
            </div>
          </div>
        )}

        {!loading && movies.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg text-slate-500 mb-2">No movies found</h3>
            <p className="text-slate-600">Try browsing other categories</p>
          </div>
        )}
      </div>
    </div>
  );
}