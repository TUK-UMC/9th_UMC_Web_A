import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import Layout from './components/Layout';
import { fetchLpDetail } from './api/lpApi';
import { fetchCommentList } from './api/commentApi';
import { useAuth } from './hooks/useAuth';
import LpCardSkeleton from './components/LpCardSkeleton';
import type { CommentListResponse, Comment } from './types/auth';

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commentOrder, setCommentOrder] = useState<'asc' | 'desc'>('desc');
  const commentObserverRef = useRef<HTMLDivElement | null>(null);

  // useQuery로 LP 상세 정보 불러오기
  const {
    data: response,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['lp', lpId], // lpId를 queryKey에 포함
    queryFn: async () => {
      if (!lpId) throw new Error('LP ID가 없습니다.');
      return await fetchLpDetail(Number(lpId));
    },
    enabled: !!lpId, // lpId가 있을 때만 실행
  });

  const lp = response?.data;

  // useInfiniteQuery로 댓글 목록 불러오기
  const {
    data: commentData,
    fetchNextPage: fetchNextComments,
    hasNextPage: hasNextComments,
    isFetchingNextPage: isFetchingNextComments,
    isLoading: isLoadingComments,
    isError: isErrorComments,
  } = useInfiniteQuery<CommentListResponse>({
    queryKey: ['lpComments', lpId, commentOrder], // lpId와 order를 queryKey에 포함
    queryFn: async ({ pageParam }) => {
      if (!lpId) throw new Error('LP ID가 없습니다.');
      
      const response = await fetchCommentList(Number(lpId), {
        limit: 10,
        order: commentOrder,
        cursor: pageParam as number | undefined,
      });
      
      if (response.status && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || '댓글을 불러올 수 없습니다.');
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
    enabled: !!lpId,
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

  const isOwner = lp && user && lp.authorId === user.id;
  const comments = commentData?.pages.flatMap((page) => page.data) || [];

  // Intersection Observer를 통한 댓글 무한 스크롤
  const handleCommentObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextComments && !isFetchingNextComments) {
      fetchNextComments();
    }
  }, [hasNextComments, isFetchingNextComments, fetchNextComments]);

  useEffect(() => {
    const element = commentObserverRef.current;
    const option = { threshold: 0 };

    if (!element) return;

    const observer = new IntersectionObserver(handleCommentObserver, option);
    observer.observe(element);

    return () => observer.disconnect();
  }, [handleCommentObserver]);

  // 로딩 상태
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-400">LP 정보를 불러오는 중...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 text-center">
            <p className="text-red-400 mb-4">
              {error instanceof Error ? error.message : 'LP 정보를 불러올 수 없습니다.'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!lp) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">LP를 찾을 수 없습니다.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="text-2xl text-white hover:text-gray-300 mb-6 transition-colors"
        >
          ←
        </button>

        {/* LP 정보 */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
          {/* 썸네일 */}
          <div className="aspect-video bg-gray-800 relative overflow-hidden">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          {/* 콘텐츠 */}
          <div className="p-8">
            {/* 제목 */}
            <h1 className="text-4xl font-bold mb-4 text-white">{lp.title}</h1>

            {/* 메타 정보 */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-400">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(lp.createdAt)}
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                {lp.likes.length}
              </span>
            </div>

            {/* 태그 */}
            {lp.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {lp.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* 본문 */}
            <div className="prose prose-invert max-w-none mb-8">
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                {lp.content}
              </p>
            </div>

            {/* 작성자 정보 */}
            <div className="border-t border-gray-800 pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-xl font-bold text-white">
                  {lp.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{lp.author.name}</h3>
                  <p className="text-gray-400 text-sm">{lp.author.email}</p>
                </div>
              </div>
            </div>

            {/* 액션 버튼 (작성자만) */}
            {isOwner && (
              <div className="flex gap-4 mt-8 border-t border-gray-800 pt-6">
                <button className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                  ✏️ 수정
                </button>
                <button className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors">
                  🗑️ 삭제
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="mt-8">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            {/* 댓글 헤더 */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">댓글</h2>
              </div>

              {/* 정렬 버튼 */}
              <div className="flex gap-2">
                <button
                  onClick={() => setCommentOrder('desc')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    commentOrder === 'desc'
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  최신순
                </button>
                <button
                  onClick={() => setCommentOrder('asc')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    commentOrder === 'asc'
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  오래된순
                </button>
              </div>
            </div>

            {/* 댓글 작성란 */}
            <div className="p-6 border-b border-gray-800">
              <textarea
                placeholder="댓글을 입력하세요..."
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-3">
                <button className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors">
                  댓글 작성
                </button>
              </div>
            </div>

            {/* 댓글 목록 */}
            <div className="divide-y divide-gray-800">
              {/* 초기 로딩 */}
              {isLoadingComments && comments.length === 0 && (
                <div className="p-6 space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-800 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-800 rounded w-1/4 mb-2"></div>
                          <div className="h-4 bg-gray-800 rounded w-full mb-1"></div>
                          <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 댓글 목록 */}
              {comments.map((comment) => (
                <div key={comment.id} className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {comment.author.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-semibold">{comment.author.name}</span>
                        <span className="text-gray-500 text-sm">{formatTimeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* 빈 상태 */}
              {!isLoadingComments && comments.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-gray-400">아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!</p>
                </div>
              )}
            </div>

            {/* 추가 로딩 스켈레톤 */}
            {isFetchingNextComments && (
              <div className="p-6 border-t border-gray-800 space-y-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-800 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-800 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 무한 스크롤 옵저버 */}
            {hasNextComments && <div ref={commentObserverRef} className="h-10" />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LpDetailPage;

