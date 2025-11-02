import { useEffect, useRef, useState } from "react";

type Opts = IntersectionObserverInit & {
  freezeOnceVisible?: boolean; // 한번 보이면 계속 true 유지하고 싶을 때
};

export default function useInView({
  root,
  rootMargin = "300px 0px",
  threshold = 0,
  freezeOnceVisible = false,
}: Opts = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (freezeOnceVisible) observer.disconnect();
        } else if (!freezeOnceVisible) {
          setInView(false);
        }
      },
      { root: root ?? null, rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold, freezeOnceVisible]);

  return { ref, inView };
}
