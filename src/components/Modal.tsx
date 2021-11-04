// TODO: Disable body scroll.

import React, {
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import ReactDOM from 'react-dom';

import XIcon from '@heroicons/react/outline/XIcon';

import classNames from 'classnames';
import LayoutContext from '../utils/layoutContext';
import useInitialRender from '../hooks/useInitialRender';

type Props = React.PropsWithChildren<{
  id?: string;
  active: boolean;
  className?: string;
  close: () => void;
  title?: string;
  header?: React.ReactNode;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}>;

let counter = 0;
export default function Modal({
  id: providedId,
  active,
  close,
  title,
  header,
  content,
  children,
  footer,
  className,
  style,
}: Props): React.ReactPortal | null {
  const context = useContext(LayoutContext);
  const initial = useInitialRender();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const id = useMemo(() => {
    if (providedId) return providedId;
    counter += 1;
    return `modal-${counter}`;
  }, [providedId]);

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
      id={`${id}-wrapper`}
      className={classNames(
        'fixed left-0 right-0 top-0 bottom-0 flex justify-center items-center bg-black bg-opacity-60',
        !active && 'hidden',
      )}
    >
      <div
        className={classNames('card relative flex flex-col', className)}
        style={style}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `${id}-label` : undefined}
        ref={modalRef}
      >
        <div className="mb-4">
          {title && (
            <h2 id={`${id}-label`} className="text-2xl">
              {title}
            </h2>
          )}
          <button
            type="button"
            className="absolute top-4 right-4 w-6 h-6"
            onClick={close}
          >
            <XIcon className="w-full h-full" />
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
