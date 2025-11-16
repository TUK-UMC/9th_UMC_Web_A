import React from "react";

type Props = {
  isLoading?: boolean;
  isError: boolean;
  error?: unknown;
  fallback?: React.ReactNode;
  onRetry?: () => void;
  children: React.ReactNode;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function hasStringMessage(v: unknown): v is { message: string } {
  return isRecord(v) && typeof v.message === "string";
}

type HttpResponseLike = {
  data?: unknown;
  status?: number;
  statusText?: string;
};

function isHttpResponseLike(v: unknown): v is HttpResponseLike {
  return (
    isRecord(v) &&
    ("data" in v ? true : true) && // 존재 여부만 체크(선택 속성)
    ("status" in v ? typeof v.status === "number" : true) &&
    ("statusText" in v ? typeof v.statusText === "string" : true)
  );
}

type HttpErrorLike = {
  response?: HttpResponseLike;
};

function isHttpErrorLike(v: unknown): v is HttpErrorLike {
  return (
    isRecord(v) &&
    ("response" in v
      ? isHttpResponseLike((v as Record<string, unknown>).response)
      : true)
  );
}

function getErrorMessage(error: unknown): string {
  if (!error) return "네트워크 상태를 확인해주세요.";

  // 문자열 에러
  if (typeof error === "string") return error;

  // 표준 Error
  if (error instanceof Error) return error.message || "오류가 발생했습니다.";

  // message 속성이 문자열인 객체
  if (hasStringMessage(error)) return error.message;

  // Axios류 HTTP 에러 형태
  if (isHttpErrorLike(error) && error.response) {
    const resp = error.response;

    // data가 문자열인 경우
    if (typeof resp.data === "string") return resp.data;

    // data 안에 message가 문자열인 경우
    if (isRecord(resp.data) && hasStringMessage(resp.data))
      return resp.data.message;

    if (typeof resp.statusText === "string" && resp.statusText)
      return resp.statusText;
    if (typeof resp.status === "number")
      return `Request failed with status ${resp.status}`;
  }

  return "알 수 없는 오류가 발생했습니다.";
}

export default function QueryState({
  isLoading,
  isError,
  error,
  fallback,
  onRetry,
  children,
}: Props) {
  if (isLoading) {
    return <>{fallback ?? null}</>;
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
