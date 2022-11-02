import React, { useContext, useMemo } from 'react';
import { Menu } from '@headlessui/react';
import MenuAlt1Icon from '@heroicons/react/outline/MenuAlt1Icon';
import SearchIcon from '@heroicons/react/solid/SearchIcon';
import UserIcon from '@heroicons/react/solid/UserIcon';
import Link from 'next/link';
import classNames from 'classnames';
import ConfigContext from '../../utils/configContext';
import UserMenu, { UserMenuEntryProps } from './components/UserMenu';
import useS from '../../hooks/useS';
import useColorScheme from '../../hooks/useColorScheme';

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

const getLogoURL = (
  conf: string | Record<'light' | 'dark', string> | undefined | null,
  colorScheme: 'light' | 'dark',
) => {
  if (conf == null) return null;
  if (typeof conf === 'object') {
    return conf[colorScheme];
  }
  return conf;
};

export default function Header({
  showSearch,
  searchText,
  handleSearchChange,
  handleSearchDown,
  groupedUserMenu,
  setSidebarOpen,
  showMenuButton,
  userTitle,
  userSubTitle,
  userProfilePic,
}: HeaderProps): JSX.Element {
  const { branding } = useContext(ConfigContext);
  const colorScheme = useColorScheme();
  const logoURL = useMemo(
    () =>
      !showMenuButton ? getLogoURL(branding.squareLogoURL, colorScheme) : null,
    [showMenuButton, branding.squareLogoURL, colorScheme],
  );
  const s = useS();
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 lg:hidden">
      {showMenuButton && (
        <button
          type="button"
          className="px-4 border-e border-gray-200 dark:border-gray-600 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">{s('open-sidebar')}</span>
          <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      )}
      {logoURL && (
        <Link href={branding.homepageURL || '/'}>
          <a className="h-full">
            <img src={logoURL} alt={branding.name} className="h-full w-auto" />
          </a>
        </Link>
      )}
      <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
        {showSearch && (
          <div className="flex-1 flex place-items-center">
            <label htmlFor="search-field" className="sr-only">
              {s('search')}
            </label>
            <div className="relative w-full text-gray-400 focus-within:text-gray-600 dark:text-gray-600 dark:focus-within:text-gray-300">
              <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                id="search-field"
                name="search-field"
                className="block w-full ps-9"
                placeholder={s('search')}
                type="search"
                value={searchText}
                onChange={handleSearchChange}
                onKeyDown={handleSearchDown}
              />
            </div>
          </div>
        )}
        <div className="flex ms-auto items-center">
          {/* Profile dropdown */}
          {(userTitle != null && userTitle !== '') ||
          (userTitle != null && userTitle !== '') ||
          groupedUserMenu.length > 0 ? (
            <Menu as="div" className="ms-3 relative">
              <Menu.Button className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                <span className="sr-only">{s('open-user-menu')}</span>
                <div
                  data-tip={userTitle}
                  className={classNames(
                    'w-10 h-10 rounded-full flex-shrink-0 overflow-hidden relative',
                    userProfilePic == null && 'bg-gray-300',
                  )}
                >
                  {userProfilePic == null ? (
                    <UserIcon className="h-full w-auto text-gray-500" />
                  ) : (
                    <div
                      className="absolute inset-0 bg-cover bg-no-repeat"
                      style={{ backgroundImage: `url('${userProfilePic}')` }}
                    />
                  )}
                </div>
              </Menu.Button>
              <UserMenu
                className="right-0 w-48"
                groupedUserMenu={groupedUserMenu}
                userTitle={userTitle}
                userSubTitle={userSubTitle}
              />
            </Menu>
          ) : (
            <div className="max-w-xs ms-3 relative flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              <span className="sr-only">{s('profile-picture')}</span>
              <div
                data-tip={userTitle}
                className={classNames(
                  'w-10 h-10 rounded-full flex-shrink-0 overflow-hidden relative',
                  userProfilePic == null && 'bg-gray-300',
                )}
              >
                {userProfilePic == null ? (
                  <UserIcon className="h-full w-auto text-gray-500" />
                ) : (
                  <div
                    className="absolute inset-0 bg-cover bg-no-repeat"
                    style={{ backgroundImage: `url('${userProfilePic}')` }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
