import React, { useState, useEffect, useCallback } from 'react';
import classnames from 'classnames';

type Props = React.PropsWithChildren<{
  classPrefix?: string;
  isDisabled?: boolean;
  label: string;
  titleColor?: string;
  dropdownExtraClasses?: string;
}>;

export default function DropdownView({
  classPrefix,
  children,
  label,
  isDisabled,
  titleColor,
  dropdownExtraClasses,
}: Props): JSX.Element {
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

  const handleKeyPress = useCallback((ev: React.KeyboardEvent) => {
    if (ev.key === ' ' || ev.key === 'Enter') {
      setOpen((oldOpen) => !oldOpen);
    }
  }, []);

  const handleClick = useCallback((ev: React.MouseEvent) => {
    setOpen((oldOpen) => !oldOpen);
    ev.stopPropagation();
  }, []);

  const prefix = classPrefix || 'dropdown-view';
  return (
    <div className={`${prefix}-container`}>
      <div
        className={[
          `${prefix}__control`,
          isOpen && `${prefix}__control--menu-is-open`,
          isDisabled && `${prefix}__control--is-disabled`,
        ]
          .filter((c) => c)
          .join(' ')}
        onKeyPress={handleKeyPress}
        onClick={!isDisabled ? handleClick : undefined}
        role="button"
        tabIndex={0}
      >
        <div className={`${prefix}__label`} style={{ color: titleColor }}>
          {label}
        </div>
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
          className={classnames(
            `${prefix}__content--container`,
            dropdownExtraClasses,
          )}
          onClick={(ev) => {
            ev.stopPropagation();
          }}
        >
          <div className={`${prefix}__content`}>{children}</div>
        </div>
      )}
    </div>
  );
}
