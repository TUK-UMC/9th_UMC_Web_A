import { useEffect, useMemo, useState } from "react";
import type { ResponseMyInfoDto } from "../types/auth.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMyInfo } from "../api/auth";
import type { RequestUpdateMeDto } from "../types/auth.types";
import { uploadImage } from "../api/lp";
import useMyInfo from "../hooks/queries/useMyInfo";
import { QUERY_KEY } from "../constants/key";

export const MyPage = () => {
  const qc = useQueryClient();
  const { data: meResp } = useMyInfo();
  const me = meResp?.data;

  const [open, setOpen] = useState(false);

  // 편집 폼 상태
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!me) return;
    setName(me.name ?? "");
    setBio(me.bio ?? "");
    setAvatarPreview(me.avatar ?? null);
  }, [me]);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      let avatar: string | null | undefined = undefined;

      if (avatarFile) {
        const url = await uploadImage(avatarFile);
        avatar = url;
      } else if (avatarPreview === null) {
        avatar = null;
      }

      const body: RequestUpdateMeDto = {
        name: name.trim(),
        bio: bio.trim() === "" ? null : bio.trim(),
        avatar,
      };
      const res = await patchMyInfo(body);
      return res.data;
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: [QUERY_KEY.me] });

      const prev = qc.getQueryData<ResponseMyInfoDto>([QUERY_KEY.me]);

      qc.setQueryData<ResponseMyInfoDto>([QUERY_KEY.me], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            name: name.trim(),
            bio: bio.trim() === "" ? null : bio.trim(),
          },
        };
      });

      return { prev };
    },
    // 실패하면 롤백
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData([QUERY_KEY.me], ctx.prev);
    },

    // 성공하면 서버 값으로 캐시 교체 + 로컬 폼/미리보기 동기화
    onSuccess: (updated) => {
      qc.setQueryData<ResponseMyInfoDto>([QUERY_KEY.me], (old) =>
        old ? { ...old, data: updated } : old
      );
      setName(updated.name ?? "");
      setBio(updated.bio ?? "");
      setAvatarPreview(updated.avatar ?? null);
      setAvatarFile(null);
      setOpen(false);
    },

    // 최종적으로 서버와 동기화 보장
    onSettled: () => {
      qc.invalidateQueries({ queryKey: [QUERY_KEY.me] });
    },
  });

  const canSave = useMemo(() => name.trim().length > 0, [name]);

  return (
    <div className="h-full bg-black text-white flex flex-col items-center">
      {/* 상단 영역 */}
      <div className="w-full max-w-3xl px-6 pt-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">마이페이지</h1>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded-md bg-white text-black hover:bg-gray-200"
          >
            설정
          </button>
        </div>

        {/* 프로필 미리보기 카드 */}
        <div className="mt-8 flex items-center gap-6">
          <img
            src={me?.avatar ?? "https://placehold.co/140x140?text=No+Image"}
            alt={me?.name ?? "avatar"}
            className="w-28 h-28 rounded-full object-cover bg-neutral-800"
          />
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold">{me?.name}</div>
            <div className="opacity-80">{me?.bio || "소개가 없습니다."}</div>
            <div className="opacity-60">{me?.email}</div>
          </div>
        </div>
      </div>

      {/* 편집 모달 */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => !isPending && setOpen(false)}
          />
          <div className="relative w-[600px] max-w-[92vw] rounded-2xl bg-neutral-900 p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-6">프로필 설정</h2>

            {/* 아바타 */}
            <div className="flex items-center justify-center gap-5 mb-6">
              <img
                src={
                  avatarPreview ?? "https://placehold.co/120x120?text=No+Image"
                }
                alt="avatar preview"
                className="w-20 h-20 rounded-full object-cover bg-neutral-800"
              />
              <div className="flex flex-col items-center gap-3 min-w-xs">
                <label className="w-full text-center px-3 py-2 rounded-md bg-white/10 cursor-pointer hover:bg-white/20">
                  이미지 업로드
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setAvatarFile(f);
                      if (f) {
                        const url = URL.createObjectURL(f);
                        setAvatarPreview(url);
                      }
                    }}
                  />
                </label>
                <button
                  type="button"
                  className="w-full px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-center"
                  onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview(null);
                  }}
                >
                  이미지 제거
                </button>
              </div>
            </div>

            {/* 이름 */}
            <div className="mb-4">
              <label className="block mb-2 text-sm opacity-80">이름 *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                className="w-full px-3 py-3 bg-transparent border border-white rounded-md focus:outline-none focus:border-pink-500"
              />
              {name.trim() === "" && (
                <p className="mt-1 text-xs text-red-300">이름은 필수입니다.</p>
              )}
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label className="block mb-2 text-sm opacity-80">
                Bio (옵션)
              </label>
              <input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="한 줄 소개를 입력하세요 (비워도 저장됨)"
                className="w-full px-3 py-3 bg-transparent border border-white rounded-md focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="mb-6 opacity-80 text-sm">
              이메일: {me?.email ?? "-"}
            </div>

            {/* 액션 */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={() => mutateAsync()}
                disabled={!canSave || isPending}
                className="px-4 py-2 rounded-md bg-pink-600 hover:bg-pink-500 disabled:bg-gray-500"
              >
                {isPending ? "저장 중…" : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
