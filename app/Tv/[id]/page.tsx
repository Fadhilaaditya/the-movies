import axios from "axios";
import Link from "next/link";
import TvEpisodesSection from "../../components/ui/TvEpisodeSection";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export default async function TvDetail({ params }: Params) {
  const { id } = await params;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  // Fetch TV show details & trailer
  const [tvRes, videoRes] = await Promise.all([
    axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&append_to_response=credits`),
    axios.get(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}`)
  ]);

  const tv = tvRes.data;
  const videoKey = videoRes.data.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  )?.key;
  const cast = tv.credits?.cast?.slice(0, 12) || [];

  return (
    <div className="bg-slate-950 mt-15 text-white min-h-screen">
      <div className="relative">
        {tv.backdrop_path && (
          <div className="absolute inset-0">
            <img src={`https://image.tmdb.org/t/p/w1920${tv.backdrop_path}`} alt={tv.name} className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30" />
          </div>
        )}

        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <img src={`https://image.tmdb.org/t/p/w300${tv.poster_path}`} alt={tv.name} className="w-48 md:w-56 rounded-2xl shadow-2xl mx-auto md:mx-0" />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">{tv.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-4">
                <span className="text-slate-300">{new Date(tv.first_air_date).getFullYear()}</span>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-lg font-bold px-3 py-1 rounded-full">{tv.vote_average.toFixed(1)}</span>
                <div className="flex gap-0.5">
                  {[...Array(10)].map((_, i) => (
                    <span key={i} className={i < Math.round(tv.vote_average) ? "text-rose-400" : "text-slate-700"}>★</span>
                  ))}
                </div>
                <span className="text-slate-500 text-sm">{tv.vote_count} votes</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {tv.genres.map((genre: any) => (
                  <span key={genre.id} className="bg-white/5 backdrop-blur-sm text-sm px-3 py-1.5 rounded-full border border-white/10 text-slate-300">
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="text-slate-400 leading-relaxed mb-6 text-sm md:text-base">{tv.overview}</p>

              <div className="flex">
                <Link href={`/Watch/${id}?type=tv&season=1&episode=1`}>
                  <button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 transition px-6 py-2.5 rounded-full text-white font-medium shadow-lg">
                    ▶ Watch Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <TvEpisodesSection tvId={id} seasons={tv.seasons} cast={cast} trailer={videoKey} overview={tv.overview} />
      </div>
    </div>
  );
}