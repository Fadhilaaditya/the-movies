"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

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
  season_number: number;
  episode_count: number;
  episodes?: Episode[];
}

interface EpisodeListProps {
  tvId: string;
  currentSeason: number;
  currentEpisode: number;
}

export default function EpisodeList({ tvId, currentSeason, currentEpisode }: EpisodeListProps) {
  const [seasonData, setSeasonData] = useState<Season | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  useEffect(() => {
    const fetchSeasonEpisodes = async () => {
      if (!tvId || !currentSeason) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/tv/${tvId}/season/${currentSeason}?api_key=${API_KEY}`
        );
        setSeasonData(response.data);
      } catch (error) {
        console.error("Error fetching season episodes:", error);
        setError("Failed to load episodes");
      } finally {
        setLoading(false);
      }
    };

    fetchSeasonEpisodes();
  }, [tvId, currentSeason, API_KEY]);

  if (loading) {
    return (
      <div className="mt-8">
        <div className="bg-zinc-900 rounded-lg p-4">
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !seasonData) {
    return (
      <div className="mt-8">
        <div className="bg-zinc-900 rounded-lg p-4">
          <div className="text-center py-8 text-gray-400">
            {error || "No episodes available"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="bg-zinc-900 rounded-lg p-4">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white">
            Season {seasonData.season_number}
          </h3>
        </div>

        <div className="space-y-2">
          {seasonData.episodes?.map((episode) => (
            <Link 
              key={episode.id} 
              href={`/Watch/${tvId}?type=tv&season=${seasonData.season_number}&episode=${episode.episode_number}`}
              className={`flex items-center gap-3 p-2 rounded transition ${
                currentEpisode === episode.episode_number 
                  ? 'bg-red-600/20 border border-red-600/50' 
                  : 'hover:bg-zinc-800'
              }`}
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
                    {seasonData.season_number} - {episode.episode_number}
                  </span>
                </div>
                <h4 className={`font-medium text-base truncate mb-1 ${
                  currentEpisode === episode.episode_number ? 'text-red-400' : 'text-white'
                }`}>
                  {episode.name}
                </h4>
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
          ))}
        </div>
      </div>
    </div>
  );
}