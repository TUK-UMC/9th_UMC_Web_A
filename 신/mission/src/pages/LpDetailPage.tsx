import { useNavigate, useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext";
import { Heart } from "lucide-react";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import { useState } from "react";
import usePatchLp from "../hooks/mutations/usePatchLp";
import useDeleteLp from "../hooks/mutations/useDeleteLp";
import { uploadImage } from "../apis/upload";

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const {
    data: lp,
    isPending,
    isError,
    refetch,
  } = useGetLpDetail({ lpId: Number(lpId) });

  const { data: me } = useGetMyInfo(accessToken);
  const { mutate: likeMutate } = usePostLike();
  const { mutate: dislikeMutate } = useDeleteLike();
  const { mutateAsync: patchLp, isPending: isPatchPending } = usePatchLp();
  const { mutateAsync: deleteLp, isPending: isDeletePending } = useDeleteLp();

  // 편집 모드 state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isLiked = lp?.likes.some((like) => like.userId === me?.id);
  const isMyLp = lp?.authorId === me?.id;

  const handleLikeLp = () => {
    likeMutate({ lpId: Number(lpId) });
  };

  const handleDislikeLp = () => {
    dislikeMutate({ lpId: Number(lpId) });
  };

  const handleEditClick = () => {
    if (!lp) return;
    setEditTitle(lp.title);
    setEditContent(lp.content);
    setEditTags(lp.tags.map((tag) => tag.name));
    setThumbnailPreview(lp.thumbnail);
    setThumbnailUrl(lp.thumbnail);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle("");
    setEditContent("");
    setEditTags([]);
    setTagInput("");
    setThumbnailPreview(null);
    setThumbnailUrl(null);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await uploadImage(formData);
      setThumbnailUrl(response.data.imageUrl);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
      setThumbnailPreview(lp?.thumbnail || null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !editTags.includes(tagInput.trim())) {
      setEditTags([...editTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      await patchLp({
        lpId: Number(lpId),
        title: editTitle.trim(),
        content: editContent.trim(),
        tags: editTags,
        thumbnail: thumbnailUrl || lp?.thumbnail,
        published: true,
      });
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error("LP 수정 실패:", error);
      alert("LP 수정에 실패했습니다.");
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteLp({ lpId: Number(lpId) });
      navigate("/");
    } catch (error) {
      console.error("LP 삭제 실패:", error);
      alert("LP 삭제에 실패했습니다.");
    }
  };

  if (isPending) {
    return <LoadingSpinner message="LP 상세 정보를 불러오는 중..." />;
  }

  if (isError || !lp) {
    return (
      <ErrorState
        message="LP 상세 정보를 불러오는데 실패했습니다."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="relative p-6 max-w-4xl mx-auto">
      {/* LP 카드 */}
      <div className="relative bg-[#2a2a2a] rounded-2xl p-8">
        {!isEditing ? (
          <>
            {/* View Mode - 작성자 정보 */}
            <div className="flex items-center gap-3 mb-6">
              <img
                className="w-12 h-12 rounded-full object-cover"
                src={lp.author.avatar}
                alt={lp.author.name}
              />
              <div>
                <div className="text-white font-semibold">{lp.author.name}</div>
                <div className="text-gray-400 text-sm">
                  {(() => {
                    const now = new Date();
                    const created = new Date(lp.createdAt);
                    const diffInSeconds = Math.floor(
                      (now.getTime() - created.getTime()) / 1000
                    );
                    const diffInMinutes = Math.floor(diffInSeconds / 60);
                    const diffInHours = Math.floor(diffInMinutes / 60);
                    const diffInDays = Math.floor(diffInHours / 24);

                    if (diffInDays > 0) return `${diffInDays}일 전`;
                    if (diffInHours > 0) return `${diffInHours}시간 전`;
                    if (diffInMinutes > 0) return `${diffInMinutes}분 전`;
                    return "방금 전";
                  })()}
                </div>
              </div>
            </div>

            {/* View Mode - LP 제목 */}
            <h1 className="text-white text-2xl font-bold mb-8">{lp.title}</h1>

            {/* 수정/삭제 버튼 (본인 LP인 경우에만) */}
            {isMyLp && (
              <div className="absolute top-6 right-6 flex gap-3">
                <button
                  onClick={handleEditClick}
                  className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="수정"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="삭제"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            )}

            {/* View Mode - LP 이미지 */}
            <div className="flex justify-center mb-8">
              <div className="w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl">
                <img
                  src={lp.thumbnail}
                  alt={lp.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* View Mode - LP 설명 */}
            <p className="text-gray-300 leading-relaxed mb-6 text-center">
              {lp.content}
            </p>

            {/* View Mode - 태그 */}
            {lp.tags && lp.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {lp.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-4 py-2 bg-[#3a4a5a] text-gray-200 rounded-full text-sm hover:bg-[#4a5a6a] transition-colors cursor-pointer"
                  >
                    # {tag.name}
                  </span>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Edit Mode */}
            <div className="space-y-6">
              {/* 제목 입력 */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  제목
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e91e63]"
                  placeholder="LP 제목을 입력하세요"
                />
              </div>

              {/* 내용 입력 */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  내용
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e91e63] resize-none"
                  placeholder="LP 내용을 입력하세요"
                />
              </div>

              {/* 이미지 업로드 */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  LP 사진
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e91e63]"
                />
                {thumbnailPreview && (
                  <div className="mt-4 flex justify-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden">
                      <img
                        src={thumbnailPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
                {isUploadingImage && (
                  <p className="text-yellow-400 text-sm mt-2">
                    이미지 업로드 중...
                  </p>
                )}
              </div>

              {/* 태그 입력 */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  태그
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-[#1a1a1a] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e91e63]"
                    placeholder="태그를 입력하고 Enter 또는 추가 버튼을 누르세요"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-6 py-3 bg-[#3a4a5a] text-white rounded-lg hover:bg-[#4a5a6a] transition-colors"
                  >
                    추가
                  </button>
                </div>
                {/* 태그 목록 */}
                {editTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-[#3a4a5a] text-gray-200 rounded-full text-sm flex items-center gap-2"
                      >
                        # {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 저장/취소 버튼 */}
              <div className="flex gap-3 justify-center pt-4">
                <button
                  onClick={handleCancelEdit}
                  disabled={isPatchPending || isUploadingImage}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  disabled={isPatchPending || isUploadingImage}
                  className="px-6 py-3 bg-[#e91e63] text-white rounded-lg hover:bg-[#c2185b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPatchPending
                    ? "저장 중..."
                    : isUploadingImage
                    ? "이미지 업로드 중..."
                    : "저장"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* 좋아요 & 댓글 (편집 모드가 아닐 때만 표시) */}
        {!isEditing && (
          <div className="flex justify-center gap-6">
            {/* 좋아요 */}
            <button
              onClick={isLiked ? handleDislikeLp : handleLikeLp}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Heart
                color={isLiked ? "red" : "black"}
                fill={isLiked ? "red" : "transparent"}
              />
              <span className="text-white text-xl font-semibold">
                {lp.likes.length}
              </span>
            </button>

            {/* 댓글 */}
            <button
              onClick={() => navigate(`/lp/${lpId}/comments`)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-[#2c2c2c] rounded-2xl p-8 max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl w-8 h-8 flex items-center justify-center"
              aria-label="Close modal"
            >
              ×
            </button>

            {/* 모달 내용 */}
            <div className="text-center">
              <h2 className="text-white text-xl font-bold mb-6">
                정말 이 LP를 삭제하시겠습니까?
              </h2>
              <p className="text-gray-400 mb-8">
                삭제된 LP는 복구할 수 없습니다.
              </p>

              {/* 버튼 그룹 */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeletePending}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isDeletePending}
                  className="flex-1 bg-[#e91e63] hover:bg-[#c2185b] text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeletePending ? "삭제 중..." : "삭제"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LpDetailPage;
