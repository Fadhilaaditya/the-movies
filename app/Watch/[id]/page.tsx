"use client";

import axios from "axios";
import Link from "next/link";
import { ArrowLeft, FastForward } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import EpisodeList from "@/app/components/ui/TvEpisodeList";

interface ContentData {
  title: string;
  overview: string;
  embedUrl: string;
  backUrl: string;
  episodeName?: string;
}

export default function WatchMovie() {
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.id as string;
  const season = searchParams.get("season") || "1";
  const episode = searchParams.get("episode") || "1";
  const type = searchParams.get("type");
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const isTV = type === "tv" || (searchParams.get("season") && searchParams.get("episode"));

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
          embedUrl = `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
        } else {
          embedUrl = `https://vidsrc.me/embed/movie?tmdb=${id}`;
        }

        if (isTV || type === 'tv') {
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
      <div className="min-h-screen mt-15 bg-slate-950 text-white flex items-center justify-center">
        <div className="relative w-10 h-10"><div className="absolute inset-0 rounded-full border-2 border-slate-800"></div><div className="absolute inset-0 rounded-full border-2 border-transparent border-t-rose-500 animate-spin"></div></div>
      </div>
    );
  }

  if (error || !contentData) {
    return (
      <div className="min-h-screen mt-15 bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-rose-400 mb-4">{error || "Content not found"}</p>
          <Link href="/" className="text-slate-400 hover:text-white transition">Go back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="sticky mt-15 top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href={contentData.backUrl} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
            <ArrowLeft size={16} />
            Back to Detail
          </Link>
          {(isTV || type === 'tv') && (
            <button onClick={handleSkipIntro} className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 text-white text-sm px-4 py-1.5 rounded-full shadow-lg transition">
              <FastForward size={14} />
              Skip Intro
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{contentData.title}</h1>
          {isTV && contentData.episodeName && <p className="text-slate-400 mt-2">{contentData.episodeName}</p>}
        </div>

        <div className="aspect-video rounded-2xl overflow-hidden shadow-xl border border-white/5">
          <iframe src={contentData.embedUrl} className="w-full h-full" allowFullScreen loading="lazy" referrerPolicy="no-referrer" />
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Subtitle: Auto / English</span>
          <span>Quality: Auto HD</span>
        </div>

        <p className="text-slate-500 text-sm md:text-base leading-relaxed">{contentData.overview || "No description available for this content."}</p>

        {isTV && <EpisodeList tvId={id} currentSeason={parseInt(season)} currentEpisode={parseInt(episode)} />}
      </div>
    </div>
  );
}