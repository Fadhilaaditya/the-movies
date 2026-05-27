// File: components/SearchResultCard.tsx

'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';

interface SearchResultCardProps {
  item: {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string;
    backdrop_path?: string;
    vote_average?: number;
    media_type: 'movie' | 'tv';
  };
}

export default function SearchResultCard({ item }: SearchResultCardProps) {
  const title = item.title || item.name;
  const image = item.poster_path || item.backdrop_path;
  const rating = item.vote_average?.toFixed(1) || 'N/A';
  const link = item.media_type === 'movie' ? `/Movie/${item.id}` : `/Tv/${item.id}`;

  return (
    <Link href={link} className="group block">
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/5 shadow-lg hover:shadow-rose-500/10 hover:shadow-xl hover:scale-[1.03] hover:border-white/10 transition-all duration-300">
        <span className="absolute top-2.5 left-2.5 z-10 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-slate-300 uppercase tracking-wider">
          {item.media_type}
        </span>

        {image ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${image}`}
            alt={title}
            className="w-full h-auto object-cover"
          />
        ) : (
          <div className="w-full h-[300px] bg-slate-800 flex items-center justify-center text-sm text-slate-500">
            No image
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <p className="text-white text-sm font-medium leading-tight line-clamp-2">{title}</p>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 4l10 6-10 6V4z" />
            </svg>
          </div>
        </div>

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-white/10 text-white text-xs font-medium px-2 py-0.5 rounded-full">
          <Star size={11} className="fill-yellow-400 text-yellow-400" />
          {rating}
        </div>
      </div>
    </Link>
  );
}
