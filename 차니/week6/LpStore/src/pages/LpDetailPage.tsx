import { useParams } from "react-router-dom";
import { useLpDetail } from "../hooks/queries/useLpDetail";
import QueryState from "../components/QueryState";
import { useEffect, useMemo, useState } from "react";
import useLpCommentsInfinite from "../hooks/queries/useGetInfiniteCommentList";
import useInView from "../hooks/useInview";
import CommentInputBar from "../components/CommentInputBar";
import CommentCard from "../components/CommentCards/CommentCard";
import LpDetailSkeleton from "../components/LpDetailSkeleton";
import CommentSkeletonList from "../components/CommentCards/CommentCardSkeletonList";

function timeAgo(date: Date | string) {
  const d = new Date(date);
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days} days ago`;
}

function EditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M3 21h4.5L19.06 9.44a1.5 1.5 0 0 0 0-2.12l-2.38-2.38a1.5 1.5 0 0 0-2.12 0L3 16.5V21z"
        fill="currentColor"
      />
      <path d="M14.06 5.94 18.06 9.94" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M9 3h6l1 2h4v2H4V5h4l1-2z" fill="currentColor" />
      <path
        d="M6 9h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9z"
        fill="currentColor"
      />
    </svg>
  );
}

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M12 21s-6.7-4.33-9.33-7a6 6 0 0 1 8.49-8.49L12 6.35l.84-.84a6 6 0 0 1 8.49 8.49C18.7 16.67 12 21 12 21z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function LpDetailPage() {
  const { lpId } = useParams<{ lpId: string }>();
  const { data, isLoading, isFetching, isError, error, refetch } = useLpDetail(
    lpId!
  );

  const lp = data?.data;

  // 댓글 정렬
  const [commentOrder, setCommentOrder] = useState<"asc" | "desc">("desc");
  const cParams = useMemo(
    () => ({ id: String(lpId), order: commentOrder, limit: 20 }),
    [lpId, commentOrder]
  );

  // 댓글 무한쿼리
  const {
    data: cdata,
    isPending: cPending,
    isFetchingNextPage: cFetchingNext,
    hasNextPage: cHasNext,
    fetchNextPage: cFetchNext,
  } = useLpCommentsInfinite(cParams.id, cParams.limit, cParams.order);

  // 하단 트리거
  const { ref: moreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "500px 0px 500px 0px",
  });

  useEffect(() => {
    if (inView && cHasNext && !cFetchingNext) cFetchNext();
  }, [inView, cHasNext, cFetchingNext, cFetchNext]);

  const comments = cdata?.pages.flatMap((p) => p.data.data) ?? [];

  return (
    <div className="min-h-dvh bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          fallback={<LpDetailSkeleton />}
          onRetry={() => refetch()}
        >
          {lp && (
            <article className="rounded-2xl bg-neutral-900 p-6 shadow-xl flex flex-col gap-10 px-28">
              <div className="flex items-center justify-center gap-3">
                <img
                  src={lp.author?.avatar ?? "https://placehold.co/40x40"}
                  alt={lp.author?.name ?? "author"}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex justify-between flex-1">
                  <span className="text-lg font-semibold">
                    {lp.author?.name ?? "작성자"}
                  </span>
                  <span className="text-lg">{timeAgo(lp.createdAt)}</span>
                </div>
              </div>

              {/* 제목 */}
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{lp.title}</span>
                <div className="flex items-center gap-2 text-white">
                  <button className="rounded-md px-2 py-1" title="수정">
                    <EditIcon className="h-6 w-6" />
                  </button>
                  <button className="rounded-md px-2 py-1" title="삭제">
                    <TrashIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* 썸네일 */}
              <>
                <div className="mx-auto max-w-xl overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={lp.thumbnail}
                    alt={lp.title}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* 백그라운드 갱신 배지 */}
                {isFetching && !isLoading && (
                  <p className="mt-2 text-xs opacity-70">갱신 중…</p>
                )}
              </>

              {/* 본문 */}
              {lp.content && (
                <span className="whitespace-pre-wrap leading-7">
                  {lp.content}
                </span>
              )}

              {/* 좋아요 & 액션 바 */}
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <button className="rounded-full bg-pink-600 px-4 py-2 text-sm font-medium hover:bg-pink-500 flex items-center gap-3">
                    <HeartIcon className="w-6 h-6" /> 좋아요
                  </button>
                  <span className="text-sm opacity-80">
                    {lp.likes?.length ?? 0}
                  </span>
                </div>
              </div>

              <section className="mt-2">
                <h3 className="text-lg font-semibold mb-3">댓글</h3>

                <CommentInputBar
                  lpId={String(lpId)}
                  order={commentOrder}
                  onChangeOrder={setCommentOrder}
                />

                <div className="mt-4 rounded-2xl bg-neutral-800/40 p-4">
                  {/* 상단 스켈레톤 */}
                  {cPending && <CommentSkeletonList count={8} />}

                  {/* 목록 */}
                  {!cPending && comments.length > 0 && (
                    <>
                      {comments.map((comment) => (
                        <CommentCard key={comment.id} comment={comment} />
                      ))}

                      {/* 하단 스켈레톤 */}
                      {cFetchingNext && <CommentSkeletonList count={5} />}

                      <div ref={moreRef} className="h-2" />
                    </>
                  )}

                  {!cPending && comments.length === 0 && (
                    <p className="text-sm opacity-70 px-1 py-6 text-center">
                      첫 댓글을 남겨보세요.
                    </p>
                  )}
                </div>
              </section>
            </article>
          )}
        </QueryState>
      </div>
    </div>
  );
}
