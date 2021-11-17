import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../../Modal';
import {
  Options,
  onConfirmDialogue,
  offConfirmDialogue,
} from '../../../utils/confirmDialogue';

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
      title={title || 'Bekräfta'}
      active={isOpen}
      close={cancel}
    >
      <div className="flex flex-wrap justify-between items-start">
        <div className="w-full mb-3">
          {message != null ? message : 'Är du säker?'}
        </div>

        {typeof renderOk === 'function' ? (
          renderOk(confirm)
        ) : (
          <button type="button" className="button mb-3" onClick={confirm}>
            {renderOk != null ? renderOk : 'Ok'}
          </button>
        )}
        {typeof renderCancel === 'function' ? (
          renderCancel(cancel)
        ) : (
          <button
            type="button"
            className="button text-white dark:text-white bg-red-500 dark:bg-red-500 hover:bg-red-500 dark:hover:bg-red-600 mb-3"
            onClick={cancel}
          >
            {renderCancel != null ? renderCancel : 'Avbryt'}
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmDialogue;
