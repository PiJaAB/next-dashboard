// TODO: Disable body scroll.

// @flow
import React, { PureComponent, createRef } from 'react';
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

type State = {
  render: boolean,
};

export default class Modal extends PureComponent<Props, State> {
  state = { render: false };

  modalRef = createRef<HTMLDivElement>();

  static defaultProps = {
    status: undefined,
    width: undefined,
    title: undefined,
    header: undefined,
    content: undefined,
    children: undefined,
    footer: undefined,
  };

  componentDidMount() {
    // Because modals are JS only and we don't want to
    // render anything until we're sure we're running
    // in a browser and are already hydrated.

    // Next will complain if initial render on browser
    // and server are mismatched and things will break.
    // hence dynamically defer rendering until after hydration.
    this.setState({ render: true });
    document.addEventListener('mousedown', this.click);
    window.addEventListener('keydown', this.escape);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.click);
    window.removeEventListener('keydown', this.escape);
  }

  click = (event: MouseEvent) => {
    const { current: modalRefEle } = this.modalRef;
    const { close } = this.props;
    if (
      !(
        modalRefEle &&
        event.target instanceof Node &&
        modalRefEle.contains(event.target)
      )
    )
      close();
  };

  escape = (event: KeyboardEvent) => {
    const { close } = this.props;
    if (event.keyCode === 27) close();
  };

  render() {
    const { render } = this.state;
    if (!render) return null;

    const modalRoot = document.getElementById('dashboard-modal-root');

    if (!modalRoot) return null;

    const {
      id,
      active,
      status,
      width,
      title,
      header,
      content,
      children,
      footer,
    } = this.props;

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
          ref={this.modalRef}
        >
          {(title || header) && (
            <div className="modal-header">
              {title && (
                <h2 id={`${id}-modal-label`} className="h5-size margin-0">
                  {title}
                </h2>
              )}
              {header}
            </div>
          )}
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
}
