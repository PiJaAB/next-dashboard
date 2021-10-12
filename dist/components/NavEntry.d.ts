import React from 'react';
declare type Props = {
    href?: string;
    as?: string;
    children: string | [string, React.ReactElement<{
        className?: string;
    }>];
    Icon?: React.ComponentType<React.ComponentProps<'svg'>>;
    onClick?: (ev: React.MouseEvent) => void;
    active?: boolean;
    tipRef?: React.Ref<HTMLAnchorElement | HTMLButtonElement>;
};
export declare const IsCompactProvider: React.Provider<boolean>;
export default function NavEntry({ href, children: rawChildren, Icon, as, active: propActive, onClick, tipRef, }: Props): JSX.Element;
export {};
