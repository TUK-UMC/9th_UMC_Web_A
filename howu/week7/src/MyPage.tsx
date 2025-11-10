import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "./components/Layout";
import { useAuth } from "./hooks/useAuth";
import { fetchUserProfile } from "./api/userApi";
import ProfileEditModal from "./components/ProfileEditModal";

const MyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // useQuery로 사용자 프로필 불러오기
  const {
    data: response,
    error,
    isLoading: loading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });

  const userProfile = response?.data;

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-400">사용자 정보를 불러오는 중...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-500 mb-4">
              {error instanceof Error ? error.message : "사용자 정보를 불러올 수 없습니다."}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={handleBack}
            className="text-2xl text-white hover:text-gray-300"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold">마이페이지</h1>
          <div className="w-10"></div>
        </div>

        {/* 프로필 카드 */}
        <div className="bg-gray-900 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-6 mb-6">
            {/* 프로필 사진 */}
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 overflow-hidden">
              {userProfile?.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt="프로필 사진"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                userProfile?.name?.charAt(0).toUpperCase() || "?"
              )}
            </div>
            {/* 사용자 정보 */}
            <div className="flex-1">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-1">{userProfile?.name}</h2>
                <p className="text-gray-400 text-sm">{userProfile?.email}</p>
              </div>
              {userProfile?.bio && (
                <p className="text-gray-300">{userProfile.bio}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">가입일</span>
              <p className="text-white">{userProfile?.createdAt ? formatDate(userProfile.createdAt) : "-"}</p>
            </div>
            <div>
              <span className="text-gray-400">최근 수정일</span>
              <p className="text-white">{userProfile?.updatedAt ? formatDate(userProfile.updatedAt) : "-"}</p>
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-4">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-full py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
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
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            설정
          </button>
        </div>

        {/* 프로필 수정 모달 */}
        {userProfile && (
          <ProfileEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            userProfile={userProfile}
            onSuccess={() => {
              refetch();
            }}
          />
        )}

        {/* 현재 로그인된 사용자 정보 (디버깅용) */}
        {user && (
          <div className="mt-8 p-4 bg-gray-900 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">현재 로그인 정보</h3>
            <div className="text-xs text-gray-500 space-y-1">
              <p>ID: {user.id}</p>
              <p>이름: {user.name}</p>
              <p>이메일: {user.email}</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyPage;
