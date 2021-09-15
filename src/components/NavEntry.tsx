/* eslint-disable react/require-default-props */
import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import classnames from 'classnames';
import logger from '../utils/logger';

type Props = {
  href?: string;
  as?: string;
  children: string | [string, React.ReactNode];
  icon?: React.ReactNode;
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
  icon?: Props['icon'];
};

type ButtonProps = {
  children: string;
  onClick?: Props['onClick'];
  active: Props['active'];
  icon?: Props['icon'];
  as?: Props['as'];
};

type InnerProps = {
  children: string;
  icon?: Props['icon'];
};

function Inner({ icon, children }: InnerProps): JSX.Element {
  return (
    <>
      {icon != null &&
        (typeof icon === 'string' ? (
          <span
            className={`dashboard-sidebar-menu-item-button-icon fas fa-${icon}`}
          />
        ) : (
          icon
        ))}
      <span className="dashboard-sidebar-menu-item-button-text">
        {children}
      </span>
    </>
  );
}

const LinkEl = React.forwardRef(
  (
    { onClick, href, as, active, icon, children }: LinkProps,
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
          data-tip={children}
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          className={[
            'button',
            'dashboard-sidebar-menu-item-button',
            active && 'dashboard-sidebar-menu-item-button_active',
          ]
            .filter((c) => c)
            .join(' ')}
        >
          <Inner icon={icon}>{children}</Inner>
        </a>
      </Link>
    );
  },
);

const ButtonEl = React.forwardRef(
  (
    { children, onClick, active, icon, as }: ButtonProps,
    ref: React.ForwardedRef<HTMLAnchorElement | HTMLButtonElement>,
  ): JSX.Element => {
    if (as) {
      logger.debug('`as` makes no sense without href.');
    }
    return (
      <button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        data-tip={children}
        type="button"
        onClick={onClick}
        className={[
          'button',
          'dashboard-sidebar-menu-item-button',
          active && 'dashboard-sidebar-menu-item-button_active',
        ]
          .filter((c) => c)
          .join(' ')}
      >
        <Inner icon={icon}>{children}</Inner>
      </button>
    );
  },
);

export default function NavEntry({
  href,
  children: rawChildren,
  icon,
  as,
  active: propActive,
  onClick,
  tipRef,
}: Props): JSX.Element {
  const router = useRouter();
  const pathRef = href?.split('#', 1)?.[0]?.split('?', 1)?.[0];
  const active = propActive != null ? propActive : pathRef === router.pathname;
  const open = useMemo(() => {
    if (propActive != null) return propActive;
    return pathRef == null ? false : router.pathname.startsWith(pathRef);
  }, [propActive, pathRef, router.pathname]);
  const [children, submenu] = useMemo(() => {
    let c: string;
    let rest: React.ReactNode = null;
    if (typeof rawChildren === 'string') {
      c = rawChildren;
    } else if (
      Array.isArray(rawChildren) &&
      typeof rawChildren[0] === 'string'
    ) {
      [c, ...rest] = rawChildren;
    } else {
      c = '';
      rest = rawChildren;
    }
    return [c, Array.isArray(rest) && rest.length === 1 ? rest[0] : rest];
  }, [rawChildren]);
  let child: JSX.Element;
  if (href) {
    child = (
      <LinkEl
        active={active}
        href={href}
        icon={icon}
        as={as}
        onClick={onClick}
        ref={tipRef}
      >
        {children}
      </LinkEl>
    );
  } else {
    child = (
      <ButtonEl
        active={active}
        icon={icon}
        as={as}
        onClick={onClick}
        ref={tipRef}
      >
        {children}
      </ButtonEl>
    );
  }
  return (
    <div
      className={classnames(
        'dashboard-sidebar-menu-item',
        submenu != null && open && 'dashboard-sidebar-menu-item_open',
      )}
      key={href}
    >
      {child}
      {open && submenu}
    </div>
  );
}
