type Props = {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onRetry?: () => void;
  children: React.ReactNode;
};

// 객체 판별용 타입 가드
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getErrorMessage(error: unknown): string {
  if (!error) return "네트워크 상태를 확인해주세요.";

  // 문자열 에러
  if (typeof error === "string") return error;

  // 표준 Error
  if (error instanceof Error) return error.message || "오류가 발생했습니다.";

  if (isRecord(error)) {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }

    if ("response" in error && isRecord(error.response)) {
      const resp = error.response;

      if ("data" in resp) {
        const data = (resp as Record<string, unknown>).data;

        if (typeof data === "string") return data;

        if (
          isRecord(data) &&
          "message" in data &&
          typeof data.message === "string"
        ) {
          return data.message;
        }
      }

      if ("statusText" in resp && typeof resp.statusText === "string") {
        return resp.statusText;
      }

      if ("status" in resp && typeof resp.status === "number") {
        return `Request failed with status ${resp.status}`;
      }
    }
  }

  return "알 수 없는 오류가 발생했습니다.";
}

export default function QueryState({
  isLoading,
  isError,
  error,
  onRetry,
  children,
}: Props) {
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-8 w-40 rounded bg-white/50 animate-pulse mb-6" />
        <div className="h-80 w-full rounded bg-white/50 animate-pulse mb-6" />
        <div className="h-16 w-full rounded bg-white/50 animate-pulse" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="m-6 rounded-md border border-red-500/30 bg-red-500/15 p-4 text-white">
        <p className="mb-2">데이터를 불러오지 못했습니다.</p>
        <p className="mb-4 text-sm opacity-80">{getErrorMessage(error)}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-md bg-red-500 px-3 py-2 text-sm font-medium hover:bg-red-400"
          >
            다시 시도
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
