import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import useGetCommentList from "../hooks/queries/useGetCommentList";
import { PAGINATION_ORDER } from "../enums/common";
import type { PaginationOrder } from "../enums/common";
import ErrorState from "../components/ErrorState";
import CommentCard from "../components/CommentCard/CommentCard";
import CommentCardSkeletonList from "../components/CommentCard/CommentCardSkeletonList";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import useCreateComment from "../hooks/mutations/useCreateComment";

const schema = z.object({
  content: z.string().min(1, { message: "댓글 내용을 입력해주세요." }),
});

type FormFields = z.infer<typeof schema>;

const CommentPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const [order, setOrder] = useState<PaginationOrder>(PAGINATION_ORDER.desc);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { mutateAsync: createComment } = useCreateComment();

  const {
    data: comments,
    isPending,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useGetCommentList(lpId!, 5, order);

  const { ref, inView } = useInView({ threshold: 0 });

  // 무한 스크롤
  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetching]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await createComment({
        lpId: lpId!,
        content: data.content,
      });
      reset(); // 입력창 초기화
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  if (isError) {
    return (
      <ErrorState
        message="댓글을 불러오는데 실패했습니다."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="relative p-6 max-w-4xl mx-auto">
      {/* 댓글 카드 */}
      <div className="relative bg-[#2a2a2a] rounded-2xl p-8">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-white text-2xl font-bold mb-6">댓글</h1>

          {/* 정렬 버튼 */}
          <div className="flex justify-end gap-2 mb-6">
            <button
              onClick={() => setOrder(PAGINATION_ORDER.asc)}
              className={`px-4 py-2 rounded-md transition-colors ${
                order === PAGINATION_ORDER.asc
                  ? "bg-white text-black"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              오래된순
            </button>
            <button
              onClick={() => setOrder(PAGINATION_ORDER.desc)}
              className={`px-4 py-2 rounded-md transition-colors ${
                order === PAGINATION_ORDER.desc
                  ? "bg-white text-black"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              최신순
            </button>
          </div>

          {/* 댓글 입력 영역 */}
          <div className="flex flex-col gap-2 mb-8">
            <div className="flex gap-2">
              <input
                {...register("content")}
                type="text"
                placeholder="댓글을 입력해주세요"
                className={`flex-1 bg-[#3a3a3a] border ${
                  errors.content ? "border-red-500" : "border-gray-700"
                } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors`}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "작성 중..." : "작성"}
              </button>
            </div>
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>
        </div>

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {isPending && <CommentCardSkeletonList count={5} />}
          {comments?.pages?.map((page) =>
            page.data.data?.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))
          )}
          {isFetching && <CommentCardSkeletonList count={5} />}
          <div ref={ref} className="h-2" />
        </div>
      </div>
    </div>
  );
};

export default CommentPage;
