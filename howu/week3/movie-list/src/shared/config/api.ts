// API 설정
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_MOVIE_API_BASE_URL || 'https://api.themoviedb.org/3',
  ACCESS_TOKEN: import.meta.env.VITE_MOVIE_API_KEY, // Bearer 토큰으로 사용
  IMAGE_BASE_URL: import.meta.env.VITE_MOVIE_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p',
  IMAGE_SIZES: {
    SMALL: 'w200',
    MEDIUM: 'w500',
    LARGE: 'w1280',
    ORIGINAL: 'original'
  }
} as const;

// 이미지 URL 생성 헬퍼
export const getImageUrl = (path: string | null, size: keyof typeof API_CONFIG.IMAGE_SIZES = 'MEDIUM') => {
  if (!path) return '';
  return `${API_CONFIG.IMAGE_BASE_URL}/${API_CONFIG.IMAGE_SIZES[size]}${path}`;
};

// API 토큰 검증
if (!API_CONFIG.ACCESS_TOKEN) {
  console.warn('VITE_MOVIE_API_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요.');
}
