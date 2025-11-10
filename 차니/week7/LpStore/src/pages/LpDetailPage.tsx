import { useNavigate, useParams } from "react-router-dom";
import { useLpDetail } from "../hooks/queries/useLpDetail";
import QueryState from "../components/QueryState";
import { useEffect, useMemo, useState } from "react";
import useLpCommentsInfinite from "../hooks/queries/useGetInfiniteCommentList";
import useInView from "../hooks/useInview";
import CommentInputBar from "../components/CommentInputBar";
import CommentCard from "../components/CommentCards/CommentCard";
import LpDetailSkeleton from "../components/LpDetailSkeleton";
import CommentSkeletonList from "../components/CommentCards/CommentCardSkeletonList";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyInfo } from "../api/auth";
import type { UpdateLpBody } from "../types/lp.types";
import { deleteLp, updateLp, uploadImage } from "../api/lp";

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

  const { currentUserId } = useAuth();

  const lp = data?.data;

  const navigate = useNavigate();
  const qc = useQueryClient();

  const [me, setMe] = useState<{ id: number } | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const r = await getMyInfo();
        setMe({ id: r.data.id });
      } catch {
        setMe(null);
      }
    })();
  }, []);

  const isMine = !!(lp && me && lp.authorId === me.id); // 내 글만 버튼 노출

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<UpdateLpBody>({
    title: "",
    content: "",
    thumbnail: "",
    tags: [],
    published: true,
  });

  // 파일 업로드용 상태
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  useEffect(() => {
    if (lp) {
      setForm({
        title: lp.title,
        content: lp.content,
        thumbnail: lp.thumbnail,
        tags: lp.tags?.map((t) => t.name) ?? [],
        published: lp.published,
      });
      setThumbnailFile(null);
      setThumbnailPreview(lp.thumbnail ?? "");
    }
  }, [lp]);

  // 미리보기 URL 메모리 정리
  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  // 수정
  const updateMutation = useMutation({
    mutationFn: (body: UpdateLpBody) => updateLp(Number(lpId), body),
    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (q) => {
          const k = q.queryKey;
          return Array.isArray(k) && (k.includes("lp") || k.includes("lps"));
        },
      });
    },
  });

  // 삭제
  const deleteMutation = useMutation({
    mutationFn: () => deleteLp(Number(lpId)),
    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (q) => {
          const k = q.queryKey;
          return Array.isArray(k) && (k.includes("lp") || k.includes("lps"));
        },
      });
      navigate("/"); // 삭제 후 홈으로 이동
    },
  });

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      alert("이미지 파일을 선택해주세요.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }
    setThumbnailFile(f);
    const url = URL.createObjectURL(f);
    setThumbnailPreview((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const closeEditModal = () => {
    setEditOpen(false);
    // 파일 선택 취소 시 원래 썸네일로 복귀
    setThumbnailFile(null);
    setThumbnailPreview(form.thumbnail ?? "");
  };

  const handleEditSubmit = async () => {
    let thumbnailUrl = form.thumbnail ?? "";

    // 새 파일 선택 시: 업로드 먼저 (/v1/uploads)
    if (thumbnailFile) {
      try {
        thumbnailUrl = await uploadImage(thumbnailFile);
      } catch {
        alert("이미지 업로드에 실패했어요. 잠시 후 다시 시도해주세요.");
        return;
      }
    }

    await updateMutation.mutateAsync({
      ...form,
      thumbnail: thumbnailUrl,
    });

    setEditOpen(false);

    // blob URL 정리
    if (
      thumbnailFile &&
      thumbnailPreview &&
      thumbnailPreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailFile(null);
  };

  const handleDelete = async () => {
    const ok = window.confirm("정말 삭제할까요?");
    if (!ok) return;
    await deleteMutation.mutateAsync();
  };

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
                {isMine && (
                  <div>
                    <button
                      className="rounded-md px-2 py-1"
                      title="수정"
                      onClick={() => setEditOpen(true)}
                    >
                      <EditIcon className="h-6 w-6" />
                    </button>
                    <button
                      className="rounded-md px-2 py-1"
                      title="삭제"
                      onClick={handleDelete}
                    >
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </div>
                )}
                {editOpen && (
                  <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center">
                    <div className="w-full max-w-xl rounded-xl bg-neutral-900 p-5 space-y-3">
                      <h4 className="text-lg font-semibold">LP 수정</h4>

                      <input
                        className="w-full rounded-md bg-neutral-800 px-3 py-2"
                        placeholder="제목"
                        value={form.title ?? ""}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, title: e.target.value }))
                        }
                      />
                      <textarea
                        className="w-full h-40 rounded-md bg-neutral-800 px-3 py-2"
                        placeholder="본문"
                        value={form.content ?? ""}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, content: e.target.value }))
                        }
                      />

                      {/* 이미지 업로드 */}
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={onPickFile}
                          className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-white hover:file:bg-white/20"
                        />
                        {thumbnailPreview ? (
                          <img
                            src={thumbnailPreview}
                            alt="thumbnail preview"
                            className="mt-2 max-h-40 rounded-md object-cover"
                          />
                        ) : (
                          <p className="text-xs text-neutral-400">
                            선택된 이미지가 없어요. 기존 URL을 사용합니다.
                          </p>
                        )}
                      </div>

                      <input
                        className="w-full rounded-md bg-neutral-800 px-3 py-2"
                        placeholder="태그(콤마로 구분)"
                        value={(form.tags ?? []).join(",")}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            tags: e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          }))
                        }
                      />

                      <div className="flex justify-end gap-2">
                        <button
                          className="rounded-md px-3 py-2 bg-white/10"
                          onClick={closeEditModal}
                        >
                          취소
                        </button>
                        <button
                          className="rounded-md px-3 py-2 bg-pink-600 disabled:opacity-50"
                          onClick={handleEditSubmit}
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? "저장 중…" : "저장"}
                        </button>
                      </div>

                      {(updateMutation.isError || deleteMutation.isError) && (
                        <p className="text-red-300 text-sm">
                          저장/삭제에 실패했어요. 잠시 후 다시 시도해주세요.
                        </p>
                      )}
                    </div>
                  </div>
                )}
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
                        <CommentCard
                          key={comment.id}
                          lpId={String(lpId)}
                          comment={comment}
                          isMine={currentUserId === comment.authorId}
                        />
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

                  <div ref={moreRef} className="h-2" />
                </div>
              </section>
            </article>
          )}
        </QueryState>
      </div>
    </div>
  );
}
