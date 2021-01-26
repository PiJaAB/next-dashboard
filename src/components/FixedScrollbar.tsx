import classnames from 'classnames';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useMutationObserver } from 'src/hooks';

function update({
  containerEl,
  fakeContainerEl,
  setWidth,
  setHide,
}: {
  containerEl: HTMLDivElement;
  fakeContainerEl: HTMLDivElement;
  setWidth(val: ((val: string) => string) | string): void;
  setHide(val: ((val: boolean) => boolean) | boolean): void;
}): void {
  const vh =
    window.innerHeight ||
    (document.documentElement && document.documentElement.clientHeight);
  if (!vh) return;
  const rect = containerEl.getClientRects()[0];
  if (!rect) return;
  setWidth(`${containerEl.scrollWidth}px`);
  if (rect.bottom > vh) {
    setHide(false);
    const { style } = fakeContainerEl;
    style.bottom = `${rect.bottom - vh}px`;
  } else {
    setHide(true);
  }
}

export default function FixedScrollbar({
  className,
  children,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fakeContainerRef = useRef<HTMLDivElement | null>(null);
  const [hide, setHide] = useState(false);
  const [width, setWidth] = useState('0px');
  useEffect(() => {
    const containerEl = containerRef.current;
    const fakeContainerEl = fakeContainerRef.current;
    if (!containerEl || !fakeContainerEl) return undefined;
    const onscroll = () =>
      update({
        containerEl,
        fakeContainerEl,
        setHide,
        setWidth,
      });
    onscroll();
    window.addEventListener('scroll', onscroll);
    window.addEventListener('resize', onscroll);
    return () => {
      window.removeEventListener('scroll', onscroll);
      window.removeEventListener('resize', onscroll);
    };
  }, [containerRef, fakeContainerRef]);

  const mutationCallback = useCallback(() => {
    const containerEl = containerRef.current;
    const fakeContainerEl = fakeContainerRef.current;
    if (!containerEl || !fakeContainerEl) return;
    update({
      containerEl,
      fakeContainerEl,
      setHide,
      setWidth,
    });
  }, [setHide, setWidth]);

  useMutationObserver(
    typeof document !== 'undefined' ? document.documentElement : undefined,
    {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
    },
    mutationCallback,
  );

  const handleScroll = (ev: React.MouseEvent<HTMLDivElement>) => {
    const fakeContainerEl = fakeContainerRef.current;
    if (!fakeContainerEl) return;
    fakeContainerEl.scrollLeft = ev.currentTarget.scrollLeft;
  };

  const handleFakeScroll = (ev: React.MouseEvent<HTMLDivElement>) => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    containerEl.scrollLeft = ev.currentTarget.scrollLeft;
  };

  return (
    <div {...props} className={classnames('fixed-scrollbar', className)}>
      <div
        onScroll={handleScroll}
        ref={containerRef}
        className="fixed-scrollbar__content"
      >
        {children}
      </div>
      <div
        onScroll={handleFakeScroll}
        ref={fakeContainerRef}
        style={{ visibility: hide ? 'hidden' : 'visible' }}
        className="fixed-scrollbar__scroll"
      >
        <div style={{ width }} />
      </div>
    </div>
  );
}
