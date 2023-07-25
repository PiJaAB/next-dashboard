import { useEffect, useState } from 'react';

export default function useScrollFix(
  shouldFix: boolean,
): React.RefCallback<HTMLElement> {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref || !shouldFix) return undefined;
    const oldTop = ref.style.top;
    const oldPos = ref.style.position;
    ref.style.top = `-${window.pageYOffset}px`;
    ref.style.position = 'fixed';
    return () => {
      const oldScroll = ref.style.top
        ? -Number(ref.style.top.replace('px', ''))
        : NaN;
      if (!Number.isNaN(oldScroll)) {
        ref.style.position = oldPos;
        ref.style.top = oldTop;
        window.scrollTo(0, oldScroll);
      }
    };
  }, [shouldFix, ref]);

  useEffect(() => {
    if (!shouldFix) return undefined;
    const onResize = () => {
      if (!ref) return;
      ref.style.top = '-0px';
    };
    window.addEventListener('resize', onResize);
    return () => {
      if (shouldFix) {
        window.removeEventListener('resize', onResize);
      }
    };
  }, [ref, shouldFix]);

  return setRef;
}
