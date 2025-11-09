import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';

interface WithdrawalConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WithdrawalConfirmModal = ({ isOpen, onClose }: WithdrawalConfirmModalProps) => {
  const navigate = useNavigate();
  const { removeUser } = useAuth();

  // useMutation을 사용하여 탈퇴 처리
  const deleteUserMutation = useMutation({
    mutationFn: async () => {
      return await deleteUser();
    },
    onSuccess: () => {
      // 로컬 스토리지에서 사용자 정보 제거
      removeUser();
      // 로그인 페이지로 리다이렉트
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      console.error('탈퇴 실패:', error);
      alert('탈퇴에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handleConfirm = () => {
    deleteUserMutation.mutate();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-gray-800 rounded-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">회원 탈퇴</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="닫기"
            disabled={deleteUserMutation.isPending}
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

        {/* 내용 */}
        <div className="mb-6">
          <p className="text-white text-lg text-center">정말 탈퇴하시겠습니까?</p>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={deleteUserMutation.isPending}
            className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            아니오
          </button>
          <button
            onClick={handleConfirm}
            disabled={deleteUserMutation.isPending}
            className="flex-1 px-4 py-3 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {deleteUserMutation.isPending ? '처리 중...' : '예'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalConfirmModal;

