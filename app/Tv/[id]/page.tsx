import axios from "axios";
import Link from "next/link";
import TvEpisodesSection from "../../components/ui/TvEpisodeSection";

interface Params {
  params: {
    id: string;
  };
}

export default async function TvDetail({ params }: Params) {
  const id = params.id;
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
    <div className="bg-black mt-15 text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        {/* Backdrop */}
        {tv.backdrop_path && (
          <div className="absolute inset-0">
            <img
              src={`https://image.tmdb.org/t/p/w1920${tv.backdrop_path}`}
              alt={tv.name}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          </div>
        )}

        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={`https://image.tmdb.org/t/p/w300${tv.poster_path}`}
                alt={tv.name}
                className="w-48 md:w-56 rounded-lg shadow-2xl mx-auto md:mx-0"
              />
            </div>

            {/* Details */}
            <div className="flex-1">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{tv.name}</h1>
              
              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
                <span>{new Date(tv.first_air_date).getFullYear()}</span>
                <span className="text-red-500">Netflix</span> {/* You can make this dynamic */}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-yellow-400">{tv.vote_average.toFixed(1)}</span>
                  <div className="flex text-yellow-400">
                    {[...Array(10)].map((_, i) => (
                      <span key={i} className={i < Math.floor(tv.vote_average) ? "text-red-500" : "text-gray-600"}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">{tv.vote_count} votes</span>
                </div>
                <div className="text-gray-400 text-sm">Your rating: 0</div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {tv.genres.map((genre: any) => (
                  <span
                    key={genre.id}
                    className="bg-zinc-800 text-sm px-3 py-1 rounded text-gray-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <p className="text-gray-300 leading-relaxed mb-6 text-sm md:text-base">
                {tv.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href={`/Watch/${id}?type=tv&season=1&episode=1`}>
                  <button className="bg-red-600 hover:bg-red-700 transition px-6 py-2 rounded text-white font-medium">
                    Watch Now
                  </button>
                </Link>
                <button className="bg-zinc-800 hover:bg-zinc-700 transition px-6 py-2 rounded text-white">
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-6xl mx-auto px-4">
        <TvEpisodesSection tvId={id} seasons={tv.seasons} cast={cast} trailer={videoKey} overview={tv.overview} />
      </div>
    </div>
  );
}