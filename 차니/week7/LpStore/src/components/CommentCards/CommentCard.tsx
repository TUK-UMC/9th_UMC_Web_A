import { useState } from "react";
import type { Comment } from "../../types/comment.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchComment, removeComment } from "../../api/comment";
import { QUERY_KEY } from "../../constants/key";

interface CommentCardProps {
  lpId: string;
  comment: Comment;
  isMine: boolean;
}

const CommentCard = ({ lpId, comment, isMine }: CommentCardProps) => {
  const qc = useQueryClient();

  const invalidateAndRefetch = async () => {
    await qc.invalidateQueries({ queryKey: [QUERY_KEY.comments, lpId] });
    await qc.refetchQueries({ queryKey: [QUERY_KEY.comments, lpId] });
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);

  // 댓글 수정
  const { mutateAsync: mutateUpdate, isPending: updating } = useMutation({
    mutationFn: (nextContent: string) =>
      patchComment({
        lpId: Number(lpId),
        commentId: comment.id,
        content: nextContent,
      }),
    onSuccess: async () => {
      setEditing(false);
      setMenuOpen(false);
      await invalidateAndRefetch();
    },
  });

  // 댓글 삭제
  const { mutateAsync: mutateDelete, isPending: deleting } = useMutation({
    mutationFn: () =>
      removeComment({ lpId: Number(lpId), commentId: comment.id }),
    onSuccess: async () => {
      setMenuOpen(false);
      await invalidateAndRefetch();
    },
  });

  const onSave = async () => {
    const v = draft.trim();
    if (!v || updating) return;
    await mutateUpdate(v);
  };

  return (
    <div
      key={comment.id}
      className="flex gap-3 pb-4 border-b border-gray-700 last:border-b-0"
    >
      <img
        src={comment.author?.avatar ?? ""}
        alt={comment.author?.name ?? "avatar"}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0 bg-white/10"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-white">
            {comment.author?.name ?? "익명"}
          </h3>

          {isMine && (
            <div className="relative">
              <button
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="12" cy="19" r="2" />
                </svg>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-1 w-28 rounded-md bg-neutral-800 shadow-lg ring-1 ring-white/10 z-10"
                >
                  <button
                    role="menuitem"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-white/10"
                    onClick={() => {
                      setEditing(true);
                      setMenuOpen(false);
                      setDraft(comment.content);
                    }}
                  >
                    수정
                  </button>
                  <button
                    role="menuitem"
                    className="w-full px-3 py-2 text-left text-sm text-red-300 hover:bg-white/10"
                    onClick={() => mutateDelete()}
                    disabled={deleting}
                  >
                    {deleting ? "삭제중…" : "삭제"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {!editing ? (
          <p className="text-gray-300 break-words whitespace-pre-wrap">
            {comment.content}
          </p>
        ) : (
          <div className="mt-2 flex gap-2">
            <input
              className="flex-1 rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm focus:border-white text-white"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={updating}
              maxLength={1000}
            />
            <button
              onClick={onSave}
              disabled={updating || draft.trim().length === 0}
              className="rounded-md bg-white text-black px-3 py-2 text-sm disabled:opacity-50"
            >
              {updating ? "저장중…" : "저장"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="rounded-md px-3 py-2 text-sm hover:bg-white/10"
            >
              취소
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
