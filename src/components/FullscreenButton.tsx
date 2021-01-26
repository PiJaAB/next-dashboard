import React from 'react';
import classnames from 'classnames';

type Props = {
  className?: string;
};

export default function FullscreenButton({ className }: Props): JSX.Element {
  const handleClick = () => {
    const contentEl =
      typeof document !== 'undefined' && document.firstElementChild;
    if (contentEl) contentEl.requestFullscreen();
  };
  return (
    <div className={classnames('fullscreen-button-container', className)}>
      <button
        aria-label="Enable fullscreen"
        className="no-button fa fa-expand-alt"
        onClick={handleClick}
        title="Fullscreen mode"
        type="button"
      />
    </div>
  );
}
