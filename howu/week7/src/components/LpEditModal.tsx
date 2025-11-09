import { useState, useRef, useEffect } from 'react';
import { updateLp, fileToDataURL } from '../api/lpApi';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { LpDetail, UpdateLpRequest } from '../types/auth';

interface LpEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  lp: LpDetail;
}

const LpEditModal = ({ isOpen, onClose, onSuccess, lp }: LpEditModalProps) => {
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

  const updateLpMutation = useMutation({
    mutationFn: ({ lpId, data }: { lpId: number; data: UpdateLpRequest }) => updateLp(lpId, data),
    onSuccess: (response) => {
      if (response.status && response.data) {
        queryClient.invalidateQueries({ queryKey: ['lp', lp.id] });
        queryClient.invalidateQueries({ queryKey: ['lps'] });
        onClose();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.message || 'LP 수정에 실패했습니다.');
      }
    },
    onError: (err: any) => {
      console.error('Failed to update LP:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'LP 수정에 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
    },
  });

  useEffect(() => {
    if (isOpen && lp) {
      setTitle(lp.title);
      setContent(lp.content);
      setTags(lp.tags.map(tag => tag.name));
      setThumbnailPreview(lp.thumbnail);
      setThumbnail(null);
      setError(null);
    }
  }, [isOpen, lp]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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

    if (!title.trim()) {
      setError('LP 이름을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      setError('LP 내용을 입력해주세요.');
      return;
    }

    const updateData: UpdateLpRequest = {
      title: title.trim(),
      content: content.trim(),
      tags,
    };

    try {
      if (thumbnail) {
        updateData.thumbnail = await fileToDataURL(thumbnail);
      }
      
      updateLpMutation.mutate({ lpId: lp.id, data: updateData });
    } catch (err) {
      console.error('Failed to process update:', err);
      setError('LP 정보 업데이트에 실패했습니다.');
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">LP 수정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="닫기"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">LP 사진</label>
            <div
              onClick={handleImageClick}
              className="w-full aspect-square bg-black rounded-full flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-700 hover:border-pink-500 transition-colors relative overflow-hidden"
            >
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="LP 썸네일 미리보기" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="text-center text-gray-400">LP 사진 변경</div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>

          <div>
            <label htmlFor="lp-name" className="block text-white text-sm font-medium mb-2">LP Name</label>
            <input id="lp-name" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none" />
          </div>

          <div>
            <label htmlFor="lp-content" className="block text-white text-sm font-medium mb-2">LP Content</label>
            <textarea id="lp-content" value={content} onChange={(e) => setContent(e.target.value)} rows={4} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none resize-none" />
          </div>

          <div>
            <label htmlFor="lp-tag" className="block text-white text-sm font-medium mb-2">LP Tag</label>
            <div className="flex gap-2 mb-2">
              <input id="lp-tag" type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={handleTagInputKeyPress} placeholder="태그 입력 후 Enter" className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none" />
              <button type="button" onClick={handleAddTag} className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">Add</button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-pink-100 transition-colors" aria-label={`${tag} 태그 제거`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={updateLpMutation.isPending} className="w-full py-4 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors">
            {updateLpMutation.isPending ? '저장 중...' : '저장'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LpEditModal;
