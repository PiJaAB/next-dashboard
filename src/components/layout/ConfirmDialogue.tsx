import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../Modal';
import {
  Options,
  onConfirmDialogue,
  offConfirmDialogue,
} from '../../utils/confirmDialogue';

const ConfirmDialogue = (): JSX.Element => {
  const [queue, setQueue] = useState<readonly Options[]>([]);
  const [current, setCurrent] = useState<Options | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (!isOpen && queue.length > 0) {
      const [next] = queue;
      setCurrent(next);
      setQueue((oldQueue) => {
        return oldQueue.filter((entry) => entry !== next);
      });
      setIsOpen(true);
    }
  }, [queue, isOpen]);
  useEffect(() => {
    if (current != null) setIsOpen(true);
  }, [current]);
  const close = useCallback(() => {
    if (queue.length === 0) {
      setIsOpen(false);
    } else {
      const [next] = queue;
      setCurrent(next);
      setQueue((oldQueue) => {
        return oldQueue.filter((entry) => entry !== next);
      });
    }
  }, [queue]);
  useEffect(() => {
    const listener = {
      onDialogue(opts: Options) {
        setQueue((oldQueue) => [...oldQueue, opts]);
      },
      onCancel(opts: Options) {
        setQueue((oldQueue) => oldQueue.filter((entry) => entry !== opts));
        if (current === opts && isOpen) close();
      },
    };
    const cache = onConfirmDialogue(listener);
    if (cache.length > 0) setQueue((oldQueue) => [...oldQueue, ...cache]);
    return () => {
      offConfirmDialogue(listener);
    };
  }, [setQueue, setCurrent, isOpen, current, close]);
  const confirm = () => {
    if (current) {
      current.ok();
    }
    close();
  };
  const cancel = () => {
    if (current && current.cancel) {
      current.cancel();
    }
    close();
  };
  const { renderCancel, renderOk, message, title } = current || {};
  return (
    <Modal
      id="confirmation-dialogue-modal"
      width="extra-narrow"
      title={title || 'Bekräfta'}
      active={isOpen}
      close={cancel}
    >
      <div className="grid">
        <div className="cell">{message != null ? message : 'Är du säker?'}</div>

        {typeof renderOk === 'function' ? (
          renderOk(confirm)
        ) : (
          <div className="cell text-align-center column-6-medium-nosidebar">
            <button
              type="button"
              className="margin-bottom-x0"
              onClick={confirm}
            >
              {renderOk != null ? renderOk : 'Ok'}
            </button>
          </div>
        )}
        {typeof renderCancel === 'function' ? (
          renderCancel(cancel)
        ) : (
          <div className="cell text-align-center column-6-medium-nosidebar">
            <button
              type="button"
              className="margin-bottom-x0 type_error"
              onClick={cancel}
            >
              {renderCancel != null ? renderCancel : 'Avbryt'}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmDialogue;
