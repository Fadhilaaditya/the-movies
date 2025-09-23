import axios from "axios";
import SearchResultCard from "./../ui/SearchResultCard"; // pastikan path benar

export default async function PopularMovies() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const response = await axios.get(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
  );
  const movies = response.data.results;

  return (
    <section className="py-10 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-red-600"></div>
            <h2 className="text-2xl text-white font-bold">Popular Movies</h2>
          </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie: any) => (
          <SearchResultCard
            key={`popular-${movie.id}`}
            item={{
              ...movie,
              media_type: "movie", // ensure correct route handling
            }}
          />
        ))}
      </div>
    </section>
  );
}
