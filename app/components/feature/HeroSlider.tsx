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
      <div className="relative w-full h-[85vh] bg-slate-950 flex items-center justify-center">
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-slate-800"></div>
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-rose-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  const currentMovie = movies[currentSlide];

  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      {currentMovie.trailer_key ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center min-w-full min-h-full"
            style={{
              width: '100%',
              height: '100%',
              aspectRatio: '16/9',
            }}
          >
            <iframe
              className="absolute"
              src={`https://www.youtube.com/embed/${currentMovie.trailer_key}?autoplay=1&mute=1&loop=1&playlist=${currentMovie.trailer_key}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&start=10`}
              allow="autoplay; encrypted-media"
              allowFullScreen={false}
              style={{
                width: '177.78vh',
                height: '100vh',
                minWidth: '100%',
                minHeight: '56.25vw',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%) scale(1.1)',
              }}
              onLoad={() => setVideoLoaded(true)}
            />
          </div>
          {!videoLoaded && (
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-slate-950/30"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})` }}>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-slate-950/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
        </div>
      )}

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="mb-6">
              {currentMovie.logo_path ? (
                <div className="logo-container">
                  <img src={`https://image.tmdb.org/t/p/w500${currentMovie.logo_path}`} alt={currentMovie.title} className="h-20 md:h-28 lg:h-36 max-w-md md:max-w-lg object-contain drop-shadow-2xl" onError={(e) => {
                    const container = (e.target as HTMLElement).parentElement;
                    if (container) { container.innerHTML = `<h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-2xl">${currentMovie.title.toUpperCase()}</h1>`; }
                  }} />
                </div>
              ) : (
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-2xl">{currentMovie.title.toUpperCase()}</h1>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-6 text-sm md:text-base text-slate-200">
              <div className="flex items-center gap-1.5">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <span className="text-white font-semibold">{currentMovie.vote_average.toFixed(1)}/10</span>
              </div>
              {currentMovie.release_date && (
                <span className="border border-white/20 px-2.5 py-1 bg-white/5 text-sm rounded">{new Date(currentMovie.release_date).getFullYear()}</span>
              )}
              {currentMovie.genres?.slice(0, 2).map((genre) => (
                <span key={genre.id} className="text-slate-200 text-sm md:text-base">{genre.name}</span>
              ))}
            </div>

            <p className="text-slate-200 text-base md:text-lg leading-relaxed mb-8 max-w-2xl font-light line-clamp-3 md:line-clamp-4 drop-shadow-md">
              {currentMovie.overview.length > 220 ? `${currentMovie.overview.substring(0, 220)}...` : currentMovie.overview}
            </p>

            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <Link href={`/Watch/${currentMovie.id}`}>
                <button className="flex items-center gap-2 bg-white text-slate-950 px-7 py-3 md:px-8 md:py-3.5 rounded-full font-semibold text-base hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-white/10">
                  <Play size={18} className="fill-slate-950" />
                  Play
                </button>
              </Link>
              <Link href={`/Movie/${currentMovie.id}`}>
                <button className="flex items-center gap-2 border border-white/20 bg-white/10 backdrop-blur-sm text-white px-7 py-3 md:px-8 md:py-3.5 rounded-full font-semibold text-base hover:bg-white/20 transition-all duration-300">
                  <Info size={18} />
                  Details
                </button>
              </Link>
            </div>

            <div className="flex items-center gap-2 mt-10">
              {movies.map((_, index) => (
                <button key={index} onClick={() => handleSlideChange(index)} className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide ? 'w-10 bg-rose-500' : 'w-5 bg-white/20 hover:bg-white/40'}`} aria-label={`Go to slide ${index + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}