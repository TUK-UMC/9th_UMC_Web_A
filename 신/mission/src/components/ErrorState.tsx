interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({
  message = "데이터를 불러오는 중 오류가 발생했습니다.",
  onRetry,
}: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      {/* 에러 아이콘 */}
      <div className="w-20 h-20 mb-6 flex items-center justify-center bg-red-500/10 rounded-full">
        <svg
          className="w-10 h-10 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* 에러 메시지 */}
      <p className="text-gray-300 text-lg mb-6 text-center">{message}</p>

      {/* 재시도 버튼 */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-[#e91e63] text-white rounded-lg hover:bg-[#c2185b] transition-colors font-medium flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          다시 시도
        </button>
      )}
    </div>
  );
};

export default ErrorState;
