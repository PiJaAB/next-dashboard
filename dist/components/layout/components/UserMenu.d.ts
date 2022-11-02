/// <reference types="react" />
import type { LinkProps } from 'next/link';
export declare type UserMenuEntryProps = {
    label: string;
    onClick?: () => void;
    href?: LinkProps['href'];
    disabled?: boolean;
};
export default function UserMenu({ groupedUserMenu, className, userTitle, userSubTitle, }: {
    groupedUserMenu: UserMenuEntryProps[][];
    className?: string;
    userTitle?: string;
    userSubTitle?: string;
}): JSX.Element | null;
