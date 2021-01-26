import React, { useContext, useEffect } from 'react';
import classnames from 'classnames';

import LayoutContext from '../utils/layoutContext';

export default function FullscreenExitButton(): JSX.Element | null {
  const ctx = useContext(LayoutContext);
  const isFullscreen = ctx.getTemp('isFullscreen', false);
  const isMoving = ctx.getTemp('fullscreen-cursor-moving', false);
  const { setTemp } = ctx;
  useEffect(() => {
    if (typeof document === 'undefined' || !isFullscreen) {
      return undefined;
    }
    let timeoutId: number | null = null;
    let localIsMoving = false;
    const handleMouseMove = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      timeoutId = window.setTimeout(() => {
        setTemp('fullscreen-cursor-moving', false);
        localIsMoving = false;
        timeoutId = null;
      }, 1500);
      if (!localIsMoving) {
        setTemp('fullscreen-cursor-moving', true);
        localIsMoving = true;
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (timeoutId != null) clearTimeout(timeoutId);
      timeoutId = null;
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [setTemp, isFullscreen]);
  if (!isFullscreen) return null;

  const handleClick = () => {
    if (typeof document !== 'undefined') {
      document.exitFullscreen();
    }
  };

  return (
    <div
      className={classnames(
        'fullscreen-exit-button',
        !isMoving && 'display-none',
      )}
    >
      <button onClick={handleClick} title="Fullscreen mode" type="button">
        Avsluta helskärm <span className="fa fa-compress-alt" />
      </button>
    </div>
  );
}
