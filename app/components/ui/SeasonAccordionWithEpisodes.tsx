"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  air_date: string;
  runtime: number;
  vote_average: number;
  still_path: string | null;
}

interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string;
}

interface SeasonAccordionProps {
  tvId: string;
  seasons: Season[];
}

export default function SeasonAccordionWithEpisodes({ tvId, seasons }: SeasonAccordionProps) {
  const [openSeason, setOpenSeason] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<{ [key: number]: Episode[] }>({});
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const fetchEpisodes = async (seasonNumber: number) => {
    if (episodes[seasonNumber] || loading[seasonNumber]) return;
    
    setLoading(prev => ({ ...prev, [seasonNumber]: true }));
    
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`
      );
      setEpisodes(prev => ({ ...prev, [seasonNumber]: response.data.episodes }));
    } catch (error) {
      console.error("Error fetching episodes:", error);
    } finally {
      setLoading(prev => ({ ...prev, [seasonNumber]: false }));
    }
  };

  const toggleSeason = (seasonNumber: number) => {
    if (openSeason === seasonNumber) {
      setOpenSeason(null);
    } else {
      setOpenSeason(seasonNumber);
      fetchEpisodes(seasonNumber);
    }
  };

  // Filter out Season 0 (specials) and sort seasons
  const validSeasons = seasons
    .filter(season => season.season_number > 0)
    .sort((a, b) => a.season_number - b.season_number);

  return (
    <div className="space-y-4">
      {validSeasons.map((season) => (
        <div key={season.id} className="bg-zinc-900 rounded-xl shadow-lg overflow-hidden border border-zinc-800">
          {/* Season Header */}
          <button
            onClick={() => toggleSeason(season.season_number)}
            className="w-full p-6 text-left hover:bg-zinc-800 transition-colors duration-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              {/* Season Poster */}
              {season.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w92${season.poster_path}`}
                  alt={season.name}
                  className="w-16 h-24 object-cover rounded-lg shadow"
                />
              )}
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">{season.name}</h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>{season.episode_count} Episode{season.episode_count > 1 ? "s" : ""}</p>
                  {season.air_date && (
                    <p>Aired: {new Date(season.air_date).getFullYear()}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Expand/Collapse Icon */}
            <div className="text-gray-400">
              <svg
                className={`w-6 h-6 transition-transform duration-200 ${
                  openSeason === season.season_number ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Season Overview */}
          {season.overview && openSeason === season.season_number && (
            <div className="px-6 pb-4 text-gray-300 text-sm leading-relaxed border-b border-zinc-800">
              {season.overview}
            </div>
          )}

          {/* Episodes List */}
          {openSeason === season.season_number && (
            <div className="p-6 bg-zinc-850">
              {loading[season.season_number] ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              ) : episodes[season.season_number] ? (
                <div className="space-y-4">
                  {episodes[season.season_number].map((episode) => (
                    <div key={episode.id} className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-700 transition-colors">
                      <div className="flex gap-4">
                        {/* Episode Still */}
                        {episode.still_path && (
                          <div className="flex-shrink-0">
                            <img
                              src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                              alt={episode.name}
                              className="w-32 h-18 object-cover rounded-md shadow"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          {/* Episode Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-lg font-medium text-white mb-1">
                                {episode.episode_number}. {episode.name}
                              </h4>
                              <div className="flex items-center gap-3 text-sm text-gray-400">
                                {episode.air_date && (
                                  <span>{new Date(episode.air_date).toLocaleDateString()}</span>
                                )}
                                {episode.runtime && (
                                  <>
                                    <span>•</span>
                                    <span>{episode.runtime} min</span>
                                  </>
                                )}
                                {episode.vote_average > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <span className="text-yellow-400">⭐</span>
                                      {episode.vote_average.toFixed(1)}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {/* Watch Episode Button with Navigation */}
                            <Link 
                              href={`/Watch/${tvId}?type=tv&season=${season.season_number}&episode=${episode.episode_number}`}
                              className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-full text-sm font-semibold text-white flex-shrink-0 inline-block"
                            >
                              ▶️ Watch
                            </Link>
                          </div>
                          
                          {/* Episode Overview */}
                          {episode.overview && (
                            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                              {episode.overview}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No episodes available
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}