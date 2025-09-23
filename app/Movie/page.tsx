"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Film, Star } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

interface Genre {
  id: number;
  name: string;
}

export default function MoviesPage() {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("popularity.desc");

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, [API_KEY]);

  // Fetch DIFFERENT featured movies (trending this week + top rated)
  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        // Mix trending and top rated movies for featured section
        const [trendingResponse, topRatedResponse] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=1`)
        ]);

        // Mix trending (first 5) and top rated (first 5) movies
        const trendingMovies = trendingResponse.data.results.slice(0, 5);
        const topRatedMovies = topRatedResponse.data.results.slice(0, 5);
        
        // Combine and shuffle for variety
        const combinedFeatured = [...trendingMovies, ...topRatedMovies];
        setFeaturedMovies(combinedFeatured.slice(0, 10));
      } catch (error) {
        console.error("Error fetching featured movies:", error);
      }
    };
    fetchFeaturedMovies();
  }, [API_KEY]);

  // Fetch all movies (discover with different sorting than featured)
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${currentPage}&sort_by=${sortBy}`;
        
        if (selectedGenre) {
          url += `&with_genres=${selectedGenre}`;
        }

        // Add date filters to get more recent movies for "All Movies"
        const currentYear = new Date().getFullYear();
        url += `&primary_release_date.gte=${currentYear - 3}-01-01`; // Movies from last 3 years

        const response = await axios.get(url);
        setMovies(response.data.results);
        setTotalPages(Math.min(response.data.total_pages, 500));
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage, selectedGenre, sortBy, API_KEY]);

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
    <div className="min-h-screen mt-15 bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Featured Movies Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-red-600"></div>
            <h2 className="text-2xl font-bold">Featured Movies</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {featuredMovies.map((movie) => (
              <Link key={movie.id} href={`/Movie/${movie.id}`}>
                <div className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="aspect-[2/3] overflow-hidden">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <Film size={48} className="text-gray-600" />
                      </div>
                    )}
                  </div>
                  
                  {/* Featured Badge */}
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                    FEATURED
                  </div>

                  {/* Rating Badge */}
                  {movie.vote_average > 0 && (
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      {movie.vote_average.toFixed(1)}
                    </div>
                  )}

                  {/* Movie Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                      {movie.title}
                    </h3>
                    {movie.release_date && (
                      <p className="text-gray-300 text-xs">
                        {new Date(movie.release_date).getFullYear()}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Movies Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-red-600"></div>
            <h2 className="text-2xl font-bold">All Movies</h2>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          )}

          {/* Movies Grid */}
          {!loading && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                {movies.map((movie) => (
                  <Link key={movie.id} href={`/Movie/${movie.id}`}>
                    <div className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      <div className="aspect-[2/3] overflow-hidden">
                        {movie.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                            <Film size={48} className="text-gray-600" />
                          </div>
                        )}
                      </div>

                      {/* Rating Badge */}
                      {movie.vote_average > 0 && (
                        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                          {movie.vote_average.toFixed(1)}
                        </div>
                      )}

                      {/* Movie Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-1">
                          {movie.title}
                        </h3>
                        {movie.release_date && (
                          <p className="text-gray-300 text-xs">
                            {new Date(movie.release_date).getFullYear()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full bg-zinc-800 text-gray-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {getPaginationRange().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-full text-sm transition ${
                        page === currentPage
                          ? "bg-red-600 text-white"
                          : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full bg-zinc-800 text-gray-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight size={20} />
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