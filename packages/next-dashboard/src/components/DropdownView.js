// @flow

import React, { useState, useEffect, type Node } from 'react';

type Props = {
  classPrefix?: string,
  children: Node,
  isDisabled: boolean,
  label: string,
};

const DropdownView = ({ classPrefix, children, label, isDisabled }: Props) => {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const onWindowClick = () => {
      setOpen(false);
    };
    window.addEventListener('click', onWindowClick);
    return () => {
      window.removeEventListener('click', onWindowClick);
    };
  }, [isOpen]);

  const handleKeyPress = ev => {
    if (ev.key === ' ' || ev.key === 'Enter') {
      setOpen(!isOpen);
    }
  };

  const handleClick = ev => {
    setOpen(!isOpen);
    ev.stopPropagation();
  };

  const prefix = classPrefix || 'dropdown-view';
  return (
    <div className={`${prefix}-container`}>
      <div
        className={[
          `${prefix}__control`,
          isOpen && `${prefix}__control--menu-is-open`,
          isDisabled && `${prefix}__control--is-disabled`,
        ]
          .filter(c => c)
          .join(' ')}
        onKeyPress={handleKeyPress}
        onClick={!isDisabled && handleClick}
        role="button"
        tabIndex="0"
      >
        <div className={`${prefix}__label`}>{label}</div>
        <div className={`${prefix}__indicators`}>
          <span className={`${prefix}__indicator-separator`} />
          <div
            aria-hidden="true"
            className={`${prefix}__indicator ${prefix}__dropdown-indicator`}
          />
        </div>
      </div>
      {isOpen && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div
          className={`${prefix}__content--container`}
          onClick={ev => {
            ev.stopPropagation();
          }}
        >
          <div className={`${prefix}__content`}>{children}</div>
        </div>
      )}
    </div>
  );
};

DropdownView.defaultProps = {
  classPrefix: undefined,
};

export default DropdownView;
