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
      <div className="bg-zinc-950 min-h-screen text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 mt-15 min-h-screen text-white">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-center mb-2">
            {genreName}
          </h1>
          <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
        </div>

        {/* Recently Added Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-red-600 mr-4"></div>
            <h2 className="text-xl font-medium">Recently added</h2>
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <Link key={movie.id} href={`/Movie/${movie.id}`}>
                <div className="group cursor-pointer">
                  <div className="relative mb-3 overflow-hidden rounded-lg ">
                    {/* Movie Poster */}
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : '/placeholder-poster.jpg'
                      }
                      alt={movie.title}
                      className="w-full h-[220px] sm:h-[240px] md:h-[260px] object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Overlay dengan informasi */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="flex items-center justify-between text-xs text-white/90 mb-1">
                          <span className="bg-yellow-500 text-black px-2 py-1 rounded font-semibold">
                            {movie.vote_average.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                          {movie.overview.length > 80
                            ? `${movie.overview.substring(0, 80)}...`
                            : movie.overview}
                        </p>
                      </div>
                    </div>

                    {/* Quality Badges - Sample badges like in the reference */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {Math.random() > 0.7 && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-semibold">
                          BLURAY
                        </span>
                      )}
                      {Math.random() > 0.8 && (
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-semibold">
                          CAM
                        </span>
                      )}
                      {Math.random() > 0.9 && (
                        <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded font-semibold">
                          WEBDL
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div className="text-center">
                    <h3 className="text-sm font-medium text-white group-hover:text-red-400 transition-colors duration-200 line-clamp-2 mb-1 leading-tight">
                      {movie.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {formatDate(movie.release_date)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 mb-8">
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                Previous
              </button>

              {/* Page Numbers */}
              {getPaginationNumbers().map((page, index) => (
                <div key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-gray-400">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page as number)}
                      className={`px-4 py-2 text-sm rounded transition-colors ${
                        currentPage === page
                          ? 'bg-red-600 text-white'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </div>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* No movies found */}
        {!loading && movies.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-400 mb-2">No movies found</h3>
            <p className="text-gray-500">Try browsing other categories</p>
          </div>
        )}
      </div>
    </div>
  );
}