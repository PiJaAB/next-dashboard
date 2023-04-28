import React, { useEffect, useRef, useState } from 'react';
import getConfig from 'next/config';
import ExclamationTrianleIcon from '@heroicons/react/24/outline/ExclamationTriangleIcon';
import ExclamationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';
import XCircleIcon from '@heroicons/react/24/outline/XCircleIcon';
import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import classNames from 'classnames';
import type { SiteMessageType } from '../utils/types';
import useS from '../hooks/useS';

const {
  publicRuntimeConfig: {
    tailwindTheme: { colors },
  },
} = getConfig();

const borderColorMap: Record<NonNullable<SiteMessageType['status']>, string> = {
  info: colors.indigo['800'],
  error: colors.red['800'],
  warning: colors.yellow['800'],
  success: colors.green['800'],
};
interface Props extends SiteMessageType {
  dismiss?: () => void;
}

const RING_SIZE = 100;
const RING_STROKE = 12;
const RING_CENTER = RING_SIZE / 2;
const RING_R = RING_CENTER - RING_STROKE;
const RING_C = 2 * RING_R * Math.PI;

function SiteMessage({
  title,
  message,
  status = 'info',
  timer,
  count,
  dismiss,
}: Props): JSX.Element {
  const timerNum = timer === true ? 5 : timer || 0;
  const s = useS();
  const label = title == null ? s(status) : title;
  const dismissRef = useRef(dismiss);
  useEffect(() => {
    dismissRef.current = dismiss;
  }, [dismiss]);
  const [isHovering, setIsHovering] = useState(false);
  const [animateEl, setAnimateEl] = useState<SVGElement | null>(null);
  useEffect(() => {
    if (animateEl == null) return undefined;
    const el = animateEl as SVGAnimateElement;
    el.beginElement();
    function endListener() {
      if (dismissRef.current) dismissRef.current();
    }
    function beginListener() {
      el.removeEventListener('beginEvent', beginListener);
      el.addEventListener('endEvent', endListener, { passive: true });
    }
    el.addEventListener('beginEvent', beginListener, { passive: true });
    return () => {
      el.removeEventListener('endEvent', endListener);
      el.removeEventListener('beginEvent', beginListener);
    };
  }, [animateEl, count]);
  return (
    <div
      className={classNames(
        'p-2 rounded-lg shadow-lg sm:p-3',
        status === 'info' && 'bg-indigo-600',
        status === 'error' && 'bg-red-600',
        status === 'warning' && 'bg-yellow-600',
        status === 'success' && 'bg-green-600',
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex-1 flex items-center">
          <span
            className={classNames(
              'flex p-2 rounded-lg',
              status === 'info' && 'bg-indigo-800',
              status === 'error' && 'bg-red-800',
              status === 'warning' && 'bg-yellow-800',
              status === 'success' && 'bg-green-800',
            )}
          >
            {status === 'info' && (
              <ExclamationCircleIcon
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            )}
            {status === 'warning' && (
              <ExclamationTrianleIcon
                className="h-6 w-6 text-white"
                aria-hidden="true"
              />
            )}
            {status === 'success' && (
              <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
            )}
            {status === 'error' && (
              <XCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
            )}
          </span>
          <p className="ms-3 font-medium text-white">
            {label ? `${label}: ${message}` : message}
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
                status === 'success' && 'text-green-600',
              )}
            >
              x{count}
            </span>
          </div>
        )}
        {dismiss && (
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ms-2">
            <button
              type="button"
              className={classNames(
                '-me-1 flex p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white relative',
                status === 'info' && 'hover:bg-indigo-500',
                status === 'error' && 'hover:bg-red-500',
                status === 'warning' && 'hover:bg-yellow-500',
                status === 'success' && 'hover:bg-green-500',
              )}
              onClick={dismiss}
            >
              <span className="sr-only">{s('dismiss')}</span>
              {timerNum > 0 && !isHovering && (
                <svg
                  viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                  xmlSpace="preserve"
                  className="absolute w-7 h-7 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <circle
                    fill="none"
                    stroke={borderColorMap[status]}
                    strokeWidth={RING_STROKE}
                    cx={RING_CENTER}
                    cy={RING_CENTER}
                    r={RING_R}
                    strokeDasharray={RING_C}
                    strokeDashoffset={RING_C}
                    strokeLinecap="round"
                    transform={`rotate(-90) translate(-${RING_SIZE} 0)`}
                  >
                    <animate
                      ref={setAnimateEl}
                      attributeName="stroke-dashoffset"
                      values={`${RING_C};0`}
                      dur={timerNum}
                      begin="indefinite"
                      fill="freeze"
                    />
                  </circle>
                </svg>
              )}
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SiteMessage;
