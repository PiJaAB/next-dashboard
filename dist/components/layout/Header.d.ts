import React from 'react';
import { UserMenuEntryProps } from './components/UserMenu';
export interface HeaderProps {
    groupedUserMenu: UserMenuEntryProps[][];
    handleSearchChange?(ev: React.ChangeEvent<HTMLInputElement>): void;
    handleSearchDown?(ev: React.KeyboardEvent<HTMLInputElement>): void;
    searchText: string;
    showSearch: boolean;
    setSidebarOpen(val: boolean): void;
    showMenuButton: boolean;
    userTitle?: string;
    userSubTitle?: string;
    userProfilePic?: string;
}
export default function Header({ showSearch, searchText, handleSearchChange, handleSearchDown, groupedUserMenu, setSidebarOpen, showMenuButton, userTitle, userSubTitle, userProfilePic, }: HeaderProps): JSX.Element;
