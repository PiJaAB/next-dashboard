import React from 'react';
import { UserMenuEntryProps } from './components/UserMenu';
export declare const SEPARATOR: unique symbol;
export declare type SEPARATOR = typeof SEPARATOR;
export declare type UserMenuListEntry = SEPARATOR | UserMenuEntryProps | null | undefined;
export declare type Props = React.PropsWithChildren<{
    Sidebar?: React.ComponentType | boolean;
    searchText?: string;
    onSearchChange?: React.Dispatch<string>;
    onSearch?: React.Dispatch<string>;
    userMenu?: UserMenuListEntry[];
    userTitle?: string;
    userSubTitle?: string;
    userProfilePic?: string;
}>;
export default function DashboardLayout({ children, searchText, onSearchChange, onSearch, userMenu, Sidebar, userTitle, userSubTitle, userProfilePic, }: Props): JSX.Element;
