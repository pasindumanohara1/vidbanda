import React, { createContext, useContext, useEffect, useState } from 'react';
import { MediaItem } from '../types';

interface ListContextType {
  myList: MediaItem[];
  addToList: (item: MediaItem) => void;
  removeFromList: (id: number) => void;
  isInList: (id: number) => boolean;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export const ListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [myList, setMyList] = useState<MediaItem[]>(() => {
    try {
      const savedList = localStorage.getItem('vidbanda-list');
      return savedList ? JSON.parse(savedList) : [];
    } catch (error) {
      console.error('Failed to parse list from local storage', error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('vidbanda-list', JSON.stringify(myList));
  }, [myList]);

  const addToList = (item: MediaItem) => {
    setMyList((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromList = (id: number) => {
    setMyList((prev) => prev.filter((item) => item.id !== id));
  };

  const isInList = (id: number) => {
    return myList.some((item) => item.id === id);
  };

  return (
    <ListContext.Provider value={{ myList, addToList, removeFromList, isInList }}>
      {children}
    </ListContext.Provider>
  );
};

export const useList = () => {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error('useList must be used within a ListProvider');
  }
  return context;
};
