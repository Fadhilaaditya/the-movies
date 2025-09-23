"use client";

import { useState, useEffect } from "react";
import { Play, Info, Star, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
  logo_path?: string | null;
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  // Fetch popular movies for hero section
  useEffect(() => {
    const fetchHeroMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1`
        );
        
        // Get detailed info for first 5 movies including genres and logos
        const detailedMovies = await Promise.all(
          response.data.results.slice(0, 5).map(async (movie: Movie) => {
            const detailResponse = await axios.get(
              `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`
            );
            
            // Fetch movie images to get logo
            let logoPath = null;
            try {
              const imagesResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${movie.id}/images?api_key=${API_KEY}&include_image_language=en,null`
              );
              const logos = imagesResponse.data.logos;
              
              // Debug: Log the logos response
              console.log(`Movie: ${detailResponse.data.title}`);
              console.log('Available logos:', logos);
              
              // Get the first available logo, prioritizing English logos
              logoPath = logos?.find((logo: any) => logo.iso_639_1 === 'en')?.file_path || 
                        logos?.find((logo: any) => logo.iso_639_1 === null)?.file_path ||
                        logos?.[0]?.file_path || 
                        null;
              
              console.log('Selected logo path:', logoPath);
            } catch (error) {
              console.error("Error fetching movie logo:", error);
            }
            
            return {
              ...detailResponse.data,
              logo_path: logoPath
            };
          })
        );
        
        setMovies(detailedMovies);
      } catch (error) {
        console.error("Error fetching hero movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroMovies();
  }, [API_KEY]);

  // Auto-slide every 10 seconds
  useEffect(() => {
    if (movies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movies.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [movies.length]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading || movies.length === 0) {
    return (
      <div className="relative w-full h-[90vh] bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  const currentMovie = movies[currentSlide];

  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
        }}
      >
        {/* Dark Overlay Gradient - More sophisticated */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 mt-20 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            {/* Movie Title/Logo - Show logo if available, otherwise title */}
            <div className="mb-6">
              {currentMovie.logo_path ? (
                <div className="logo-container">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${currentMovie.logo_path}`}
                    alt={currentMovie.title}
                    className="h-16 md:h-20 lg:h-24 max-w-md object-contain"
                    onError={(e) => {
                      // Fallback to title if logo fails to load
                      console.log('Logo failed to load, showing title instead');
                      const container = (e.target as HTMLElement).parentElement;
                      if (container) {
                        container.innerHTML = `
                          <h1 class="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-wide">
                            ${currentMovie.title.toUpperCase()}
                          </h1>
                        `;
                      }
                    }}
                  />
                </div>
              ) : (
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-wide">
                  {currentMovie.title.toUpperCase()}
                </h1>
              )}
            </div>

            {/* Movie Info - More refined layout */}
            <div className="flex items-center gap-4 mb-6 text-sm text-gray-300">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-white">
                  {currentMovie.vote_average.toFixed(1)}/10
                </span>
              </div>

              {/* Release Year */}
              {currentMovie.release_date && (
                <div className="border border-gray-500 px-2 py-1 text-xs">
                  {new Date(currentMovie.release_date).getFullYear()}
                </div>
              )}

              {/* Genres */}
              {currentMovie.genres && currentMovie.genres.length > 0 && (
                <>
                  {currentMovie.genres.slice(0, 2).map((genre, index) => (
                    <span 
                      key={genre.id}
                      className="text-gray-300 text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </>
              )}
            </div>

            {/* Movie Overview - Better spacing */}
            <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-xl font-light">
              {currentMovie.overview.length > 180 
                ? `${currentMovie.overview.substring(0, 180)}...` 
                : currentMovie.overview
              }
            </p>

            {/* Action Buttons - More elegant styling */}
            <div className="flex items-center gap-4">
              <Link href={`/Watch/${currentMovie.id}`}>
                <button className="flex items-center gap-3 bg-white text-black px-8 py-3 font-medium hover:bg-gray-100 transition-all duration-300 text-sm tracking-wide">
                  <Play size={18} className="fill-black" />
                  Play
                </button>
              </Link>

              <Link href={`/Movie/${currentMovie.id}`}>
                <button className="flex items-center gap-3 border border-white/50 text-white px-8 py-3 font-medium hover:bg-white/10 hover:border-white transition-all duration-300 text-sm tracking-wide backdrop-blur-sm">
                  <Info size={18} />
                  See More
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}