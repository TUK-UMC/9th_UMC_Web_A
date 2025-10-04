import { NavLink } from 'react-router-dom';
import { useMovieContext } from '../contexts';
import { ROUTES } from '../config/routes';

// 카테고리 정보
const CATEGORIES = {
  [ROUTES.HOME]: { label: '홈' },
  [ROUTES.POPULAR]: { label: '인기 영화' },
  [ROUTES.TOP_RATED]: { label: '평점 높은' },
  [ROUTES.UPCOMING]: { label: '개봉 예정' },
  [ROUTES.NOW_PLAYING]: { label: '상영 중' },
} as const;

export const Header = () => {
  const { 
    currentPage, 
    totalPages, 
    setCurrentPage 
  } = useMovieContext();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        {/* 카테고리 네비게이션 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <nav className="flex flex-wrap gap-2">
            {Object.entries(CATEGORIES).map(([path, category]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`
                }
              >
                {category.label}
              </NavLink>
            ))}
          </nav>
          
          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                ←
              </button>
              <span className="text-white text-sm">
                {currentPage}페이지
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
