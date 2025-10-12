export default function PersonCard({
  name,
  role,
  profilePath,
}: {
  name: string;
  role?: string;
  profilePath: string | null;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-[140px] h-[140px] rounded-full overflow-hidden bg-white/10 mx-auto border-2 border-white">
        {profilePath ? (
          <img
            src={`https://image.tmdb.org/t/p/w185${profilePath}`}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white/70">
            {name.slice(0, 1)}
          </div>
        )}
      </div>
      <div className="mt-3 text-center">
        <p className="text-base font-semibold leading-tight line-clamp-2">
          {name}
        </p>
        {role ? (
          <p className="mt-1 text-sm text-white/70 leading-tight line-clamp-2">
            {role}
          </p>
        ) : null}
      </div>
    </div>
  );
}
