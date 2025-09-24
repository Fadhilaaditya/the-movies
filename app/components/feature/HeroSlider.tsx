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
  trailer_key?: string | null;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  // Fetch popular movies for hero section
  useEffect(() => {
    const fetchHeroMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=1`
        );
        
        // Get detailed info for first 5 movies including genres, logos, and videos
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
              
              logoPath = logos?.find((logo: any) => logo.iso_639_1 === 'en')?.file_path || 
                        logos?.find((logo: any) => logo.iso_639_1 === null)?.file_path ||
                        logos?.[0]?.file_path || 
                        null;
            } catch (error) {
              console.error("Error fetching movie logo:", error);
            }
            
            // Fetch movie videos to get trailer
            let trailerKey = null;
            try {
              const videosResponse = await axios.get(
                `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`
              );
              const videos = videosResponse.data.results;
              
              // Find the official trailer (prioritize YouTube)
              const trailer = videos.find((video: Video) => 
                video.type === 'Trailer' && 
                video.site === 'YouTube' && 
                video.official === true
              ) || videos.find((video: Video) => 
                video.type === 'Trailer' && 
                video.site === 'YouTube'
              ) || videos.find((video: Video) => 
                video.type === 'Teaser' && 
                video.site === 'YouTube'
              );
              
              trailerKey = trailer?.key || null;
              console.log(`Movie: ${detailResponse.data.title}, Trailer Key: ${trailerKey}`);
            } catch (error) {
              console.error("Error fetching movie videos:", error);
            }
            
            return {
              ...detailResponse.data,
              logo_path: logoPath,
              trailer_key: trailerKey
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

  // Auto-slide every 15 seconds (increased for video viewing)
  useEffect(() => {
    if (movies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        setVideoLoaded(false); // Reset video loaded state
        return (prev + 1) % movies.length;
      });
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [movies.length]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    setVideoLoaded(false);
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
      {/* Video Background */}
      {currentMovie.trailer_key ? (
        <div className="absolute inset-0 w-full h-full">
          {/* YouTube Iframe */}
          <iframe
            className="absolute inset-0 w-full h-full object-cover"
            src={`https://www.youtube.com/embed/${currentMovie.trailer_key}?autoplay=1&mute=1&loop=1&playlist=${currentMovie.trailer_key}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&start=10`}
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            style={{
              minWidth: '100%',
              minHeight: '100%',
              width: '100vw',
              height: '100vh',
              transform: 'scale(1.2)', // Scale up to hide controls
              transformOrigin: 'center center'
            }}
            onLoad={() => setVideoLoaded(true)}
          />
          
          {/* Fallback Image if video not loaded */}
          {!videoLoaded && (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
              }}
            />
          )}
          
          {/* Dark Overlay for Video */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
        </div>
      ) : (
        // Fallback to backdrop image if no trailer available
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
          }}
        >
          {/* Dark Overlay for Image */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 mt-20 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            {/* Movie Title/Logo */}
            <div className="mb-6">
              {currentMovie.logo_path ? (
                <div className="logo-container">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${currentMovie.logo_path}`}
                    alt={currentMovie.title}
                    className="h-16 md:h-20 lg:h-24 max-w-md object-contain drop-shadow-2xl"
                    onError={(e) => {
                      console.log('Logo failed to load, showing title instead');
                      const container = (e.target as HTMLElement).parentElement;
                      if (container) {
                        container.innerHTML = `
                          <h1 class="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-wide drop-shadow-2xl">
                            ${currentMovie.title.toUpperCase()}
                          </h1>
                        `;
                      }
                    }}
                  />
                </div>
              ) : (
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-wide drop-shadow-2xl">
                  {currentMovie.title.toUpperCase()}
                </h1>
              )}
            </div>

            {/* Movie Info */}
            <div className="flex items-center gap-4 mb-6 text-sm text-gray-200">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-white">
                  {currentMovie.vote_average.toFixed(1)}/10
                </span>
              </div>

              {/* Release Year */}
              {currentMovie.release_date && (
                <div className="border border-gray-400 px-2 py-1 text-xs bg-black/30">
                  {new Date(currentMovie.release_date).getFullYear()}
                </div>
              )}

              {/* Genres */}
              {currentMovie.genres && currentMovie.genres.length > 0 && (
                <>
                  {currentMovie.genres.slice(0, 2).map((genre, index) => (
                    <span 
                      key={genre.id}
                      className="text-gray-200 text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </>
              )}
            </div>

            {/* Movie Overview */}
            <p className="text-gray-200 text-base leading-relaxed mb-8 max-w-xl font-light drop-shadow-lg">
              {currentMovie.overview.length > 180 
                ? `${currentMovie.overview.substring(0, 180)}...` 
                : currentMovie.overview
              }
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Link href={`/Watch/${currentMovie.id}`}>
                <button className="flex items-center gap-3 bg-white text-black px-8 py-3 font-medium hover:bg-gray-100 transition-all duration-300 text-sm tracking-wide shadow-lg">
                  <Play size={18} className="fill-black" />
                  Play
                </button>
              </Link>

              <Link href={`/Movie/${currentMovie.id}`}>
                <button className="flex items-center gap-3 border border-white/70 text-white px-8 py-3 font-medium hover:bg-white/20 hover:border-white transition-all duration-300 text-sm tracking-wide backdrop-blur-sm shadow-lg">
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