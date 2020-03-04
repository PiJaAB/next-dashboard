// @flow
import React from 'react';
import classnames from 'classnames';

type Props = {
  className?: string,
};

export default function FullscreenButton({
  className,
}: Props): React$Element<'div'> {
  const handleClick = () => {
    const contentEl =
      typeof document !== 'undefined' && document.firstElementChild;
    if (contentEl) contentEl.requestFullscreen();
  };
  return (
    <div className={classnames('fullscreen-button-container', className)}>
      <button
        className="no-button fa fa-expand-alt"
        onClick={handleClick}
        title="Fullscreen mode"
        type="button"
      />
      {/* <span className="fa fa-expand-alt" /> */}
    </div>
  );
}
FullscreenButton.defaultProps = {
  className: undefined,
};
