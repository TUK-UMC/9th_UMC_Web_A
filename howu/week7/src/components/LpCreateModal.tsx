import { useState, useRef, useEffect } from 'react';
import { createLp, fileToDataURL } from '../api/lpApi';
import { useQueryClient, useMutation } from '@tanstack/react-query';

interface LpCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const LpCreateModal = ({ isOpen, onClose, onSuccess }: LpCreateModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // useMutation을 사용하여 LP 생성
  const createLpMutation = useMutation({
    mutationFn: createLp,
    onSuccess: (response) => {
      if (response.status && response.data) {
        // LP 목록 쿼리 무효화하여 새로고침
        queryClient.invalidateQueries({ queryKey: ['lps'] });
        
        // 모달 닫기
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.message || 'LP 생성에 실패했습니다.');
      }
    },
    onError: (err: any) => {
      console.error('Failed to create LP:', err);
      // 에러 응답에서 메시지 추출
      const errorMessage = err?.response?.data?.message || err?.message || 'LP 생성에 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
    },
  });

  // 모달이 열릴 때 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setContent('');
      setTags([]);
      setTagInput('');
      setThumbnail(null);
      setThumbnailPreview(null);
      setError(null);
    }
  }, [isOpen]);

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 오버레이 클릭 핸들러
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 입력 검증
    if (!title.trim()) {
      setError('LP 이름을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      setError('LP 내용을 입력해주세요.');
      return;
    }

    if (!thumbnail) {
      setError('LP 사진을 선택해주세요.');
      return;
    }

    try {
      // 파일을 base64 데이터 URL로 변환
      const thumbnailUrl = await fileToDataURL(thumbnail);

      // useMutation을 사용하여 LP 생성
      createLpMutation.mutate({
        title: title.trim(),
        content: content.trim(),
        thumbnail: thumbnailUrl, // base64 데이터 URL
        tags: tags.length > 0 ? tags : undefined,
      });
    } catch (err) {
      console.error('Failed to convert file to data URL:', err);
      setError('파일 변환에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-gray-800 rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">LP 추가</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="닫기"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* LP 이미지 업로드 */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              LP 사진
            </label>
            <div
              onClick={handleImageClick}
              className="w-full aspect-square bg-black rounded-full flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-700 hover:border-pink-500 transition-colors relative overflow-hidden"
            >
              {thumbnailPreview ? (
                <img
                  src={thumbnailPreview}
                  alt="LP 썸네일 미리보기"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="text-center relative w-full h-full flex items-center justify-center">
                  {/* LP 레코드 스타일 플레이스홀더 */}
                  <div className="relative w-3/4 h-3/4 bg-gray-900 rounded-full flex items-center justify-center">
                    {/* 외부 링 */}
                    <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                    {/* 내부 작은 원 (레이블) */}
                    <div className="w-1/4 h-1/4 bg-gray-800 rounded-full flex items-center justify-center">
                      <div className="w-1/2 h-1/2 bg-gray-700 rounded-full"></div>
                    </div>
                  </div>
                  {/* 플레이 버튼 아이콘 오버레이 */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-pink-500/80 rounded-full flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="white"
                        className="ml-1"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
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
            />
          </div>

          {/* LP 이름 */}
          <div>
            <label htmlFor="lp-name" className="block text-white text-sm font-medium mb-2">
              LP Name
            </label>
            <input
              id="lp-name"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="다들 파이팅"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
            />
          </div>

          {/* LP 내용 */}
          <div>
            <label htmlFor="lp-content" className="block text-white text-sm font-medium mb-2">
              LP Content
            </label>
            <textarea
              id="lp-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="아자아자"
              rows={4}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none resize-none"
            />
          </div>

          {/* LP 태그 */}
          <div>
            <label htmlFor="lp-tag" className="block text-white text-sm font-medium mb-2">
              LP Tag
            </label>
            <div className="flex gap-2 mb-2">
              <input
                id="lp-tag"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                placeholder="타입스크립트"
                className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Add
              </button>
            </div>
            {/* 태그 목록 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-pink-100 transition-colors"
                      aria-label={`${tag} 태그 제거`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={createLpMutation.isPending}
            className="w-full py-4 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {createLpMutation.isPending ? '추가 중...' : 'Add LP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LpCreateModal;

