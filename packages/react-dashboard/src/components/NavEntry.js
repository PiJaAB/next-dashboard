// @flow

import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

type Props = {
  href: string,
  as?: string,
  children: React$Node,
  icon?: React$Node,
};

export default function NavEntry({
  href,
  children,
  icon,
  as,
}: Props): React$Node {
  const router = useRouter();
  const active = href === router.pathname;
  return (
    <div
      className={[
        'dashboard-sidebar-menu-item',
        active && 'dashboard-sidebar-menu-item_active',
      ]
        .filter(className => className)
        .join(' ')}
      key={href}
    >
      <Link href={href} as={as}>
        <a
          className={[
            'button',
            'dashboard-sidebar-menu-item-button',
            active && 'dashboard-sidebar-menu-item-button_active',
          ]
            .filter(className => className)
            .join(' ')}
        >
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
        </a>
      </Link>
    </div>
  );
}

NavEntry.defaultProps = {
  icon: undefined,
  as: undefined,
};
