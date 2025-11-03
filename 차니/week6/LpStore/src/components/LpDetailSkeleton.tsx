import CommentSkeletonList from "./CommentCards/CommentCardSkeletonList";

export default function LpDetailSkeleton() {
  return (
    <article
      className="rounded-2xl bg-neutral-900 p-6 shadow-xl flex flex-col gap-10 w-full"
      aria-hidden
    >
      {/* 헤더(아바타, 작성자, 시간) */}
      <div className="flex items-center justify-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/10 animate-pulse" />
        <div className="flex justify-between flex-1 items-center">
          <div className="h-4 w-32 bg-white/15 rounded animate-pulse" />
          <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
        </div>
      </div>

      {/* 제목 + 액션 */}
      <div className="flex justify-between items-center">
        <div className="h-6 w-60 bg-white/15 rounded animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-white/10 rounded animate-pulse" />
          <div className="h-6 w-6 bg-white/10 rounded animate-pulse" />
        </div>
      </div>

      {/* 썸네일 */}
      <div className="mx-auto max-w-xl overflow-hidden rounded-xl shadow-lg">
        <div className="aspect-[4/3] w-full bg-white/10 animate-pulse" />
      </div>

      {/* 본문 */}
      <div className="space-y-3">
        <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-11/12 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-white/10 rounded animate-pulse" />
      </div>

      {/* 좋아요 바 */}
      <div className="flex items-center justify-center">
        <div className="h-8 w-28 bg-white/10 rounded-full animate-pulse" />
      </div>

      {/* 댓글 섹션 */}
      <section className="mt-2">
        <div className="h-5 w-16 bg-white/15 rounded animate-pulse mb-3" />
        {/* 입력바 대체 */}
        <div className="rounded-xl bg-neutral-800/40 p-3 mb-3">
          <div className="h-10 w-full bg-white/10 rounded animate-pulse" />
        </div>
        <div className="mt-4 rounded-2xl bg-neutral-800/40 p-4">
          <CommentSkeletonList count={8} />
        </div>
      </section>
    </article>
  );
}
