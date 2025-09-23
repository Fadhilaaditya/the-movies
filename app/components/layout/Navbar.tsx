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

  // Handle scroll effect for transparency
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
      className={`fixed top-0 left-0 right-0 z-50 text-white px-6 py-4 transition-all duration-300 ${
        isScrolled 
          ? 'bg-zinc-950/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo & Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-3xl font-bold text-red-600 tracking-tight">
            THE MOVIES
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <Link href="/Movie" className="flex items-center gap-1 hover:text-white transition">
              <Film size={16} /> Movies
            </Link>
            <Link href="/Tv" className="flex items-center gap-1 hover:text-white transition">
              <Tv size={16} /> TV Series
            </Link>

            {/* Desktop Genre Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-white transition">
                <Folder size={16} /> Genre <ChevronDown size={14} />
              </button>
              <div className="absolute z-10 hidden group-hover:block bg-zinc-800/95 backdrop-blur-md text-sm rounded-lg mt-2 shadow-lg max-h-60 overflow-y-auto w-48 border border-zinc-700">
                {genres.map((genre) => (
                  <Link
                    key={genre.id}
                    href={`/genre/${genre.id}`}
                    className="block px-4 py-2 hover:bg-zinc-700 rounded transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/realease-year" className="flex items-center gap-1 hover:text-white transition">
              <CalendarDays size={16} /> Year
            </Link>
          </nav>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:block relative w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search..."
            className={`w-full pl-4 pr-10 py-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-all ${
              isScrolled 
                ? 'bg-zinc-800 text-white' 
                : 'bg-white/10 backdrop-blur-sm text-white placeholder-gray-300'
            }`}
          />
          <button onClick={handleSearch}>
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer" size={16} />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 px-4 space-y-3 bg-zinc-950/95 backdrop-blur-md rounded-lg border border-zinc-800">
          <Link href="/Movie" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white py-2">
            <Film size={16} /> Movies
          </Link>
          <Link href="/Tv" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white py-2">
            <Tv size={16} /> TV Series
          </Link>

          {/* Collapsible Genre List */}
          <button
            onClick={() => setGenreOpen(!genreOpen)}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white py-2 w-full text-left"
          >
            <Folder size={16} /> Genre <ChevronDown size={14} className={`transition-transform ${genreOpen ? 'rotate-180' : ''}`} />
          </button>
          {genreOpen && (
            <div className="ml-4 space-y-1 max-h-40 overflow-y-auto">
              {genres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/genre/${genre.id}`}
                  className="block text-sm text-gray-400 hover:text-white py-1"
                  onClick={() => setIsOpen(false)}
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          )}

          <Link href="/realease-year" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white py-2">
            <CalendarDays size={16} /> Year
          </Link>

          {/* Mobile Search */}
          <div className="relative mt-3 pb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search..."
              className="w-full pl-4 pr-10 py-2 bg-zinc-800 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button onClick={handleSearch}>
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer" size={16} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}