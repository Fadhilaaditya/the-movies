// File: app/(home)/NowPlaying.tsx

import SearchResultCard from '../ui/SearchResultCard';
import axios from 'axios';

export default async function NowPlaying() {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`
  );
  const movies = res.data.results;
  return (
    <section className="py-12 max-w-7xl mx-auto px-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-rose-500 to-pink-500"></div>
        <h2 className="text-xl font-semibold text-white tracking-tight">Now Playing</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie: any) => (
          <SearchResultCard
            key={`movie-${movie.id}`}
            item={{
              ...movie,
              media_type: 'movie',
              title: movie.title,
              poster_path: movie.poster_path,
              vote_average: movie.vote_average
            }}
          />
        ))}
      </div>
    </section>
  );
}