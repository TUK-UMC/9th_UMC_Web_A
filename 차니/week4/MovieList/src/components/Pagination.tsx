interface Props {
  page: number;
  onChange: (next: number) => void;
  disabled?: boolean;
}

export default function Pagination({ page, onChange, disabled }: Props) {
  return (
    <div className="flex items-center justify-center gap-6 mt-5 select-none">
      <button
        disabled={disabled || page === 1}
        onClick={() => onChange(page - 1)}
        className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
      >
        {"<"}
      </button>
      <span>{page} 페이지</span>
      <button
        disabled={disabled}
        onClick={() => onChange(page + 1)}
        className="bg-[#dda5e3] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#b2dab1] transition-all duration-200 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
      >
        {">"}
      </button>
    </div>
  );
}
