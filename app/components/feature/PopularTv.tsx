import axios from "axios";
import SearchResultCard from "./../ui/SearchResultCard"; // pastikan path benar

export default async function PopularTv() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const response = await axios.get(
    `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`
  );
  const tvShows = response.data.results;

  return (
    <section className="py-12 max-w-7xl mx-auto px-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-rose-500 to-pink-500"></div>
        <h2 className="text-xl font-semibold text-white tracking-tight">Popular TV Shows</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tvShows.map((show: any) => (
          <SearchResultCard
            key={`tv-${show.id}`}
            item={{
              ...show,
              media_type: "tv",
            }}
          />
        ))}
      </div>
    </section>
  );
}
