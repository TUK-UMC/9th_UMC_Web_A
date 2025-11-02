import type { LpItem } from "../hooks/queries/useLpList";
import { Link } from "react-router-dom";

function timeAgo(date: Date | string) {
  const d = new Date(date);
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days} days ago`;
}

type Props = { item: LpItem };

export default function LpCard({ item }: Props) {
  return (
    <Link
      to={`/lp/${item.id}`}
      className="group relative block isolate hover:z-20 focus:z-20"
      aria-label={item.title}
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-black transition-transform duration-300 transform-gpu group-hover:scale-125">
        <div className="absolute inset-0">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="px-3 py-2">
            <p className="text-sm font-semibold leading-snug line-clamp-2">
              {item.title}
            </p>
            <div className="mt-1 flex items-center gap-3 text-xs text-white/85">
              <span>{timeAgo(item.createdAt)}</span>
              <span className="inline-flex items-center gap-1">
                <span aria-hidden>♥</span>
                {item.likes?.length ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
