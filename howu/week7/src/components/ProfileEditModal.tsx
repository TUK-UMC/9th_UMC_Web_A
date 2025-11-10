import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile, fileToDataURL } from '../api/userApi';
import { useAuth } from '../hooks/useAuth';
import type { UserProfileData } from '../types/auth';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfileData;
  onSuccess?: () => void;
}

const ProfileEditModal = ({ isOpen, onClose, userProfile, onSuccess }: ProfileEditModalProps) => {
  const [name, setName] = useState(userProfile.name);
  const [bio, setBio] = useState(userProfile.bio || '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(userProfile.avatar);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // 모달이 열릴 때 초기값 설정
  useEffect(() => {
    if (isOpen) {
      setName(userProfile.name);
      setBio(userProfile.bio || '');
      setAvatar(null);
      setAvatarPreview(userProfile.avatar);
      setError(null);
    }
  }, [isOpen, userProfile]);

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
      setAvatar(file);
      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const { user, login } = useAuth();

  // useMutation을 사용하여 프로필 수정 (낙관적 업데이트 적용)
  const updateProfileMutation = useMutation({
    mutationFn: (data: { name: string; bio?: string | null; avatar?: string | null }) => updateUserProfile(data),
    onMutate: async (newData) => {
      // 1. 진행중인 쿼리를 취소하여 덮어쓰기 방지
      await queryClient.cancelQueries({ queryKey: ['userProfile'] });

      // 2. 이전 프로필 데이터 스냅샷
      const previousProfile = queryClient.getQueryData<ApiResponse<UserProfileData>>(['userProfile']);
      const previousAuthUser = user;

      // 3. 새 값으로 낙관적 업데이트
      // MyPage의 react-query 캐시 업데이트
      if (previousProfile) {
        queryClient.setQueryData<ApiResponse<UserProfileData>>(['userProfile'], {
          ...previousProfile,
          data: {
            ...previousProfile.data!,
            name: newData.name,
            bio: newData.bio,
            avatar: newData.avatar,
          },
        });
      }

      // Nav-Bar의 Local Storage 업데이트
      if (user) {
        login({ ...user, name: newData.name });
      }

      // 4. 롤백을 위한 컨텍스트 반환
      return { previousProfile, previousAuthUser };
    },
    onError: (err: any, newProfile, context) => {
      // 5. 실패 시 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(['userProfile'], context.previousProfile);
      }
      if (context?.previousAuthUser) {
        login(context.previousAuthUser); // Local Storage 롤백
      }
      const errorMessage = err?.response?.data?.message || err?.message || '프로필 수정에 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
    },
    onSettled: () => {
      // 6. 쿼리 무효화로 최신 데이터 동기화
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      
      // 성공/실패 여부와 관계없이 모달을 닫고 콜백 실행
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 이름 검증
    if (!name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }

    try {
      let avatarUrl = userProfile.avatar;

      // 새로 선택한 파일이 있으면 base64 데이터 URL로 변환
      if (avatar) {
        avatarUrl = await fileToDataURL(avatar);
      }

      // bio와 avatar는 optional이므로 빈 문자열도 null로 처리
      updateProfileMutation.mutate({
        name: name.trim(),
        bio: bio.trim() || null,
        avatar: avatarUrl || null,
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
          <h2 className="text-2xl font-bold text-white">프로필 수정</h2>
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
          {/* 프로필 사진 */}
          <div className="flex justify-center">
            <div
              onClick={handleAvatarClick}
              className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-600 hover:border-pink-500 transition-colors relative overflow-hidden"
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="프로필 사진"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="text-gray-400 text-4xl font-bold">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* 이름 */}
          <div>
            <label htmlFor="profile-name" className="block text-white text-sm font-medium mb-2">
              이름
            </label>
            <div className="flex items-center gap-2">
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="flex-1 px-4 py-3 bg-gray-900 border border-white rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={updateProfileMutation.isPending || !name.trim()}
                className="w-10 h-10 flex items-center justify-center border-2 border-white rounded-lg text-white hover:bg-white hover:text-gray-900 disabled:bg-gray-600 disabled:border-gray-600 disabled:cursor-not-allowed transition-colors"
                aria-label="저장"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="profile-bio" className="block text-white text-sm font-medium mb-2">
              Bio <span className="text-gray-500 text-xs">(선택사항)</span>
            </label>
            <textarea
              id="profile-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="소개를 입력하세요"
              rows={3}
              className="w-full px-4 py-3 bg-gray-900 border border-white rounded-lg text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none resize-none"
            />
          </div>

          {/* 이메일 (읽기 전용) */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              이메일
            </label>
            <p className="px-4 py-3 text-white">{userProfile.email}</p>
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={updateProfileMutation.isPending || !name.trim()}
              className="flex-1 px-4 py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {updateProfileMutation.isPending ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;

