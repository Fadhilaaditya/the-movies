'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, Film, Tv, Folder, CalendarDays, Search, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [genreOpen, setGenreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`
        );
        setGenres(res.data.genres);
      } catch (error) {
        console.error('Failed to load genres:', error);
      }
    }
    fetchGenres();
  }, [API_KEY]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/Search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 text-white transition-all duration-500 ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-bold tracking-tight bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            THE MOVIES
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            <Link href="/Movie" className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200">
              <Film size={15} /> Movies
            </Link>
            <Link href="/Tv" className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200">
              <Tv size={15} /> TV Series
            </Link>

            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200">
                <Folder size={15} /> Genre <ChevronDown size={12} />
              </button>
              <div className="absolute z-10 hidden group-hover:block top-full mt-2 bg-slate-900/95 backdrop-blur-xl text-sm rounded-2xl shadow-2xl shadow-black/40 max-h-72 overflow-y-auto w-52 border border-white/10 p-2 scrollbar-hide">
                {genres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/genre/${genre.id}`}
                    className="block px-4 py-2.5 hover:bg-white/5 rounded-xl transition-colors text-slate-300 hover:text-white"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/realease-year" className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200">
              <CalendarDays size={15} /> Year
            </Link>
          </nav>
        </div>

        <div className="hidden md:block relative w-56">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search..."
            className="w-full pl-4 pr-10 py-2 text-sm rounded-full bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all backdrop-blur-sm"
          />
          <button onClick={handleSearch} aria-label="Search">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer" size={15} />
          </button>
        </div>

        <button
          className="md:hidden text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden mx-4 mb-4 p-4 space-y-1 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 animate-fade-in">
          <Link href="/Movie" className="flex items-center gap-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 py-3 px-4 rounded-xl transition-all" onClick={() => setIsOpen(false)}>
            <Film size={16} /> Movies
          </Link>
          <Link href="/Tv" className="flex items-center gap-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 py-3 px-4 rounded-xl transition-all" onClick={() => setIsOpen(false)}>
            <Tv size={16} /> TV Series
          </Link>

          <button
            onClick={() => setGenreOpen(!genreOpen)}
            className="flex items-center gap-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 py-3 px-4 rounded-xl transition-all w-full text-left"
          >
            <Folder size={16} /> Genre <ChevronDown size={12} className={`ml-auto transition-transform duration-200 ${genreOpen ? 'rotate-180' : ''}`} />
          </button>
          {genreOpen && (
            <div className="ml-4 space-y-0.5 max-h-40 overflow-y-auto scrollbar-hide">
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/genre/${genre.id}`}
                  className="block text-sm text-slate-400 hover:text-white py-2 px-4 rounded-lg hover:bg-white/5 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          )}

          <Link href="/realease-year" className="flex items-center gap-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 py-3 px-4 rounded-xl transition-all" onClick={() => setIsOpen(false)}>
            <CalendarDays size={16} /> Year
          </Link>

          <div className="relative pt-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search..."
              className="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500/50 text-white placeholder-slate-500"
            />
            <button onClick={handleSearch} aria-label="Search">
              <Search className="absolute right-3 top-1/2 translate-y-[-25%] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer" size={15} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}