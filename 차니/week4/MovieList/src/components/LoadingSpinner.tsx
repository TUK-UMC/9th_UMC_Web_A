export default function LoadingSpinner() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <div
        className="size-12 animate-spin rounded-full border-6 border-t-transparent border-[#b2dab1]"
        role="status"
      ></div>
      <span className="text-2xl font-medium">Loading...</span>
    </div>
  );
}
