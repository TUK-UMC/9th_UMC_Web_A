import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import usePatchMyInfo from "../hooks/mutations/usePatchMyInfo";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { uploadImage } from "../apis/upload";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  const accessToken = getItem();

  const { data: myInfo } = useGetMyInfo(accessToken);
  const { mutateAsync: patchMyInfo, isPending } = usePatchMyInfo();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleEditClick = () => {
    setEditName(myInfo?.name || "");
    setEditBio(myInfo?.bio || "");
    setAvatarPreview(myInfo?.avatar || null);
    setAvatarUrl(myInfo?.avatar || null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName("");
    setEditBio("");
    setAvatarPreview(null);
    setAvatarUrl(null);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 서버에 이미지 업로드
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadImage(formData);
      setAvatarUrl(response.data.imageUrl);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
      setAvatarPreview(myInfo?.avatar || null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    try {
      // bio와 avatar는 항상 포함하되, 빈 값은 빈 문자열로 전송
      const updateData: { name: string; bio?: string; avatar?: string } = {
        name: editName.trim(),
        bio: editBio.trim(),
        avatar: avatarUrl !== myInfo?.avatar ? avatarUrl || "" : undefined,
      };

      if (updateData.avatar === undefined) {
        delete updateData.avatar;
      }

      await patchMyInfo(updateData);
      setIsEditing(false);
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정에 실패했습니다.");
    }
  };

  if (!myInfo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">로딩중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">마이페이지</h1>
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
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
              설정
            </button>
          )}
        </div>

        {/* 프로필 카드 */}
        <div className="bg-[#2c2c2c] rounded-2xl p-8">
          {isEditing ? (
            // 편집 모드
            <div className="space-y-6">
              {/* 프로필 이미지 편집 */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                    src={avatarPreview || "/default-avatar.png"}
                    alt="프로필"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
                  />
                  {isUploadingImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <span className="text-sm">업로드 중...</span>
                    </div>
                  )}
                </div>
                <label className="cursor-pointer px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isUploadingImage}
                  />
                  프로필 사진 변경
                </label>
              </div>

              {/* 이름 입력 */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  이름 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#3a3a3a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                />
              </div>

              {/* Bio 입력 */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  소개 (선택사항)
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full bg-[#3a3a3a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 resize-none"
                />
              </div>

              {/* 이메일 */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  value={myInfo.email}
                  disabled
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* 버튼 그룹 */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isPending || isUploadingImage}
                  className="flex-1 bg-[#e91e63] hover:bg-[#c2185b] text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isPending ? "저장 중..." : "저장"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isPending}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            // 조회 모드
            <div className="space-y-6">
              {/* 프로필 이미지 */}
              <div className="flex flex-col items-center gap-4">
                <img
                  src={myInfo.avatar || "/default-avatar.png"}
                  alt="프로필"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-700"
                />
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">{myInfo.name}</h2>
                  {myInfo.bio && <p className="text-gray-400">{myInfo.bio}</p>}
                </div>
              </div>

              {/* 이메일 */}
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">이메일</p>
                <p className="text-white">{myInfo.email}</p>
              </div>

              {/* 로그아웃 버튼 */}
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors cursor-pointer"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
