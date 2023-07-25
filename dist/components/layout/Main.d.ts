import React from 'react';
import { UserMenuEntryProps } from './components/UserMenu';
export declare const SEPARATOR: unique symbol;
export type SEPARATOR = typeof SEPARATOR;
export type UserMenuListEntry = SEPARATOR | UserMenuEntryProps | null | undefined;
export type Props = React.PropsWithChildren<{
    Sidebar?: React.ComponentType | boolean;
    searchText?: string;
    onSearchChange?: React.Dispatch<string>;
    onSearch?: React.Dispatch<string>;
    userMenu?: UserMenuListEntry[];
    userTitle?: string;
    userSubTitle?: string;
    userProfilePic?: string;
    showDevelopmentLabel?: boolean;
}>;
export default function DashboardLayout({ children, searchText, onSearchChange, onSearch, userMenu, Sidebar, userTitle, userSubTitle, userProfilePic, showDevelopmentLabel, }: Props): JSX.Element;
