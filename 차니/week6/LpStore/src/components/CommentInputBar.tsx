import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../api/comment";
import { QUERY_KEY } from "../constants/key";

type Props = {
  lpId: string;
  order: "asc" | "desc";
  onChangeOrder: (v: "asc" | "desc") => void;
};

export default function CommentInputBar({ lpId, order, onChangeOrder }: Props) {
  const qc = useQueryClient();
  const [value, setValue] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: (content: string) => createComment({ lpId, content }),
    onSuccess: () => {
      setValue("");
      setHint(null);
      // 이 LP의 댓글 쿼리 전부 무효화 (오래된순/최신순 모두)
      qc.invalidateQueries({
        predicate: (q) => {
          const key = q.queryKey;
          return (
            Array.isArray(key) &&
            key[0] === QUERY_KEY.comments &&
            key[1] === lpId
          );
        },
      });
      inputRef.current?.focus();
    },
  });

  const onSubmit = async () => {
    const text = value.trim();
    if (!text) {
      setHint("댓글을 입력해주세요.");
      return;
    }
    if (text.length > 1000) {
      setHint("댓글은 1,000자 이하로 작성해주세요.");
      return;
    }
    try {
      await mutateAsync(text);
    } catch {
      // 에러 메시지는 아래 표시
    }
  };

  return (
    <div className="rounded-xl bg-neutral-800/70 p-3">
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (hint) setHint(null);
          }}
          placeholder="댓글을 입력해주세요"
          className="flex-1 rounded-md bg-neutral-700/60 px-3 py-2 text-sm placeholder:text-neutral-300/60 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-60"
          disabled={isPending}
        />
        <button
          onClick={onSubmit}
          disabled={isPending}
          className="rounded-md bg-white/10 px-3 py-2 text-sm hover:bg-white/20 disabled:opacity-50"
        >
          {isPending ? "작성 중..." : "작성"}
        </button>

        {/* 정렬 토글 */}
        <div className="ml-auto flex rounded-md ring-1 ring-white/30 overflow-hidden">
          <button
            onClick={() => onChangeOrder("asc")}
            className={`px-3 py-1.5 text-xs ${
              order === "asc"
                ? "bg-white text-black"
                : "bg-transparent text-white"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => onChangeOrder("desc")}
            className={`px-3 py-1.5 text-xs ${
              order === "desc"
                ? "bg-white text-black"
                : "bg-transparent text-white"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      {/* 유효성/에러 안내 */}
      {(hint || error) && (
        <p className="mt-2 text-xs text-red-300">
          {hint ??
            (error instanceof Error
              ? error.message
              : "댓글 작성에 실패했어요.")}
        </p>
      )}
    </div>
  );
}
