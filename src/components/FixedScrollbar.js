// @flow

import React, { useEffect, useRef, useState, type ElementProps } from 'react';
import { useMutationObserver } from '../utils';

type Props = ElementProps<'div'>;

type Update = ({
  containerEl: HTMLDivElement,
  fakeContainerEl: HTMLDivElement,
  setWidth: ((string => string) | string) => void,
  setHide: ((boolean => boolean) | boolean) => void,
}) => void;

const update: Update = ({
  containerEl,
  fakeContainerEl,
  setWidth,
  setHide,
}) => {
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
};

const FixedScrollbar = ({ className, children, ...props }: Props) => {
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

  useMutationObserver(
    typeof document !== 'undefined' ? document.documentElement : null,
    {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
    },
    () => {
      const containerEl = containerRef.current;
      const fakeContainerEl = fakeContainerRef.current;
      if (!containerEl || !fakeContainerEl) return;
      update({
        containerEl,
        fakeContainerEl,
        setHide,
        setWidth,
      });
    },
  );

  const handleScroll = ev => {
    const fakeContainerEl = fakeContainerRef.current;
    if (!fakeContainerEl) return;
    fakeContainerEl.scrollLeft = ev.target.scrollLeft;
  };

  const handleFakeScroll = ev => {
    const containerEl = containerRef.current;
    if (!containerEl) return;
    containerEl.scrollLeft = ev.target.scrollLeft;
  };

  return (
    <div {...props} className={`fixed-scrollbar ${className || ''}`}>
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
};

export default FixedScrollbar;
