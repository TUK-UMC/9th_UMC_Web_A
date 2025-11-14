interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      {/* 스피너 */}
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-[#e91e63] rounded-full animate-spin"></div>
      </div>

      {/* 메시지 */}
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
