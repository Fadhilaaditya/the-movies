import PopularMovies from "./components/feature/PopularMovies";
import NowPlaying from "./components/feature/NowPlaying";
import PopularTv from "./components/feature/PopularTv";
import HeroSlider from "./components/feature/HeroSlider";

export default function Home() {
  return (
    <div>
      <HeroSlider />
      <NowPlaying />
      <PopularMovies />
      <PopularTv />
    </div>
  );
}
