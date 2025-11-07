import { useState, useRef, useEffect } from "react";
import type { Comment } from "../../types/comment";
import useUpdateComment from "../../hooks/mutations/useUpdateComment";
import useDeleteComment from "../../hooks/mutations/useDeleteComment";
import useGetMyInfo from "../../hooks/queries/useGetMyInfo";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../../constants/key";

interface CommentCardProps {
  comment: Comment;
}

const CommentCard = ({ comment }: CommentCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const menuRef = useRef<HTMLDivElement>(null);

  const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const accessToken = getItem();

  const { data: myInfo } = useGetMyInfo(accessToken);
  const { mutateAsync: updateComment } = useUpdateComment();
  const { mutateAsync: deleteComment } = useDeleteComment();

  // 내 댓글인지 확인
  const isMyComment = myInfo?.id === comment.authorId;

  // 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      try {
        await deleteComment({
          lpId: String(comment.lpId),
          commentId: String(comment.id),
        });
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        alert("댓글 삭제에 실패했습니다.");
      }
    }
    setShowMenu(false);
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      await updateComment({
        lpId: String(comment.lpId),
        commentId: String(comment.id),
        content: editContent.trim(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div
      key={comment.id}
      className="flex gap-3 pb-4 border-b border-gray-700 last:border-b-0"
    >
      {/* 프로필 이미지 */}
      <img
        src={comment.author.avatar}
        alt={comment.author.name}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
      />

      {/* 댓글 내용 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-white">{comment.author.name}</h3>

          {/* 케밥 메뉴 - 내 댓글일 때만 표시 */}
          {isMyComment && !isEditing && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
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

              {/* 수정/삭제 메뉴 */}
              {showMenu && (
                <div className="absolute right-0 top-8 bg-[#2a2a2a] rounded-lg shadow-lg border border-gray-700 overflow-hidden z-10 min-w-[100px]">
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    삭제
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 수정 모드 체크 버튼 */}
          {isEditing && (
            <button
              onClick={handleUpdate}
              className="text-white hover:text-gray-300 transition-colors p-1 cursor-pointer"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </button>
          )}
        </div>

        {/* 댓글 내용 또는 편집 입력창 */}
        {isEditing ? (
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleUpdate();
              } else if (e.key === "Escape") {
                handleCancelEdit();
              }
            }}
            className="w-full bg-[#3a3a3a] border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-gray-500"
            autoFocus
          />
        ) : (
          <p className="text-gray-300 break-words">{comment.content}</p>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
