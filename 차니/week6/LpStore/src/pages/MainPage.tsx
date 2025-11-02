import { useMemo, useState } from "react";
import type { PaginationDto } from "../types/common.types";
import { useLpList } from "../hooks/queries/useLpList";
import LpCard from "../components/LpCard";
import type { PaginationOrder } from "../enums/common";

type Order = PaginationOrder extends infer T ? T : "desc" | "asc";

export default function MainPage() {
  const [order, setOrder] = useState<Order>("desc");

  const queryParams: PaginationDto = useMemo(
    () => ({ cursor: undefined, search: "", order, limit: 24 }),
    [order]
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useLpList(queryParams);

  return (
    <div className="min-h-dvh bg-black text-white">
      <div className="sticky top-[100px] z-10 flex items-center gap- px-4 py-3 backdrop-blur">
        <div className="ml-auto flex rounded-md ring-1 ring-white overflow-hidden">
          <button
            className={`px-3 py-1.5 text-sm ${
              order === "asc" ? "bg-white text-black" : "bg-transparent"
            }`}
            onClick={() => setOrder("asc" as Order)}
          >
            오래된순
          </button>
          <button
            className={`px-3 py-1.5 text-sm ${
              order === "desc" ? "bg-white text-black" : "bg-transparent"
            }`}
            onClick={() => setOrder("desc" as Order)}
          >
            최신순
          </button>
        </div>
        {isFetching && !isLoading && (
          <span className="text-xs opacity-70">갱신 중…</span>
        )}
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {isLoading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-md bg-white/10 animate-pulse"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-md border border-red-500/30 bg-red-500/15 p-4">
            <p className="mb-2">목록을 불러오지 못했습니다.</p>
            <p className="mb-4 text-sm opacity-80">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="rounded-md bg-red-500 px-3 py-2 text-sm font-medium hover:bg-red-400"
            >
              다시 시도
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {data?.items?.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 overflow-visible">
                {data.items.map((item) => (
                  <LpCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="opacity-70">표시할 항목이 없어요.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
