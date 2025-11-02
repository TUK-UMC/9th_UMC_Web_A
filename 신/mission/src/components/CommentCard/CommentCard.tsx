import type { Comment } from "../../types/comment";

interface CommentCardProps {
  comment: Comment;
}

const CommentCard = ({ comment }: CommentCardProps) => {
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
          {/* 케밥 메뉴 */}
          <button className="text-gray-400 hover:text-white transition-colors p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        </div>
        <p className="text-gray-300 break-words">{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentCard;
