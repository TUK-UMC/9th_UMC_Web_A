import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import Layout from './components/Layout';
import LpCardSkeletonGrid from './components/LpCardSkeleton';
import { fetchLpList } from './api/lpApi';
import type { LpItem, LpListResponse } from './types/auth';

const MainPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const observerRef = useRef<HTMLDivElement | null>(null);

  // useInfiniteQuery로 LP 목록 불러오기
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery<LpListResponse>({
    queryKey: ['lps', order, searchQuery], // 정렬과 검색어를 queryKey에 포함
    queryFn: async ({ pageParam }) => {
      const params: any = {
        limit: 10,
        order,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (pageParam) {
        params.cursor = pageParam;
      }

      const response = await fetchLpList(params);
      
      if (response.status && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'LP 목록을 불러올 수 없습니다.');
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor, // 다음 페이지 커서 반환
    initialPageParam: undefined, // 첫 페이지는 cursor 없이 시작
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return '방금 전';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}분 전`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}시간 전`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}일 전`;
    } else {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks}주 전`;
    }
  };

  // 모든 페이지의 데이터를 하나의 배열로 합치기
  const lpList = data?.pages.flatMap((page) => page.data) || [];

  // Intersection Observer를 통한 무한 스크롤
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const element = observerRef.current;
    const option = { threshold: 0 };

    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);

    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <Layout>
      {/* 검색 및 필터 */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* 검색 입력 */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 LP 제목이나 내용으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
            />
          </div>

          {/* 정렬 순서 */}
          <div className="flex gap-2">
            <button
              onClick={() => setOrder('desc')}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                order === 'desc'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-900 border border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setOrder('asc')}
              className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                order === 'asc'
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-900 border border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              오래된순
            </button>
          </div>
        </div>

        {/* 에러 상태 */}
        {isError && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 text-center mb-6">
            <p className="text-red-400 mb-4">
              {error instanceof Error ? error.message : 'LP 목록을 불러올 수 없습니다.'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* LP 그리드 */}
        {(lpList.length > 0 || isLoading) && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* 초기 로딩: 스켈레톤 UI */}
              {isLoading && lpList.length === 0 && <LpCardSkeletonGrid count={6} />}
              
              {/* 실제 데이터 */}
              {lpList.map((lp) => {
                const timeAgo = formatTimeAgo(lp.createdAt);
                return (
                  <div
                    key={lp.id}
                    className="bg-gray-900 rounded-lg overflow-hidden group cursor-pointer border border-gray-800 hover:border-pink-500 transition-colors"
                    onClick={() => navigate(`/lp/${lp.id}`)}
                  >
                    {/* 썸네일 */}
                    <div className="aspect-video bg-gray-800 relative overflow-hidden">
                      <img
                        src={lp.thumbnail}
                        alt={lp.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      
                      {/* 호버 오버레이 */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-semibold mb-1 line-clamp-2 text-base">{lp.title}</h3>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-300">{timeAgo}</span>
                            <span className="text-white">•</span>
                            <span className="text-white flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                              {lp.likes.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 추가 로딩: 스켈레톤 UI */}
            {isFetchingNextPage && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <LpCardSkeletonGrid count={3} />
              </div>
            )}

            {/* 무한 스크롤 옵저버 */}
            {hasNextPage && <div ref={observerRef} className="h-10" />}
          </>
        )}

        {/* 빈 상태 */}
        {!isLoading && lpList.length === 0 && !isError && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">표시할 LP가 없습니다.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MainPage;

