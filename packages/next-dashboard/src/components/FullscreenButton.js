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
    <div className={classnames('fullscreen-button', className)}>
      <button onClick={handleClick} title="Fullscreen mode" type="button">
        <span className="fa fa-expand-alt" />
      </button>
    </div>
  );
}
FullscreenButton.defaultProps = {
  className: undefined,
};
