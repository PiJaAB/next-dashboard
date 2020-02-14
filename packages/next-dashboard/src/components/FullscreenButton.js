// @flow
import React from 'react';

export default function FullscreenButton(): React$Element<'div'> {
  const handleClick = () => {
    const contentEl =
      typeof document !== 'undefined' && document.firstElementChild;
    if (contentEl) contentEl.requestFullscreen();
  };
  return (
    <div className="fullscreenButton">
      <button onClick={handleClick} title="Fullscreen mode" type="button">
        <span className="fa fa-expand-alt" />
      </button>
    </div>
  );
}
