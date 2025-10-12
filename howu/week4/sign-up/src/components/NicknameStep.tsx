import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nicknameSchema } from "../schemas/authSchemas";
import type { NicknameFormData } from "../schemas/authSchemas";

interface NicknameStepProps {
  onComplete: (data: { nickname: string; avatar?: string }) => void;
  onPrev: () => void;
  initialData?: { nickname: string };
  email?: string;
  password?: string;
}

const NicknameStep: React.FC<NicknameStepProps> = ({ onComplete, onPrev, initialData = { nickname: "" }, email, password }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<NicknameFormData>({
    resolver: zodResolver(nicknameSchema),
    mode: "onChange",
    defaultValues: initialData,
  });

  const handleBack = () => {
    onPrev();
  };

  const onSubmit = (data: NicknameFormData) => {
    onComplete({
      nickname: data.nickname,
      avatar: selectedImage || undefined
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button 
          onClick={handleBack}
          className="text-2xl text-white hover:text-gray-300"
        >
          ←
        </button>
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
        </div>
        <div></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-8 text-center">회원가입</h2>
          
          {/* Profile Image */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                {selectedImage ? (
                  <img 
                    src={selectedImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-4xl">👤</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">+</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            {/* Nickname Field */}
            <div className="mb-8">
              <div className="bg-gray-800 rounded-lg p-4">
                <input
                  type="text"
                  placeholder="닉네임을 입력해주세요"
                  className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
                  {...register("nickname")}
                />
              </div>
              {errors.nickname && <p className="text-red-500 text-sm mt-2">{errors.nickname.message}</p>}
            </div>

            {/* Complete Button */}
            <button
              type="submit"
              disabled={!isValid}
              className="w-full py-4 bg-pink-500 text-white rounded-lg font-medium disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors"
            >
              회원가입 완료
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NicknameStep;
