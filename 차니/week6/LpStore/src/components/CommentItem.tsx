import type { CommentItem as C } from "../hooks/queries/useLpCommentsInfinite";

function timeAgo(date: Date) {
  const d = new Date(date);
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days} days ago`;
}

export default function CommentItem({ c }: { c: C }) {
  return (
    <div className="flex gap-3 py-3">
      <img
        src={c.author.avatar ?? "https://placehold.co/36x36"}
        alt={c.author.name}
        className="h-9 w-9 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{c.author.name}</span>
          <span className="text-xs opacity-60">{timeAgo(c.createdAt)}</span>
        </div>
        <p className="mt-1 text-sm leading-6 opacity-95">{c.content}</p>
      </div>
    </div>
  );
}
