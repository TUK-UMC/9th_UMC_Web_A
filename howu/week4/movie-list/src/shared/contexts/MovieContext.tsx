import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// 영화 카테고리 타입
export type MovieCategory =
  | "now_playing"
  | "popular"
  | "top_rated"
  | "upcoming";

interface MovieContextType {
  currentCategory: MovieCategory;
  currentPage: number;
  totalPages: number;
  setCurrentCategory: (category: MovieCategory) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

interface MovieProviderProps {
  children: ReactNode;
}

export const MovieProvider = ({ children }: MovieProviderProps) => {
  const [currentCategory, setCurrentCategory] =
    useState<MovieCategory>("now_playing");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  return (
    <MovieContext.Provider
      value={{
        currentCategory,
        currentPage,
        totalPages,
        setCurrentCategory,
        setCurrentPage,
        setTotalPages,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error("useMovieContext must be used within a MovieProvider");
  }
  return context;
};


