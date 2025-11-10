import { useRef, useState, useMemo, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { createLp, uploadImage } from "../api/lp";
import { QUERY_KEY } from "../constants/key";

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LpCreateModal({ onClose }: { onClose: () => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(boxRef, onClose);

  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (filePreview && filePreview.startsWith("blob:")) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      alert("이미지 파일을 선택해주세요.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setFilePreview((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return prev;
    });

    setFile(f);
    const url = URL.createObjectURL(f);
    setFilePreview(url);
  };

  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    if (tags.includes(v)) return;
    setTags((prev) => [...prev, v]);
    setTagInput("");
  };

  const removeTag = (name: string) => {
    setTags((prev) => prev.filter((t) => t !== name));
  };

  const canSubmit = useMemo(
    () => title.trim().length > 0 && content.trim().length > 0,
    [title, content]
  );

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: async () => {
      let thumbnailUrl: string | undefined = undefined;
      if (file) {
        thumbnailUrl = await uploadImage(file);
      }

      return createLp({
        title: title.trim(),
        content: content.trim(),
        thumbnail: thumbnailUrl,
        tags,
        published: true,
      });
    },
    onSuccess: () => {
      if (filePreview && filePreview.startsWith("blob:")) {
        URL.revokeObjectURL(filePreview);
      }

      onClose();

      qc.invalidateQueries({
        predicate: (q) => {
          const key = q.queryKey;
          return Array.isArray(key) && key[0] === QUERY_KEY.lps;
        },
      });
    },
  });

  const onSubmit = async () => {
    if (!canSubmit) return;
    await mutateAsync();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* 모달 백그라운드 */}
      <div className="absolute inset-0 bg-black/80" />

      {/* 모달 박스 */}
      <div
        ref={boxRef}
        className="relative w-[540px] max-w-[92vw] rounded-2xl bg-[#1f1e1e] text-white p-6 shadow-2xl"
      >
        {/* X 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-md cursor-pointer"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* 사진 미리보기 */}
        <div className="w-full flex flex-col items-center gap-4 mt-2 mb-6">
          <div className="w-40 h-40 rounded-full overflow-hidden bg-black/40 flex items-center justify-center">
            {filePreview ? (
              <img
                src={filePreview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="https://placehold.co/120x120?text=No+Image"
                alt="placeholder"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* 파일 입력 */}
          <label className="inline-flex items-center text-sm w-full">
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border-0 file:bg-white file:text-black file:text-sm file:cursor-pointer file:font-semibold"
            />
          </label>
        </div>

        {/* 입력들 */}
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="LP Name"
            className="w-full bg-transparent border border-white/30 rounded-md px-3 py-2 focus:outline-none focus:border-white"
          />
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="LP Content"
            className="w-full bg-transparent border border-white/30 rounded-md px-3 py-2 focus:outline-none focus:border-white"
          />

          {/* 태그 입력/추가 */}
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="LP Tag"
              className="flex-1 bg-transparent border border-white/30 rounded-md px-3 py-2 focus:outline-none focus:border-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 rounded-md bg-white text-black font-medium"
            >
              Add
            </button>
          </div>

          {/* 태그 리스트 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <div className="flex gap-2 items-center text-sm bg-white/10 px-2 py-1 rounded-md">
                  <span key={t}>#{t}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="rounded-full cursor-pointer"
                  >
                    <CloseIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 제출 버튼 */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || isPending}
          className="w-full mt-6 py-3 rounded-md bg-gray-300 text-black disabled:opacity-50 hover:bg-gray-200 transition"
        >
          {isPending ? "등록 중..." : "Add LP"}
        </button>

        {/* 에러 */}
        {error && (
          <p className="mt-2 text-xs text-red-300">
            {error instanceof Error ? error.message : "LP 등록에 실패했어요."}
          </p>
        )}
      </div>
    </div>
  );
}
