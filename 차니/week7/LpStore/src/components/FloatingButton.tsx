type FloatingButtonProps = {
  onClick?: () => void;
};

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        fixed bottom-10 right-10 z-50
        h-14 w-14 rounded-full
        flex items-center justify-center
        bg-pink-600 text-white
        cursor-pointer
      "
    >
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    </button>
  );
}
