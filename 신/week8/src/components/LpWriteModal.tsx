import { useState, useRef } from "react";
import usePostLp from "../hooks/mutations/usePostLp";
import { uploadImage } from "../apis/upload";

interface LpWriteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LpWriteModal = ({ isOpen, onClose }: LpWriteModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: postLpMutate, isPending } = usePostLp();

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일인지 확인
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 서버에 이미지 업로드
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadImage(formData);

      setThumbnailUrl(response.data.imageUrl);
    } catch (error) {
      console.error(error);

      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");

      setThumbnailPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    // 유효성 검사
    if (!thumbnailUrl) {
      alert("LP 이미지를 선택해주세요.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const requestData = {
      title: title.trim(),
      content: content.trim(),
      tags,
      thumbnail: thumbnailUrl,
      published: true,
    };

    try {
      await postLpMutate(requestData);

      // 성공 후 폼 초기화
      setTitle("");
      setContent("");
      setTags([]);
      setTagInput("");
      setThumbnailPreview(null);
      setThumbnailUrl(null);
      onClose();
    } catch (error) {
      console.error(error);

      alert("LP 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-[#2c2c2c] rounded-lg p-8 max-w-2xl w-full mx-4 relative">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl w-8 h-8 flex items-center justify-center cursor-pointer"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* LP 이미지 */}
        <div className="flex justify-center mb-6">
          <div
            onClick={handleImageClick}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-2xl cursor-pointer hover:opacity-80 transition-opacity relative overflow-hidden"
          >
            {thumbnailPreview ? (
              <>
                <img
                  src={thumbnailPreview}
                  alt="LP Thumbnail"
                  className="w-full h-full object-cover rounded-full"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                    <div className="text-white text-sm">업로드 중...</div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center shadow-2xl">
                <div className="w-44 h-44 rounded-full border-8 border-gray-900 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white" />
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
        </div>

        {/* LP Name */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="LP Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#404040] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e91e63] placeholder-gray-400"
          />
        </div>

        {/* LP Content */}
        <div className="mb-4">
          <textarea
            placeholder="LP Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-[#404040] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e91e63] placeholder-gray-400 min-h-[100px] resize-none"
          />
        </div>

        {/* LP Tag */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="LP Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              className="flex-1 bg-[#404040] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e91e63] placeholder-gray-400"
            />
            <button
              onClick={handleAddTag}
              className="px-6 py-3 bg-[#b0b0b0] text-black rounded-md hover:bg-[#c0c0c0] transition-colors font-medium cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* 태그 목록 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 bg-[#404040] text-white px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-[#e91e63] ml-1"
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Add LP 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={
            !title.trim() ||
            !content.trim() ||
            !thumbnailUrl ||
            isPending ||
            isUploading
          }
          className="w-full bg-[#b0b0b0] text-black py-3 rounded-md hover:bg-[#c0c0c0] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isUploading
            ? "이미지 업로드 중..."
            : isPending
            ? "LP 생성 중..."
            : "Add LP"}
        </button>
      </div>
    </div>
  );
};

export default LpWriteModal;
