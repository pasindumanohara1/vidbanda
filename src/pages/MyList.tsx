import React from 'react';
import { useList } from '../context/ListContext';
import { MediaCard } from '../components/common/MediaCard';
import { Bookmark } from 'lucide-react';

export const MyList: React.FC = () => {
  const { myList } = useList();

  return (
    <div className="container mx-auto px-4 md:px-6 pt-28 pb-8">
      <div className="flex items-center gap-3 mb-8">
        <Bookmark size={32} className="text-blue-500" />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My List</h1>
      </div>

      {myList.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
          {myList.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-slate-500 dark:text-slate-400 text-center">
          <div className="relative mb-6">
            <img src="/logo.png" alt="Vidbanda" className="w-24 h-24 opacity-20 grayscale" />
            <Bookmark size={32} className="absolute -bottom-2 -right-2 text-slate-300 dark:text-slate-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-white">Your list is empty</h2>
          <p className="max-w-md">
            Save shows and movies to keep track of what you want to watch.
            Click the + button on any title to add it to your list.
          </p>
        </div>
      )}
    </div>
  );
};
