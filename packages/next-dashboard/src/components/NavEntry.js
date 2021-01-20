// @flow

import React from 'react';
/*:: import * as R from 'react'; */
import { useRouter } from 'next/router';
import Link from 'next/link';
import logger from '../utils/logger';

type Props = {
  href?: string,
  as?: string,
  children: R.Node,
  icon?: R.Node,
  onClick?: (ev: MouseEvent) => ?boolean,
  active?: boolean,
};

type LinkProps = {
  href: $PropertyType<Props, 'href'>,
  onClick: ?$PropertyType<Props, 'onClick'>,
  as: ?$PropertyType<Props, 'as'>,
  children: R.Node,
  active: $PropertyType<Props, 'active'>,
  icon: ?$PropertyType<Props, 'icon'>,
};

type ButtonProps = {
  children: R.Node,
  onClick: ?$PropertyType<Props, 'onClick'>,
  active: $PropertyType<Props, 'active'>,
  icon: ?$PropertyType<Props, 'icon'>,
  as: ?$PropertyType<Props, 'as'>,
};

type InnerProps = {
  children: R.Node,
  icon?: $PropertyType<Props, 'icon'>,
};

function Inner({ icon, children }: InnerProps): R.Node {
  return (
    <>
      {icon != null &&
        (typeof icon === 'string' ? (
          <span
            className={`dashboard-sidebar-menu-item-button-icon fa fa-${icon}`}
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

function LinkEl({
  href,
  as,
  children,
  active,
  onClick,
  icon,
}: LinkProps): R.Element<Link> {
  if (onClick) {
    logger.debug(
      '`onClick` not supported with href. If you need both, use raw render.',
    );
  }
  return (
    <Link href={href} as={as}>
      <a
        title={children}
        className={[
          'button',
          'dashboard-sidebar-menu-item-button',
          active && 'dashboard-sidebar-menu-item-button_active',
        ]
          .filter(c => c)
          .join(' ')}
      >
        <Inner icon={icon}>{children}</Inner>
      </a>
    </Link>
  );
}

function ButtonEl({
  children,
  onClick,
  active,
  icon,
  as,
}: ButtonProps): R.Element<'button'> {
  if (as) {
    logger.debug('`as` makes no sense without href.');
  }
  return (
    <button
      title={children}
      type="button"
      onClick={onClick}
      className={[
        'button',
        'dashboard-sidebar-menu-item-button',
        active && 'dashboard-sidebar-menu-item-button_active',
      ]
        .filter(c => c)
        .join(' ')}
    >
      <Inner icon={icon}>{children}</Inner>
    </button>
  );
}

export default function NavEntry({
  href,
  children,
  icon,
  as,
  active: propActive,
  onClick,
}: Props): R.Node {
  const router = useRouter();
  const active = propActive == null ? href === router.pathname : propActive;
  let Element = ButtonEl;
  if (href) Element = LinkEl;
  return (
    <div className="dashboard-sidebar-menu-item" key={href}>
      <Element
        active={active}
        href={href}
        icon={icon}
        as={as}
        onClick={onClick}
      >
        {children}
      </Element>
    </div>
  );
}
