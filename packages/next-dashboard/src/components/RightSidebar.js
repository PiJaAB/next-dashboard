// @flow

import React, { useState, useEffect, useMemo, useContext } from 'react';
import ReactDOM from 'react-dom';

import classnames from 'classnames';
import useInitialFlag from '../utils/useInitialFlag';
import LayoutContext from '../utils/layoutContext';

type Props = {
  children?: React$Node,
  icon?: string,
  isOpen?: boolean,
  onChange?: boolean => void,
  initialIsOpen?: boolean,
  className?: string,
};

const RightSidebar = ({
  icon = 'cogs',
  children = null,
  isOpen,
  initialIsOpen,
  onChange,
  className,
}: Props) => {
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
  const handleClick = useMemo(() => {
    return newOpen => {
      if (isOpen == null) {
        setOpenInner(newOpen);
      }
      if (onChange) onChange(newOpen);
    };
  }, [onChange, isOpen == null, setOpenInner]);
  const { getTemp } = useContext(LayoutContext);

  if (useInitialFlag()) return null;
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

RightSidebar.defaultProps = {
  children: null,
  icon: 'cogs',
  isOpen: undefined,
  onChange: undefined,
  initialIsOpen: undefined,
  className: undefined,
};

export default RightSidebar;
