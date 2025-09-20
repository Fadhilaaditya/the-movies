"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Star, Calendar, Clock } from "lucide-react";

interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  air_date: string;
  runtime: number;
  vote_average: number;
  still_path: string | null;
  season_number: number;
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

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface TvEpisodesSectionProps {
  tvId: string;
  seasons: Season[];
  cast: Cast[];
  trailer: string | null;
  overview: string;
}

export default function TvEpisodesSection({ tvId, seasons, cast, trailer, overview }: TvEpisodesSectionProps) {
  const [activeTab, setActiveTab] = useState("episodes");
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<{ [key: number]: Episode[] }>({});
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  // Filter valid seasons (exclude Season 0 and sort)
  const validSeasons = seasons
    .filter(season => season.season_number > 0)
    .sort((a, b) => b.season_number - a.season_number); // Latest season first

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

  const handleSeasonClick = (seasonNumber: number) => {
    if (selectedSeason === seasonNumber) {
      setSelectedSeason(null);
    } else {
      setSelectedSeason(seasonNumber);
      fetchEpisodes(seasonNumber);
    }
  };

  const tabs = [
    { id: "episodes", label: "Episodes" },
    { id: "info", label: "Info" },
    { id: "cast", label: "Cast" },
    { id: "trailer", label: "Trailer" }
  ];

  return (
    <div className="py-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-800 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium transition ${
              activeTab === tab.id
                ? "text-white bg-red-600"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {/* Episodes Tab */}
        {activeTab === "episodes" && (
          <div>
            {/* Season List */}
            <div className="space-y-6">
              {validSeasons.map((season) => (
                <div key={season.id} className="bg-zinc-900 rounded-lg p-2">
                  {/* Season Header */}
                  <div 
                    className="flex items-center gap-4 cursor-pointer hover:bg-zinc-800 p-3 rounded-lg transition"
                    onClick={() => handleSeasonClick(season.season_number)}
                  >
                    <div className="w-16 h-12 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">{season.season_number}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{season.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {season.air_date && new Date(season.air_date).toLocaleDateString('en-US', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={20} className="text-yellow-400" fill="currentColor" />
                      <span className="text-white font-bold text-lg">{season.episode_count}</span>
                    </div>
                  </div>

                  {/* Episodes List */}
                  {selectedSeason === season.season_number && (
                    <div className="space-y-2">
                      {loading[season.season_number] ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                        </div>
                      ) : episodes[season.season_number] ? (
                        episodes[season.season_number].map((episode) => (
                          <Link 
                            key={episode.id} 
                            href={`/Watch/${tvId}?type=tv&season=${season.season_number}&episode=${episode.episode_number}`}
                            className="flex items-center gap-3 p-2 hover:bg-zinc-800 rounded transition"
                          >
                            {/* Episode Thumbnail */}
                            <div className="w-16 h-12 bg-zinc-700 rounded overflow-hidden flex-shrink-0">
                              {episode.still_path ? (
                                <img
                                  src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                                  alt={episode.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-zinc-600 flex items-center justify-center">
                                  <span className="text-xs text-gray-400">No Image</span>
                                </div>
                              )}
                            </div>

                            {/* Episode Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-gray-400 text-sm">
                                  {season.season_number} - {episode.episode_number}
                                </span>
                              </div>
                              <h4 className="text-white font-medium text-base truncate mb-1">{episode.name}</h4>
                              <div className="flex items-center gap-3 text-xs text-gray-400">
                                {episode.air_date && (
                                  <span className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(episode.air_date).toLocaleDateString('en-US', { 
                                      day: '2-digit', 
                                      month: 'short', 
                                      year: 'numeric' 
                                    })}
                                  </span>
                                )}
                                {episode.runtime && (
                                  <span className="flex items-center gap-1">
                                    <Clock size={12} />
                                    {episode.runtime}m
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))
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
          </div>
        )}

        {/* Info Tab */}
        {activeTab === "info" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Information</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <p className="text-gray-300 leading-relaxed">{overview}</p>
            </div>
          </div>
        )}

        {/* Cast Tab */}
        {activeTab === "cast" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cast.map((actor) => (
                <div key={actor.id} className="text-center">
                  <div className="w-full aspect-[3/4] bg-zinc-800 rounded-lg overflow-hidden mb-3">
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                        <span className="text-gray-400">No Photo</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-white font-medium text-sm mb-1 truncate">{actor.name}</h3>
                  <p className="text-gray-400 text-xs truncate">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trailer Tab */}
        {activeTab === "trailer" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Trailer</h2>
            {trailer ? (
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer}`}
                  className="w-full h-full"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="aspect-video bg-zinc-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">No trailer available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}