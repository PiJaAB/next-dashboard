import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Router from 'next/router';
import ReactTooltip from 'react-tooltip';
import LayoutContext from '../../utils/layoutContext';
import SiteMessages from './SiteMessages';
import LayoutSidebar from './Sidebar';
import { UserMenuEntryProps } from './components/UserMenu';
import Header from './Header';
import useInitialRender from '../../hooks/useInitialRender';
import useColorScheme from '../../hooks/useColorScheme';
import ConfirmDialogue from './components/ConfirmDialogue';

export const SEPARATOR = Symbol('separator');
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SEPARATOR = typeof SEPARATOR;

export type UserMenuListEntry =
  | SEPARATOR
  | UserMenuEntryProps
  | null
  | undefined;

export type Props = React.PropsWithChildren<{
  Sidebar?: React.ComponentType | boolean;
  searchText?: string;
  onSearchChange?: React.Dispatch<string>;
  onSearch?: React.Dispatch<string>;
  userMenu?: UserMenuListEntry[];
  userTitle?: string;
  userSubTitle?: string;
  userProfilePic?: string;
  environmentBadge?:
    | string
    | boolean
    | { className?: string; text: string }
    | null;
}>;

export default function DashboardLayout({
  children,
  searchText,
  onSearchChange,
  onSearch,
  userMenu,
  Sidebar,
  userTitle,
  userSubTitle,
  userProfilePic,
  environmentBadge,
}: Props): JSX.Element {
  const { getTemp, setTemp } = useContext(LayoutContext);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    window.document.body.classList.add(colorScheme);
    return () => {
      window.document.body.classList.remove(colorScheme);
    };
  }, [colorScheme]);
  const sidebarOpen = getTemp('sidebarOpen', false);
  const setSidebarOpen = useCallback(
    (val: boolean) => setTemp('sidebarOpen', val),
    [setTemp],
  );
  useEffect(() => {
    const onRouteChangeStart = () => {
      setTemp('sidebarOpen', false);
    };
    Router.events.on('routeChangeStart', onRouteChangeStart);
    return () => {
      Router.events.off('routeChangeStart', onRouteChangeStart);
    };
  }, [setTemp]);
  // The search elements need to be internally controlled if not
  // controlled from the outside due to the fact that we have
  // 2 different elements being search boxes that we want to
  // be seamlessly in sync.
  const [internalSearchText, setInternalSearchText] = useState('');
  const displaySearchText =
    searchText == null ? internalSearchText : searchText;
  const controlled = searchText != null;
  const showSearch = controlled || onSearchChange != null || onSearch != null;
  const handleSearchChange = useMemo(() => {
    if (controlled) {
      return onSearchChange
        ? (ev: React.ChangeEvent<HTMLInputElement>) => {
            onSearchChange(ev.target.value);
          }
        : undefined;
    }
    return onSearchChange
      ? (ev: React.ChangeEvent<HTMLInputElement>) => {
          onSearchChange(ev.target.value);
          setInternalSearchText(ev.target.value);
        }
      : (ev: React.ChangeEvent<HTMLInputElement>) => {
          setInternalSearchText(ev.target.value);
        };
  }, [onSearchChange, controlled]);
  const handleSearchDown = useMemo(() => {
    return onSearch != null
      ? (ev: React.KeyboardEvent<HTMLInputElement>) => {
          if (ev.key === 'Enter' && !ev.shiftKey) {
            onSearch(ev.currentTarget.value);
          }
        }
      : undefined;
  }, [onSearch]);
  const groupedUserMenu = useMemo(() => {
    const c = userMenu?.filter((m): m is NonNullable<typeof m> => m != null);
    if (c == null) return [];
    if (c.length > 0 && c[c.length - 1] === SEPARATOR) c.pop();
    const grouped: UserMenuEntryProps[][] = [];
    let current: UserMenuEntryProps[] = [];
    c.forEach((e) => {
      if (e === SEPARATOR) {
        if (current.length > 0) {
          grouped.push(current);
          current = [];
        }
      } else {
        current.push(e);
      }
    });
    if (current.length > 0) grouped.push(current);
    return grouped;
  }, [userMenu]);
  const isInitial = useInitialRender();
  return (
    <div className="relative flex">
      {/* Sidebar */}
      {Sidebar !== false && (
        <LayoutSidebar
          groupedUserMenu={groupedUserMenu}
          searchText={displaySearchText}
          showSearch={showSearch}
          handleSearchChange={handleSearchChange}
          handleSearchDown={handleSearchDown}
          setSidebarOpen={setSidebarOpen}
          sidebarOpen={sidebarOpen}
          SidebarComp={typeof Sidebar !== 'boolean' ? Sidebar : undefined}
          userTitle={userTitle}
          userSubTitle={userSubTitle}
          userProfilePic={userProfilePic}
          environmentBadge={environmentBadge}
        />
      )}
      {/* Main column */}
      <div className="flex flex-col w-0 flex-1 min-h-screen">
        {/* Search header */}
        {Sidebar !== false && (
          <Header
            setSidebarOpen={setSidebarOpen}
            groupedUserMenu={groupedUserMenu}
            searchText={displaySearchText}
            showSearch={showSearch}
            handleSearchChange={handleSearchChange}
            handleSearchDown={handleSearchDown}
            showMenuButton={Sidebar != null}
            userTitle={userTitle}
            userSubTitle={userSubTitle}
            userProfilePic={userProfilePic}
          />
        )}
        <main className="flex-1 focus:outline-none">
          {children}
          <SiteMessages />
        </main>
      </div>
      <ConfirmDialogue />
      <div id="dashboard-modal-root" style={{ zIndex: 9999 }} />
      {!isInitial && (
        <ReactTooltip
          className="tooltip-style"
          type={colorScheme}
          effect="solid"
        />
      )}
    </div>
  );
}
