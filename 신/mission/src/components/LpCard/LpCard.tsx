import { useNavigate } from "react-router-dom";
import type { Lp } from "../../types/lp";

interface LpCardProps {
  lp: Lp;
}

const LpCard = ({ lp }: LpCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      key={lp.id}
      className="group cursor-pointer"
      onClick={() => navigate(`/lp/${lp.id}`)}
    >
      {/* 앨범 커버 이미지 + 호버 정보 */}
      <div className="relative aspect-square overflow-hidden rounded-lg">
        {/* 앨범 커버 */}
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* 호버 시 나타나는 정보 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          {/* 앨범 제목 */}
          <h3 className="text-white font-bold text-sm md:text-base mb-2 line-clamp-2">
            {lp.title}
          </h3>

          {/* 날짜와 좋아요 */}
          <div className="flex items-center justify-between text-xs md:text-sm text-gray-200">
            <span>
              {new Date(lp.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <div className="flex items-center gap-1">
              <span>❤️</span>
              <span>{lp.likes.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LpCard;
