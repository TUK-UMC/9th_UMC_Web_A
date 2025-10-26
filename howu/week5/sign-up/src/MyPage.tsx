import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { fetchUserProfile } from "./api/userApi";
import type { UserProfileData } from "./types/auth";

const MyPage = () => {
  const navigate = useNavigate();
  const { user, logout, getAccessToken } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const accessToken = getAccessToken();
        const response = await fetchUserProfile(accessToken);
        
        if (response.status && response.data) {
          setUserProfile(response.data);
        } else {
          setError(response.message || "사용자 정보를 불러올 수 없습니다.");
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
        setError("사용자 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []); // 의존성 배열을 비워서 컴포넌트 마운트 시에만 실행

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-400">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
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
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-pink-400 hover:text-pink-300 border border-pink-400 rounded-lg hover:border-pink-300 transition-colors"
          >
            로그아웃
          </button>
        </div>

        {/* 프로필 카드 */}
        <div className="bg-gray-900 rounded-2xl p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {userProfile?.name?.charAt(0) || "?"}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-white">{userProfile?.name}</h2>
              <p className="text-gray-400">{userProfile?.email}</p>
            </div>
          </div>

          {userProfile?.bio && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">소개</h3>
              <p className="text-gray-300">{userProfile.bio}</p>
            </div>
          )}

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
          <button className="w-full py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
            프로필 편집
          </button>
          <button className="w-full py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
            비밀번호 변경
          </button>
          <button className="w-full py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
            알림 설정
          </button>
        </div>

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
    </div>
  );
};

export default MyPage;
