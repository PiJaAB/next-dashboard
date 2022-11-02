import React, { forwardRef } from 'react';
import Link, { LinkProps } from 'next/link';

type InnerLinkProps = Omit<LinkProps, 'children' | 'passHref'>;

export type NextLinkProps = Omit<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >,
  keyof InnerLinkProps
> &
  InnerLinkProps;

const NextLink = forwardRef(
  (
    {
      href,
      as,
      replace,
      scroll,
      shallow,
      prefetch,
      locale,
      children,
      ...rest
    }: NextLinkProps,
    ref: React.ForwardedRef<HTMLAnchorElement>,
  ) => (
    <Link
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
      locale={locale}
    >
      <a {...rest} ref={ref}>
        {children}
      </a>
    </Link>
  ),
);

export default NextLink;
