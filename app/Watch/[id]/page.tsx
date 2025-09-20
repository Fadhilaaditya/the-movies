"use client"; // Add this directive at the top

import axios from "axios";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FastForward } from "lucide-react";
import { useEffect, useState } from "react";
import EpisodeList from "@/app/components/ui/TvEpisodeList";

interface Props {
  params: {
    id: string;
  };
  searchParams?: {
    season?: string;
    episode?: string;
    type?: string;
  };
}

interface ContentData {
  title: string;
  overview: string;
  embedUrl: string;
  backUrl: string;
  episodeName?: string;
}

export default function WatchMovie(props: Props) {
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = props.params.id;
  const season = props.searchParams?.season || "1";
  const episode = props.searchParams?.episode || "1";
  const type = props.searchParams?.type;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const isTV = type === 'tv' || (props.searchParams?.season && props.searchParams?.episode);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        let title = "";
        let overview = "";
        let embedUrl = "";
        let backUrl = "";
        let episodeName = "";

        if (isTV || type === 'tv') {
          embedUrl = `https://vidsrc.icu/embed/tv/${id}/${season}/${episode}`;
          const tvRes = await axios.get(
            `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`
          );
          const tv = tvRes.data;
          title = `${tv.name} - Season ${season}, Episode ${episode}`;
          overview = tv.overview;
          backUrl = `/Tv/${id}`;
          
          // Get episode name
          try {
            const seasonRes = await axios.get(
              `https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}`
            );
            const currentEp = seasonRes.data.episodes?.find((ep: any) => ep.episode_number === parseInt(episode));
            episodeName = currentEp ? currentEp.name : "";
          } catch (error) {
            console.error("Error fetching episode name:", error);
          }
        } else {
          embedUrl = `https://vidsrc.icu/embed/movie/${id}`;
          const movieRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
          );
          const movie = movieRes.data;
          title = movie.title;
          overview = movie.overview;
          backUrl = `/Movie/${id}`;
        }

        setContentData({ title, overview, embedUrl, backUrl, episodeName });
      } catch (error) {
        console.error("Error fetching content:", error);
        setError("Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id, season, episode, type, isTV, API_KEY]);

  const handleSkipIntro = () => {
    alert("⏩ Intro skipped!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !contentData) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Content not found"}</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur border-b border-zinc-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href={contentData.backUrl}
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
          >
            <ArrowLeft size={16} />
            Back to Detail
          </Link>

          {/* Skip Intro Button */}
          {(isTV || type === 'tv') && (
            <button
              onClick={handleSkipIntro}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded-full shadow transition"
            >
              <FastForward size={16} />
              Skip Intro
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold">{contentData.title}</h1>
          {isTV && contentData.episodeName && (
            <p className="text-gray-400 mt-2">{contentData.episodeName}</p>
          )}
        </div>

        {/* Player */}
        <div className="aspect-video rounded-xl overflow-hidden shadow-lg border border-zinc-800">
          <iframe
            src={contentData.embedUrl}
            className="w-full h-full"
            allowFullScreen
            loading="lazy"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>💬 Subtitle: Auto / English</span>
          <span>🎚️ Quality: Auto</span>
        </div>

        {/* Overview */}
        <div className="mt-4 text-gray-300 text-sm md:text-base leading-relaxed">
          {contentData.overview || "No description available for this content."}
        </div>

        {/* Episode List Component - Only for TV */}
        {isTV && (
          <EpisodeList 
            tvId={id}
            currentSeason={parseInt(season)}
            currentEpisode={parseInt(episode)}
          />
        )}
      </div>
    </div>
  );
}