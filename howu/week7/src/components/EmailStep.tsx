import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { emailSchema } from "../schemas/authSchemas";
import type { EmailFormData } from "../schemas/authSchemas";

interface EmailStepProps {
  onNext: (data: { email: string }) => void;
  initialData?: { email: string };
}

const EmailStep: React.FC<EmailStepProps> = ({ onNext, initialData = { email: "" } }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: "onChange",
    defaultValues: initialData,
  });

  const handleBack = () => {
    navigate(-1);
  };

  const onSubmit = (data: EmailFormData) => {
    onNext(data);
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
          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        </div>
        <div></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-8 text-center">회원가입</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            {/* Email Field */}
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <span className="text-gray-400 mr-3">✉️</span>
                <input
                  type="email"
                  placeholder="이메일을 입력해주세요"
                  className="w-full bg-transparent border-b border-gray-600 py-3 text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm ml-8">{errors.email.message}</p>}
            </div>

            {/* Next Button */}
            <button
              type="submit"
              disabled={!isValid}
              className="w-full py-4 bg-pink-500 text-white rounded-lg font-medium disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors"
            >
              다음
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailStep;
