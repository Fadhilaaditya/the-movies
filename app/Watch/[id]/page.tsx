"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Play, Maximize, RotateCcw, FastForward, AlertCircle } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import EpisodeList from "@/app/components/ui/TvEpisodeList";

interface ContentData {
  title: string;
  overview: string;
  embedUrl: string;
  backUrl: string;
  episodeName?: string;
  totalEpisodes?: number;
  runtime?: number;
}

export default function WatchMovie() {
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [skipCountdown, setSkipCountdown] = useState<number | null>(null);
  const [iframeKey, setIframeKey] = useState(0);

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params.id as string;
  const season = searchParams.get("season") || "1";
  const episode = searchParams.get("episode") || "1";
  const type = searchParams.get("type");
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const isTV = type === "tv" || (searchParams.get("season") && searchParams.get("episode"));

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let title = "";
      let overview = "";
      let embedUrl = "";
      let backUrl = "";
      let episodeName = "";
      let totalEpisodes = 0;
      let runtime = 0;

      if (isTV || type === "tv") {
        embedUrl = `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`;
        const tvRes = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`);
        const tv = tvRes.data;
        title = `${tv.name} - Season ${season}, Episode ${episode}`;
        overview = tv.overview;
        backUrl = `/Tv/${id}`;

        try {
          const seasonRes = await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=${API_KEY}`);
          const eps = seasonRes.data.episodes || [];
          totalEpisodes = eps.length;
          runtime = seasonRes.data.episodes?.find((ep: any) => ep.episode_number === parseInt(episode))?.runtime || tv.episode_run_time?.[0] || 0;
          const currentEp = eps.find((ep: any) => ep.episode_number === parseInt(episode));
          episodeName = currentEp ? currentEp.name : "";
        } catch {}

        setSkipCountdown(85);
      } else {
        embedUrl = `https://vidsrc.to/embed/movie/${id}`;
        const movieRes = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
        const movie = movieRes.data;
        title = movie.title;
        overview = movie.overview;
        backUrl = `/Movie/${id}`;
        runtime = movie.runtime || 0;
        setSkipCountdown(85);
      }

      setContentData({ title, overview, embedUrl, backUrl, episodeName, totalEpisodes, runtime });
    } catch {
      setError("Gagal memuat konten. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }, [id, season, episode, type, isTV, API_KEY]);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  useEffect(() => {
    if (skipCountdown === null) return;
    if (skipCountdown <= 0) { setSkipCountdown(null); return; }
    const timer = setTimeout(() => setSkipCountdown(skipCountdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [skipCountdown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key.toLowerCase()) {
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "escape":
          setShowOverlay(false);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleOverlay = () => setShowOverlay(v => !v);
  const toggleFullscreen = () => {
    const el = document.querySelector<HTMLElement>(".player-container");
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen(); else el.requestFullscreen();
  };

  const handleSkipIntro = () => setSkipCountdown(0);
  const handleRetry = () => { setIframeKey(k => k + 1); setError(null); fetchContent(); };
  const handleNextEpisode = () => {
    if (!isTV) return;
    const nextEp = parseInt(episode) + 1;
    router.push(`/Watch/${id}?type=tv&season=${season}&episode=${nextEp}`);
  };
  const handlePrevEpisode = () => {
    if (!isTV) return;
    const prevEp = parseInt(episode) - 1;
    if (prevEp < 1) return;
    router.push(`/Watch/${id}?type=tv&season=${season}&episode=${prevEp}`);
  };

  const handleIframeLoad = () => { setLoading(false); setError(null); };
  const handleIframeError = () => { setError("Player gagal dimuat. Klik Retry untuk memuat ulang."); setLoading(false); };

  if (loading) {
    return (
      <div className="min-h-screen mt-15 bg-slate-950 text-white flex items-center justify-center">
        <div className="relative w-10 h-10"><div className="absolute inset-0 rounded-full border-2 border-slate-800"></div><div className="absolute inset-0 rounded-full border-2 border-transparent border-t-rose-500 animate-spin"></div></div>
      </div>
    );
  }

  if (error && !contentData) {
    return (
      <div className="min-h-screen mt-15 bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <AlertCircle size={48} className="text-rose-400" />
        <p className="text-rose-400">{error}</p>
        <button onClick={handleRetry} className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-full hover:bg-white/20 transition">
          <RotateCcw size={16} /> Retry
        </button>
        <Link href="/" className="text-slate-500 hover:text-white text-sm transition">← Kembali ke Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="sticky mt-15 top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href={contentData?.backUrl || "/"} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
            <ArrowLeft size={16} /> Back
          </Link>
          <div className="flex items-center gap-2">
            {isTV && (
              <div className="hidden sm:flex items-center gap-1 mr-2">
                <button onClick={handlePrevEpisode} disabled={parseInt(episode) <= 1} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M15 4l-8 8 8 8V4z"/></svg>
                </button>
                <span className="text-xs text-slate-500 px-1">Ep {episode}</span>
                <button onClick={handleNextEpisode} className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4l8 8-8 8V4z"/></svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">{contentData?.title}</h1>
          {isTV && contentData?.episodeName && <p className="text-slate-400 text-sm mt-1">{contentData.episodeName}</p>}
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span className="text-rose-300">{error}</span>
            <button onClick={handleRetry} className="ml-auto text-rose-400 hover:text-rose-300 font-medium transition">
              <RotateCcw size={14} className="inline mr-1" /> Retry
            </button>
          </div>
        )}

        <div className="relative player-container rounded-2xl overflow-hidden shadow-2xl border border-white/5 bg-black aspect-video">
          <iframe key={iframeKey} src={contentData?.embedUrl} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" loading="lazy" referrerPolicy="no-referrer" onLoad={handleIframeLoad} onError={handleIframeError} />

          {skipCountdown !== null && skipCountdown > 0 && (
            <div className="absolute top-4 right-4 z-20">
              <div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 flex items-center gap-2">
                <FastForward size={14} className="text-rose-400" />
                <span className="text-xs font-medium">Intro: {skipCountdown}s</span>
                <button onClick={handleSkipIntro} className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition">SKIP</button>
              </div>
            </div>
          )}

          {isTV && (
            <div className="absolute top-4 left-4 z-20">
              <div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 flex items-center gap-2">
                <span className="text-xs text-slate-300">S{season}E{episode}</span>
                <span className="text-slate-500">•</span>
                <button onClick={handlePrevEpisode} disabled={parseInt(episode) <= 1} className="text-xs text-white/60 hover:text-white disabled:opacity-30 transition">‹ Prev</button>
                <button onClick={handleNextEpisode} className="text-xs text-white/60 hover:text-white transition">Next ›</button>
              </div>
            </div>
          )}

          {showOverlay && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
              <div className="flex items-center gap-2">
                <button onClick={toggleOverlay} className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition">
                  <Play size={22} className="fill-white ml-0.5" />
                </button>
                <button onClick={toggleFullscreen} className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition">
                  <Maximize size={22} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Subtitle: Auto</span>
          <span>HD Quality</span>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed">{contentData?.overview || "Tidak ada deskripsi."}</p>

        {isTV && <EpisodeList tvId={id} currentSeason={parseInt(season)} currentEpisode={parseInt(episode)} />}
      </div>
    </div>
  );
}
