// TODO: Disable body scroll.

import React, { useEffect, useRef, useContext, useCallback } from 'react';
import ReactDOM from 'react-dom';

import LayoutContext from '../utils/layoutContext';
import useInitialFlag from '../hooks/useInitialFlag';

type Props = React.PropsWithChildren<{
  id: string;
  active: boolean;
  close: () => void;
  status?: string;
  width?: 'extra-narrow' | 'narrow' | 'normal' | 'wide' | 'extra-wide';
  title?: string;
  header?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
}>;

export default function Modal({ ...props }: Props): React.ReactPortal | null {
  const context = useContext(LayoutContext);
  const initial = useInitialFlag();
  const modalRef = useRef<HTMLDivElement | null>(null);

  const {
    id,
    active,
    close,
    status,
    width,
    title,
    header,
    content,
    children,
    footer,
  } = props;

  const click = useCallback(
    (event: MouseEvent) => {
      const { current: modalRefEle } = modalRef;
      if (
        !(
          modalRefEle &&
          event.target instanceof Node &&
          modalRefEle.contains(event.target)
        )
      )
        close();
    },
    [close],
  );

  const escape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    },
    [close],
  );

  useEffect(() => {
    context.setModalActive(active);
    if (!active) return undefined;
    document.addEventListener('mousedown', click);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', click);
      document.removeEventListener('keydown', escape);
    };
  }, [active, click, close, context, escape]);

  if (typeof window === 'undefined') return null;

  const modalRoot = document.getElementById('dashboard-modal-root');

  if (!modalRoot) return null;

  if (initial) return null;
  return ReactDOM.createPortal(
    <div
      className={[
        'modal-overlay',
        `modal-overlay_id_${id}`,
        active && 'modal-overlay_active',
      ]
        .filter((className) => className)
        .join(' ')}
    >
      <div
        className={[
          'modal',
          `modal_id_${id}`,
          width && `modal_width_${width}`,
          status && `modal_status_${status}`,
          active && 'modal_active',
        ]
          .filter((className) => className)
          .join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-modal-label`}
        ref={modalRef}
      >
        <div className="modal-header">
          {title && (
            <h2 id={`${id}-modal-label`} className="h5-size modal-header-title">
              {title}
            </h2>
          )}
          <button type="button" className="modal-header-button" onClick={close}>
            <span className="fa fa-times" />
          </button>
          {header}
        </div>
        <div className="modal-content">
          {content}
          {children}
        </div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>,
    modalRoot,
  );
}
