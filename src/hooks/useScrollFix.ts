import { useEffect, useRef } from 'react';

export default function useScrollFix(
  shouldFix: boolean,
): React.RefObject<HTMLElement> {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !shouldFix) return undefined;
    const oldTop = el.style.top;
    const oldPos = el.style.position;
    el.style.top = `-${window.pageYOffset}px`;
    el.style.position = 'fixed';
    return () => {
      const oldScroll = el.style.top
        ? -Number(el.style.top.replace('px', ''))
        : NaN;
      if (!Number.isNaN(oldScroll)) {
        el.style.position = oldPos;
        el.style.top = oldTop;
        window.scrollTo(0, oldScroll);
      }
    };
  }, [shouldFix]);

  const onResize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.top = '-0px';
  };

  useEffect(() => {
    if (shouldFix) {
      window.addEventListener('resize', onResize);
    }
    return () => {
      if (shouldFix) {
        window.removeEventListener('resize', onResize);
      }
    };
  }, [shouldFix]);

  return ref;
}
