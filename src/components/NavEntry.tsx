import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import logger from '../utils/logger';

type Props = {
  href?: string;
  as?: string;
  children: string;
  icon?: React.ReactNode;
  onClick?: (ev: React.MouseEvent) => void;
  active?: boolean;
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
}: LinkProps): React.ReactElement<
  React.PropsWithChildren<LinkProps>,
  typeof Link
> {
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
          .filter((c) => c)
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
}: ButtonProps): JSX.Element {
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
        .filter((c) => c)
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
}: Props): JSX.Element {
  const router = useRouter();
  const active = propActive == null ? href === router.pathname : propActive;
  let child: JSX.Element;
  if (href) {
    child = (
      <LinkEl active={active} href={href} icon={icon} as={as} onClick={onClick}>
        {children}
      </LinkEl>
    );
  } else {
    child = (
      <ButtonEl active={active} icon={icon} as={as} onClick={onClick}>
        {children}
      </ButtonEl>
    );
  }
  return (
    <div className="dashboard-sidebar-menu-item" key={href}>
      {child}
    </div>
  );
}
