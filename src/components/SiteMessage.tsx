import React from 'react';
import {
  ExclamationIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  XIcon,
} from '@heroicons/react/outline';
import classNames from 'classnames';
import type { SiteMessageType } from '../utils/types';
import useS from '../hooks/useS';

interface Props extends SiteMessageType {
  dismiss?: () => void;
}

function SiteMessage({
  title,
  message,
  status = 'info',
  count,
  dismiss,
}: Props): JSX.Element {
  const s = useS();
  return (
    <div
      className={classNames(
        'p-2 rounded-lg shadow-lg sm:p-3',
        status === 'info' && 'bg-indigo-600',
        status === 'error' && 'bg-red-600',
        status === 'warning' && 'bg-yellow-600',
      )}
    >
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex-1 flex items-center">
          <span
            className={classNames(
              'flex p-2 rounded-lg',
              status === 'info' && 'bg-indigo-800',
              status === 'error' && 'bg-red-800',
              status === 'warning' && 'bg-yellow-800',
            )}
          >
            {status === 'info' && (
              <ExclamationCircleIcon
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            )}
            {status === 'warning' && (
              <ExclamationIcon
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            )}
            {status === 'error' && (
              <XCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
            )}
          </span>
          <p className="ml-3 font-medium text-white">
            {title || s(status)}: {message}
          </p>
        </div>
        {count != null && count > 1 && (
          <div className="order-3 mt-2 flex-shrink-0 flex-grow-1 w-full sm:order-2 sm:mt-0 sm:w-auto">
            <span
              className={classNames(
                'flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-mediu bg-white select-none',
                status === 'info' && 'text-indigo-600',
                status === 'error' && 'text-red-600',
                status === 'warning' && 'text-yellow-600',
              )}
            >
              x{count}
            </span>
          </div>
        )}
        {dismiss && (
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
            <button
              type="button"
              className={classNames(
                '-mr-1 flex p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white',
                status === 'info' && 'hover:bg-indigo-500',
                status === 'error' && 'hover:bg-red-500',
                status === 'warning' && 'hover:bg-yellow-500',
              )}
              onClick={dismiss}
            >
              <span className="sr-only">{s('dismiss')}</span>
              <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SiteMessage;
