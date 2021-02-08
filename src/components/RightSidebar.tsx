import React, { useState, useEffect, useContext, useCallback } from 'react';
import ReactDOM from 'react-dom';

import classnames from 'classnames';
import useInitialRender from '../hooks/useInitialRender';
import LayoutContext from '../utils/layoutContext';

type Props = React.PropsWithChildren<{
  icon?: string;
  isOpen?: boolean;
  onChange?: (newVal: boolean) => void;
  initialIsOpen?: boolean;
  className?: string;
}>;

const RightSidebar = ({
  icon = 'cogs',
  children,
  isOpen,
  initialIsOpen,
  onChange,
  className,
}: Props): JSX.Element | null => {
  const [isOpenInner, setOpenInner] = useState(
    isOpen != null ? isOpen : Boolean(initialIsOpen),
  );
  const [hideContent, setHideContent] = useState(!isOpenInner);
  useEffect(() => {
    if (isOpenInner) {
      setHideContent(false);
      return undefined;
    }
    const tID = setTimeout(() => {
      setHideContent(true);
    }, 300);
    return () => {
      clearTimeout(tID);
    };
  }, [isOpenInner]);

  useEffect(() => {
    if (isOpen != null) setOpenInner(isOpen);
  }, [isOpen]);
  const openExists = isOpen != null;
  const handleClick = useCallback(
    (newOpen: boolean) => {
      if (!openExists) {
        setOpenInner(newOpen);
      }
      if (onChange) onChange(newOpen);
    },
    [onChange, openExists, setOpenInner],
  );
  const { getTemp } = useContext(LayoutContext);

  if (useInitialRender()) return null;
  if (typeof window === 'undefined') return null;
  const rightSidebarRoot = document.getElementById('right-sidebar-root');
  if (!rightSidebarRoot) return null;
  if (getTemp('isFullscreen', false)) return null;
  return ReactDOM.createPortal(
    <div
      className={classnames(
        className,
        'right-sidebar',
        isOpenInner && 'right-sidebar_open',
      )}
    >
      <button
        type="button"
        className={`right-sidebar-icon fa fa-${icon}`}
        aria-label="Toggle right sidebar"
        onClick={() => handleClick(!isOpenInner)}
      />
      <div
        className={classnames(
          'right-sidebar-container',
          hideContent && 'right-sidebar-container_hide',
        )}
      >
        {children}
      </div>
    </div>,
    rightSidebarRoot,
  );
};

export default RightSidebar;
