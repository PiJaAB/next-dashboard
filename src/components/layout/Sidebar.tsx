import { Dialog, Menu, Transition } from '@headlessui/react';
import XIcon from '@heroicons/react/outline/XIcon';
import SearchIcon from '@heroicons/react/solid/SearchIcon';
import SelectorIcon from '@heroicons/react/solid/SelectorIcon';
import UserIcon from '@heroicons/react/solid/UserIcon';
import React, { Fragment, useContext, useEffect } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { ArrowSmStartIcon, ArrowSmEndIcon } from '../ArrowSmIcons';
import useRebuildTooltip from '../../hooks/useRebuildTooltip';
import useColorScheme from '../../hooks/useColorScheme';
import ConfigContext from '../../utils/configContext';
import LayoutContext from '../../utils/layoutContext';
import useS from '../../hooks/useS';
import UserMenu, { UserMenuEntryProps } from './components/UserMenu';
import NavEntry, { IsCompactProvider } from '../NavEntry';
import NavSection from '../NavSection';
import ThemeSelector from '../ThemeSelector';

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
}

function UserInfo({
  title,
  subTitle,
  pictureUrl,
  compact,
  showSelector,
}: {
  title?: string;
  subTitle?: string;
  pictureUrl?: string;
  compact: boolean;
  showSelector?: boolean;
}) {
  if (compact) {
    return (
      <div
        className={classNames(
          'w-10 h-10 rounded-full flex-shrink-0 overflow-hidden relative',
          pictureUrl == null && 'bg-gray-300',
        )}
        data-tip={title}
        data-place="right"
      >
        {pictureUrl == null ? (
          <UserIcon className="h-full w-auto text-gray-500" />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{ backgroundImage: `url('${pictureUrl}')` }}
          />
        )}
      </div>
    );
  }
  return (
    <>
      <span className="flex flex-1 min-w-0 items-center justify-center space-s-3">
        <div
          className={classNames(
            'w-10 h-10 rounded-full flex-shrink-0 overflow-hidden relative',
            pictureUrl == null && 'bg-gray-300',
          )}
        >
          {pictureUrl == null ? (
            <UserIcon className="h-full w-auto text-gray-500" />
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-no-repeat"
              style={{ backgroundImage: `url('${pictureUrl}')` }}
            />
          )}
        </div>
        {(title != null || subTitle != null) && (
          <span className="flex-1 flex flex-col min-w-0">
            {title != null && (
              <span className="text-gray-900 dark:text-gray-100 text-sm font-medium truncate">
                {title}
              </span>
            )}
            {subTitle != null && (
              <span className="text-gray-500 text-sm truncate">{subTitle}</span>
            )}
          </span>
        )}
      </span>
      {showSelector && (
        <SelectorIcon
          className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
          aria-hidden="true"
        />
      )}
    </>
  );
}

function UserAccountArea({
  groupedUserMenu,
  userTitle,
  userSubTitle,
  userProfilePic,
  compact,
}: Pick<
  SidebarProps,
  'groupedUserMenu' | 'userTitle' | 'userSubTitle' | 'userProfilePic'
> & { compact: boolean }) {
  if (
    groupedUserMenu.length === 0 &&
    userTitle == null &&
    userSubTitle == null &&
    userProfilePic == null
  ) {
    return null;
  }
  if (groupedUserMenu.length === 0) {
    return (
      <div className="px-3 mt-6 relative inline-block text-start">
        <div className="group w-full rounded-md px-3.5 py-2 text-sm text-start font-medium text-gray-700">
          <span className="flex w-full justify-between items-center">
            <UserInfo
              title={userTitle}
              subTitle={userSubTitle}
              pictureUrl={userProfilePic}
              compact={compact}
            />
          </span>
        </div>
      </div>
    );
  }
  return (
    <Menu as="div" className="px-3 mt-6 relative inline-block text-start">
      <Menu.Button className="group w-full rounded-md px-3.5 py-2 text-sm text-start font-medium text-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-purple-500 dark:focus:ring-offset-gray-900 dark:focus:ring-purple-500">
        <span className="flex w-full justify-between items-center">
          <UserInfo
            title={userTitle}
            subTitle={userSubTitle}
            pictureUrl={userProfilePic}
            showSelector
            compact={compact}
          />
        </span>
      </Menu.Button>
      <UserMenu
        className={classNames(
          compact && 'start-0 w-48',
          !compact && 'end-0 start-0',
        )}
        userTitle={compact ? userTitle : undefined}
        userSubTitle={compact ? userSubTitle : undefined}
        groupedUserMenu={groupedUserMenu}
      />
    </Menu>
  );
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

function Brand({ compact }: { compact: boolean }): JSX.Element | null {
  const colorScheme = useColorScheme();
  const { branding } = useContext(ConfigContext);
  const fullLogoUrl = getLogoURL(branding.fullLogoURL, colorScheme);
  const squareLogoUrl = getLogoURL(branding.squareLogoURL, colorScheme);
  if (compact) {
    if (squareLogoUrl)
      return (
        <Link href={branding.homepageURL || '/'}>
          <a
            className="flex justify-center items-center flex-shrink-0 px-6"
            data-tip={branding.name}
            data-place="right"
          >
            <img
              className="h-auto w-10"
              src={squareLogoUrl}
              alt={branding.name}
            />
          </a>
        </Link>
      );
    return null;
  }
  if (fullLogoUrl != null) {
    return (
      <Link href={branding.homepageURL || '/'}>
        <a className="flex items-center justify-center flex-shrink-0 px-6">
          <img className="h-8 w-auto" src={fullLogoUrl} alt={branding.name} />
        </a>
      </Link>
    );
  }
  const title = (
    <h1 className="text-2xl text-gray-600 dark:text-gray-300">
      {branding.name}
    </h1>
  );
  if (squareLogoUrl != null) {
    return (
      <Link href={branding.homepageURL || '/'}>
        <a className="flex items-center justify-center flex-shrink-0 px-6">
          <img
            className="h-8 w-auto me-2"
            src={squareLogoUrl}
            alt={branding.name}
          />
          {title}
        </a>
      </Link>
    );
  }
  return (
    <Link href={branding.homepageURL || '/'}>
      <a className="flex items-center flex-shrink-0 px-6">title</a>
    </Link>
  );
}

export default function Sidebar({
  groupedUserMenu,
  handleSearchChange,
  handleSearchDown,
  searchText,
  showSearch,
  sidebarOpen,
  setSidebarOpen,
  SidebarComp,
  userTitle,
  userSubTitle,
  userProfilePic,
}: SidebarProps): JSX.Element {
  const { getState, setState } = useContext(LayoutContext);
  const { themeSelect } = useContext(ConfigContext);
  const isCompact = getState('compactSidebar', false);
  const s = useS();
  const rebuildTooltip = useRebuildTooltip();
  useEffect(() => {
    rebuildTooltip();
  }, [isCompact, rebuildTooltip]);

  return (
    <div
      className={classNames(
        'z-20',
        !isCompact && 'lg:w-64',
        isCompact && 'lg:w-24',
      )}
    >
      {SidebarComp != null && (
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 flex lg:hidden"
            style={{ zIndex: 8888 }}
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75 dark:bg-black dark:bg-opacity-60" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-200 dark:bg-gray-700">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -me-12 pt-2">
                    <button
                      type="button"
                      className="ms-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">{s('close-sidebar')}</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <Brand compact={false} />
                <div className="px-2 mt-5 divide-y divide-gray-300 dark:divide-gray-500">
                  <SidebarComp />
                  {themeSelect && (
                    <NavSection className="py-2">
                      <ThemeSelector />
                    </NavSection>
                  )}
                </div>
              </div>
            </Transition.Child>
            <div className="flex-shrink-0 w-14" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>
      )}

      {/* Static sidebar for desktop */}
      <IsCompactProvider value={isCompact}>
        <div className="hidden lg:flex lg:flex-shrink-0 fixed h-screen">
          <div
            className={classNames(
              'flex flex-col border-e border-gray-200 dark:border-gray-700 pt-5 pb-4 bg-gray-200 dark:bg-gray-700',
              !isCompact && 'w-64',
              isCompact && 'w-24',
            )}
          >
            <Brand compact={isCompact} />
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="h-0 flex-1 flex flex-col">
              <UserAccountArea
                groupedUserMenu={groupedUserMenu}
                userTitle={userTitle}
                userSubTitle={userSubTitle}
                userProfilePic={userProfilePic}
                compact={isCompact}
              />
              {showSearch && (
                <div className="px-3 mt-5">
                  <label htmlFor="search" className="sr-only">
                    {s('search')}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div
                      className="absolute inset-y-0 left-0 ps-3 flex items-center pointer-events-none"
                      aria-hidden="true"
                    >
                      <SearchIcon
                        className="me-3 h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      className="block w-full ps-9"
                      placeholder={s('search')}
                      value={searchText}
                      onChange={handleSearchChange}
                      onKeyDown={handleSearchDown}
                    />
                  </div>
                </div>
              )}
              <div className="px-3 mt-6 divide-y divide-gray-300 dark:divide-gray-500">
                {SidebarComp != null && <SidebarComp />}
                <NavSection className="py-2">
                  {themeSelect && <ThemeSelector />}
                  <NavEntry
                    Icon={isCompact ? ArrowSmEndIcon : ArrowSmStartIcon}
                    onClick={() => setState('compactSidebar', !isCompact)}
                  >
                    {s(isCompact ? 'sidebar-expand' : 'sidebar-compact')}
                  </NavEntry>
                </NavSection>
              </div>
            </div>
          </div>
        </div>
      </IsCompactProvider>
    </div>
  );
}
