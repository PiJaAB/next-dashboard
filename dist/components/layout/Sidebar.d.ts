import React from 'react';
import { UserMenuEntryProps } from './components/UserMenu';
export interface SidebarProps {
    groupedUserMenu: UserMenuEntryProps[][];
    handleSearchChange?(ev: React.ChangeEvent<HTMLInputElement>): void;
    handleSearchDown?(ev: React.KeyboardEvent<HTMLInputElement>): void;
    searchText: string;
    showSearch: boolean;
    setSidebarOpen(val: boolean): void;
    sidebarOpen: boolean;
    SidebarComp?: React.ComponentType;
    userTitle?: string;
    userSubTitle?: string;
    userProfilePic?: string;
    showDevelopmentLabel?: boolean;
}
export default function Sidebar({ groupedUserMenu, handleSearchChange, handleSearchDown, searchText, showSearch, sidebarOpen, setSidebarOpen, SidebarComp, userTitle, userSubTitle, userProfilePic, showDevelopmentLabel, }: SidebarProps): JSX.Element;
