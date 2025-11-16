// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toggleLike } from "../../api/lp";
// import { QUERY_KEY } from "../../constants/key";
// import type { ResponseLpDetailDto } from "../../types/lp.types";
// import type { ResponseMyInfoDto } from "../../types/auth.types";

// export default function useToggleLike(lpId: string) {
//   const qc = useQueryClient();

//   return useMutation({
//     mutationFn: () => toggleLike(lpId),

//     onMutate: async () => {
//       // 대상 쿼리들 취소
//       await Promise.all([
//         qc.cancelQueries({ queryKey: [QUERY_KEY.lp, lpId] }),
//       ]);

//       // 스냅샷
//       const prevDetail = qc.getQueryData<ResponseLpDetailDto>([
//         QUERY_KEY.lp,
//         lpId,
//       ]);

//       // 내 id
//       const me = qc.getQueryData<ResponseMyInfoDto>([QUERY_KEY.me]);
//       const myId = me?.data.id;
//       if (!myId) return { prevDetail };

//       // 상세 캐시 즉시 갱신
//       qc.setQueryData<ResponseLpDetailDto>([QUERY_KEY.lp, lpId], (old) => {
//         if (!old) return old as any;
//         const liked = old.data.likes.some((l) => l.userId === myId);
//         const nextLikes = liked
//           ? old.data.likes.filter((l) => l.userId !== myId) // 취소
//           : [...old.data.likes, { id: -1, userId: myId, lpId: Number(lpId) }]; // 임시 like

//         return { ...old, data: { ...old.data, likes: nextLikes } };
//       });

//       // 목록 무한쿼리에도 반영(선택)
//       qc.setQueriesData(
//         { queryKey: [QUERY_KEY.lpList], type: "all" },
//         (data: any) => {
//           if (!data) return data;
//           // pages[] 안의 카드 하나 찾기
//           const pages = data.pages?.map((p: any) => {
//             const nextData = p?.data?.data?.map((item: any) => {
//               if (item.id !== Number(lpId)) return item;
//               const liked = item.likes?.some((l: any) => l.userId === myId);
//               const nextLikes = liked
//                 ? item.likes.filter((l: any) => l.userId !== myId)
//                 : [
//                     ...(item.likes ?? []),
//                     { id: -1, userId: myId, lpId: Number(lpId) },
//                   ];
//               return { ...item, likes: nextLikes };
//             });
//             return { ...p, data: { ...p.data, data: nextData } };
//           });
//           return { ...data, pages };
//         }
//       );

//       return { prevDetail };
//     },

//     onError: (_e, _v, ctx) => {
//       if (ctx?.prevDetail)
//         qc.setQueryData([QUERY_KEY.lp, lpId], ctx.prevDetail);
//     },

//     onSettled: () => {
//       // 최종 서버 값으로 동기화
//       qc.invalidateQueries({ queryKey: [QUERY_KEY.lp, lpId] });
//       qc.invalidateQueries({ queryKey: [QUERY_KEY.lpList] });
//     },
//   });
// }
