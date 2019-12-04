// TODO: Disable body scroll.

// @flow
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

type Props = {
  id: string,
  active: boolean,
  close: () => void,
  status?: string,
  width?: 'extra-narrow' | 'narrow' | 'normal' | 'wide' | 'extra-wide',
  title?: string,
  header?: React$Node,
  content?: React$Node,
  children?: React$Node,
  footer?: React$Node,
};

const Modal = ({ ...props }: Props) => {
  if (typeof window === 'undefined') return null;

  const modalRoot = document.getElementById('dashboard-modal-root');

  if (!modalRoot) return null;

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

  const modalRef = useRef<HTMLDivElement | null>(null);

  const click = (event: MouseEvent) => {
    if (!active) return;
    const { current: modalRefEle } = modalRef;
    if (
      !(
        modalRefEle &&
        event.target instanceof Node &&
        modalRefEle.contains(event.target)
      )
    )
      close();
  };

  const escape = (event: KeyboardEvent) => {
    if (!active) return;
    if (event.keyCode === 27) close();
  };

  const atTop = () => {
    const { documentElement } = document;
    if (!documentElement) return;
    if (active) {
      documentElement.classList.add('html_modal-active');
    } else {
      documentElement.classList.remove('html_modal-active');
    }
  };

  useEffect(() => {
    atTop();
    document.addEventListener('mousedown', click);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', click);
      document.removeEventListener('keydown', escape);
    };
  }, [active]);

  return ReactDOM.createPortal(
    <div
      className={[
        'modal-overlay',
        `modal-overlay_id_${id}`,
        active && 'modal-overlay_active',
      ]
        .filter(className => className)
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
          .filter(className => className)
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
};

export default Modal;
