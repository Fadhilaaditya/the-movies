import axios from "axios";
import Link from "next/link";

export default async function MovieDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const [movieRes, videoRes] = await Promise.all([
    axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits`
    ),
    axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
    ),
  ]);

  const movie = movieRes.data;
  const videoKey = videoRes.data.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  )?.key;
  const cast = movie.credits?.cast?.slice(0, 6) || [];

  return (
    <div className="bg-slate-950 mt-15 text-white min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-4 py-12">
        <div className="w-full">
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="rounded-2xl shadow-2xl w-full object-cover" />
        </div>

        <div className="md:col-span-2 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-3 tracking-tight">{movie.title}</h1>
          <p className="text-sm text-slate-400 mb-4">{movie.release_date} • {movie.runtime} mins</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.map((genre: any) => (
              <Link key={genre.id} href={`/Category/${genre.id}?name=${encodeURIComponent(genre.name)}`} className="group">
                <span className="bg-white/5 backdrop-blur-sm text-sm px-3 py-1.5 rounded-full border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white transition-all duration-200">
                  {genre.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg">
              ★ {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-sm text-slate-500">TMDB Rating</span>
          </div>

          <p className="text-slate-400 leading-relaxed mb-6">{movie.overview}</p>

          <Link href={`/Watch/${id}`}>
            <button className="bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 transition px-6 py-3 rounded-full shadow-lg text-white font-semibold">
              ▶ Watch Now
            </button>
          </Link>
        </div>
      </div>

      {videoKey && (
        <div className="max-w-6xl mx-auto mt-16 px-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-rose-500 to-pink-500"></div>
            <h2 className="text-xl font-semibold tracking-tight">Trailer</h2>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl aspect-video">
            <iframe src={`https://www.youtube.com/embed/${videoKey}`} className="w-full h-full" allowFullScreen loading="lazy"></iframe>
          </div>
        </div>
      )}

      {cast.length > 0 && (
        <div className="max-w-6xl mx-auto mt-16 px-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-rose-500 to-pink-500"></div>
            <h2 className="text-xl font-semibold tracking-tight">Top Cast</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {cast.map((actor: any) => (
              <div key={actor.id} className="w-[130px] flex-shrink-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2.5">
                <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} className="w-full h-[170px] object-cover rounded-xl mb-2" />
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-100 truncate">{actor.name}</p>
                  <p className="text-xs text-slate-500 truncate">{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}