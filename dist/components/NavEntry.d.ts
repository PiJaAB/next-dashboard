import React from 'react';
type Props = {
    href?: string;
    as?: string;
    children: string | [string, React.ReactElement<{
        className?: string;
    }>];
    Icon?: React.ComponentType<React.ComponentPropsWithoutRef<'svg'>>;
    OpenIcon?: React.ComponentType<React.ComponentPropsWithoutRef<'svg'>>;
    onClick?: (ev: React.MouseEvent) => void;
    active?: boolean;
    tipRef?: React.Ref<HTMLAnchorElement | HTMLButtonElement>;
};
export declare const IsCompactProvider: React.Provider<boolean>;
export default function NavEntry({ href, children: rawChildren, Icon, OpenIcon, as, active: propActive, onClick, tipRef, }: Props): JSX.Element;
export {};
