import { useLocation } from 'react-router-dom';
import { MovieListWidget } from '../../widgets/movie-list';
import { useMovieContext } from '../../shared/contexts';
import { ROUTES } from '../../shared/config/routes';
import { useEffect } from 'react';

export const HomePage = () => {
  const location = useLocation();
  const { setCurrentCategory } = useMovieContext();

  // 경로에 따라 카테고리 설정
  useEffect(() => {
    const pathToCategory = {
      [ROUTES.HOME]: 'now_playing',
      [ROUTES.POPULAR]: 'popular',
      [ROUTES.TOP_RATED]: 'top_rated',
      [ROUTES.UPCOMING]: 'upcoming',
      [ROUTES.NOW_PLAYING]: 'now_playing',
    } as const;

    const category = pathToCategory[location.pathname as keyof typeof pathToCategory] || 'now_playing';
    setCurrentCategory(category);
  }, [location.pathname, setCurrentCategory]);

  return (
    <div className="min-h-screen bg-gray-900">
      <MovieListWidget />
    </div>
  );
};

