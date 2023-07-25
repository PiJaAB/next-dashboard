import React from 'react';
export interface AnyVariantProps {
    href?: string;
    as?: string;
    children: string | [string, React.ReactElement<{
        className?: string;
    }>];
    Icon?: React.ComponentType<React.ComponentPropsWithoutRef<'svg'>>;
    OpenIcon?: React.ComponentType<React.ComponentPropsWithoutRef<'svg'>>;
    onClick?: (ev: React.MouseEvent) => void;
    active?: boolean;
    tipRef?: React.RefCallback<HTMLAnchorElement | HTMLButtonElement> | React.RefObject<HTMLAnchorElement & HTMLButtonElement>;
}
export interface LinkVariantProps extends Omit<AnyVariantProps, 'tipRef'> {
    href: NonNullable<AnyVariantProps['href']>;
    onClick?: never;
    tipRef?: React.Ref<HTMLAnchorElement>;
}
export interface ButtonVariantProps extends Omit<AnyVariantProps, 'tipRef'> {
    href?: never;
    as?: never;
    onClick: NonNullable<AnyVariantProps['onClick']>;
    tipRef?: React.Ref<HTMLButtonElement>;
}
export declare const IsCompactProvider: React.Provider<boolean>;
export default function NavEntry(props: LinkVariantProps): JSX.Element;
export default function NavEntry(props: ButtonVariantProps): JSX.Element;
export default function NavEntry(props: AnyVariantProps): JSX.Element;
