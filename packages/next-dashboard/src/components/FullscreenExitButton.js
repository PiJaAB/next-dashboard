// @flow
import React, { useContext, useEffect, useState } from 'react';
import classnames from 'classnames';

import LayoutContext from '../utils/layoutContext';

export default function FullscreenExitButton(): React$Element<'div'> | null {
  const ctx = useContext(LayoutContext);
  const isFullscreen = ctx.getTemp('isFullscreen', false);
  const [timeoutID, setTimeoutID] = useState<TimeoutID | void>();
  const isMoving = ctx.getTemp('fullscreen-cursor-moving', false);
  useEffect(() => {
    if (typeof document === 'undefined' || !isFullscreen) {
      return undefined;
    }
    let localTimeoutID = timeoutID;
    let localIsMoving = isMoving;
    const handleMouseMove = () => {
      if (localTimeoutID) {
        clearTimeout(localTimeoutID);
      }
      localTimeoutID = setTimeout(() => {
        ctx.setTemp('fullscreen-cursor-moving', false);
        localIsMoving = false;
      }, 1500);
      if (!localIsMoving) {
        ctx.setTemp('fullscreen-cursor-moving', true);
        localIsMoving = true;
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      setTimeoutID(localTimeoutID);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isFullscreen, setTimeoutID]);
  if (!isFullscreen) return null;

  const handleClick = () => {
    const contentEl =
      typeof document !== 'undefined' && document.firstElementChild;
    if (contentEl) document.exitFullscreen();
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
