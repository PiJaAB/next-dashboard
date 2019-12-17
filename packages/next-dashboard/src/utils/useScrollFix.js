// @flow

import { useEffect, useState } from 'react';

type Style = {|
  top: string,
  position: string,
|};

export default function useScrollFix(shouldFix: boolean): Style | void {
  const [scrollOffset, setScrollOffset] = useState<number | void>();
  const [savedScrollOffset, setSavedScrollOffset] = useState<number | void>();

  // When a modal is shown, we want to save the top offset and set position fixed to disable scrolling
  useEffect(() => {
    if (scrollOffset === undefined && !shouldFix) return;
    if (shouldFix) {
      setScrollOffset(window.pageYOffset);
    } else {
      setSavedScrollOffset(scrollOffset);
      setScrollOffset(undefined);
    }
  }, [shouldFix]);

  // Once the modal isn't showing anymore, we want to scroll back to the old position, AFTER the DOM
  // has updated with the new regular positioning.
  useEffect(() => {
    if (savedScrollOffset) {
      window.scrollTo(0, savedScrollOffset);
    }
    setSavedScrollOffset(undefined);
  }, [savedScrollOffset]);

  const onResize = () => {
    setScrollOffset(0);
  };

  useEffect(() => {
    if (scrollOffset) {
      window.addEventListener('resize', onResize);
    }
    return () => {
      if (scrollOffset) {
        window.removeEventListener('resize', onResize);
      }
    };
  }, [scrollOffset]);

  return scrollOffset !== undefined
    ? {
        top: `-${scrollOffset}px`,
        position: 'fixed',
      }
    : undefined;
}
