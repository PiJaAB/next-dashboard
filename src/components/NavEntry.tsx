/* eslint-disable react/require-default-props */
import React, { createContext, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import classNames from 'classnames';
import logger from '../utils/logger';

type Props = {
  href?: string;
  as?: string;
  children: string | [string, React.ReactElement<{ className?: string }>];
  Icon?: React.ComponentType<React.ComponentProps<'svg'>>;
  onClick?: (ev: React.MouseEvent) => void;
  active?: boolean;
  tipRef?: React.Ref<HTMLAnchorElement | HTMLButtonElement>;
};

type LinkProps = {
  href: NonNullable<Props['href']>;
  onClick?: Props['onClick'];
  as?: Props['as'];
  children: string;
  active: Props['active'];
  Icon?: Props['Icon'];
  isCompact: boolean;
};

type ButtonProps = {
  children: string;
  onClick?: Props['onClick'];
  active: Props['active'];
  Icon?: Props['Icon'];
  as?: Props['as'];
  isCompact: boolean;
};

type InnerProps = {
  children: string;
  Icon?: Props['Icon'];
  active: Props['active'];
  isCompact: boolean;
};

const IsCompactContext = createContext(false);

export const IsCompactProvider = IsCompactContext.Provider;

function Inner({ Icon, children, active, isCompact }: InnerProps): JSX.Element {
  return (
    <>
      {Icon != null && (
        <Icon
          className={classNames(
            active
              ? 'text-onPrimary-400'
              : 'text-gray-600 dark:text-gray-300 group-hover:text-onPrimary-100 dark:group-hover:text-onPrimary-900',
            !isCompact && 'me-3',
            'flex-shrink-0 h-6 w-6',
          )}
          aria-hidden="true"
        />
      )}
      <span
        className={classNames(
          isCompact && 'sr-only',
          !isCompact &&
            'overflow-hidden overflow-ellipsis flex-grow flex-shrink text-start',
        )}
      >
        {children}
      </span>
    </>
  );
}

const LinkEl = React.forwardRef(
  (
    { onClick, href, as, active, Icon, children, isCompact }: LinkProps,
    ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>,
  ) => {
    if (onClick) {
      logger.debug(
        '`onClick` not supported with href. If you need both, use raw render.',
      );
    }
    return (
      <Link href={href} as={as}>
        <a
          className={classNames(
            active
              ? 'bg-primary-400 text-onPrimary-400'
              : 'text-gray-600 dark:text-gray-300 hover:text-onPrimary-100 dark:hover:text-onPrimary-900 hover:bg-primary-100 dark:hover:bg-primary-900',
            isCompact && 'justify-center',
            'w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md',
          )}
          data-tip={isCompact ? children : undefined}
          data-place="right"
          aria-current={active ? 'page' : undefined}
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        >
          <Inner Icon={Icon} active={active} isCompact={isCompact}>
            {children}
          </Inner>
        </a>
      </Link>
    );
  },
);

const ButtonEl = React.forwardRef(
  (
    { children, onClick, active, Icon, as, isCompact }: ButtonProps,
    ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>,
  ): JSX.Element => {
    if (as) {
      logger.debug('`as` makes no sense without href.');
    }
    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type="button"
        onClick={onClick}
        className={classNames(
          active
            ? 'bg-primary-400 text-onPrimary-400'
            : 'text-gray-600 dark:text-gray-300 hover:text-onPrimary-100 dark:hover:text-onPrimary-900 hover:bg-primary-100 dark:hover:bg-primary-900',
          isCompact && 'justify-center',
          'w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md',
        )}
        data-tip={isCompact ? children : undefined}
        data-place="right"
        aria-current={active}
      >
        <Inner Icon={Icon} active={active} isCompact={isCompact}>
          {children}
        </Inner>
      </button>
    );
  },
);

function ClonedEl({
  className,
  el,
}: {
  className?: string;
  el: React.ReactElement<{ className?: string }>;
}) {
  return React.cloneElement(el, {
    className: classNames(el.props.className, className),
  });
}

export default function NavEntry({
  href,
  children: rawChildren,
  Icon,
  as,
  active: propActive,
  onClick,
  tipRef,
}: Props): JSX.Element {
  const router = useRouter();
  const pathRef = href?.split('#', 1)?.[0]?.split('?', 1)?.[0];
  const active = propActive != null ? propActive : pathRef === router.pathname;
  const isCompact = useContext(IsCompactContext);
  const open = useMemo(() => {
    if (propActive != null) return propActive;
    return pathRef == null ? false : router.pathname.startsWith(pathRef);
  }, [propActive, pathRef, router.pathname]);
  const [children, submenu] = useMemo(() => {
    let c: string;
    let rest: React.ReactElement<{ className?: string }> | null = null;
    if (typeof rawChildren === 'string') {
      c = rawChildren;
    } else if (
      Array.isArray(rawChildren) &&
      rawChildren.length === 2 &&
      typeof rawChildren[0] === 'string'
    ) {
      [c, rest] = rawChildren;
    } else {
      console.warn('Invalid children passed to NavEntry');
      c = '';
    }
    return [c, rest];
  }, [rawChildren]);
  let child: JSX.Element;
  if (href) {
    child = (
      <LinkEl
        active={active}
        href={href}
        Icon={Icon}
        as={as}
        onClick={onClick}
        ref={tipRef}
        isCompact={isCompact}
      >
        {children}
      </LinkEl>
    );
  } else {
    child = (
      <ButtonEl
        active={active}
        Icon={Icon}
        as={as}
        onClick={onClick}
        ref={tipRef}
        isCompact={isCompact}
      >
        {children}
      </ButtonEl>
    );
  }
  return (
    <div
      className={classNames(
        open &&
          submenu != null &&
          'bg-black bg-opacity-10 dark:bg-opacity-25 rounded-md',
      )}
    >
      {child}
      {open && submenu != null && <ClonedEl el={submenu} />}
    </div>
  );
}
