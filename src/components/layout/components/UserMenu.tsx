import React, { Fragment, useCallback, useEffect, useMemo } from 'react';
import type { LinkProps } from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import NextLink from '../../NextLink';

export type UserMenuEntryProps = {
  label: string;
  onClick?: () => void;
  href?: LinkProps['href'];
  disabled?: boolean;
};

function UserMenuEntry({
  href,
  onClick,
  disabled,
  label,
}: UserMenuEntryProps): JSX.Element {
  const isDisabled = disabled || (href == null && onClick == null);
  const className = 'block w-full text-start px-4 py-2 text-sm';
  if (isDisabled) {
    return (
      <Menu.Button
        type="button"
        className={classNames(
          className,
          'text-gray-300 dark:text-gray-500 cursor-default',
        )}
        disabled
      >
        {label}
      </Menu.Button>
    );
  }
  return (
    <Menu.Item>
      {({ active }) =>
        href == null ? (
          <button
            type="button"
            onClick={onClick}
            className={classNames(
              className,
              active
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                : 'text-gray-700 dark:text-gray-300',
            )}
          >
            {label}
          </button>
        ) : (
          <NextLink
            onClick={onClick}
            href={href}
            className={classNames(
              className,
              active
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                : 'text-gray-700 dark:text-gray-300',
            )}
          >
            {label}
          </NextLink>
        )
      }
    </Menu.Item>
  );
}

let keyCounter = 0;
export default function UserMenu({
  groupedUserMenu,
  className,
  userTitle,
  userSubTitle,
}: {
  groupedUserMenu: UserMenuEntryProps[][];
  className?: string;
  userTitle?: string;
  userSubTitle?: string;
}): JSX.Element | null {
  const keyMap = useMemo(
    () => new Map<UserMenuEntryProps | UserMenuEntryProps[], string>(),
    [],
  );
  useEffect(() => {
    const curKeys = keyMap.keys();
    const flatList = groupedUserMenu.flat();
    let finish: boolean | undefined;
    do {
      const current = curKeys.next();
      finish = current.done;
      if (!current.done) {
        if (Array.isArray(current.value)) {
          if (!groupedUserMenu.includes(current.value)) {
            keyMap.delete(current.value);
          }
        } else if (!flatList.includes(current.value)) {
          keyMap.delete(current.value);
        }
      }
    } while (!finish);
  }, [keyMap, groupedUserMenu]);

  const getKey = useCallback(
    (entry: UserMenuEntryProps | UserMenuEntryProps[]) => {
      const cachedKey = keyMap.get(entry);
      if (cachedKey != null) return cachedKey;
      const newKey = `entry-${keyCounter}`;
      keyCounter += 1;
      keyMap.set(entry, newKey);
      return newKey;
    },
    [keyMap],
  );

  const cn = classNames(
    className,
    'origin-top absolute mt-1 rounded-md shadow-lg bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 mx-3 divide-y divide-gray-200 dark:divide-gray-700',
  );

  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      {groupedUserMenu.length > 0 ? (
        <Menu.Items className={cn}>
          {(userTitle != null || userSubTitle != null) && (
            <div className="w-full text-start px-4 py-2 select-none">
              {userTitle != null && (
                <span
                  title={userTitle}
                  className="block text-gray-500 dark:text-gray-500 text-sm overflow-ellipsis overflow-hidden"
                >
                  {userTitle}
                </span>
              )}
              {userSubTitle != null && (
                <span
                  title={userSubTitle}
                  className="block text-gray-400 dark:text-gray-600 text-xs overflow-ellipsis overflow-hidden"
                >
                  {userSubTitle}
                </span>
              )}
            </div>
          )}
          {groupedUserMenu.map((group) => (
            <div className="py-1" key={getKey(group)}>
              {group.map((entry) => (
                <UserMenuEntry key={getKey(entry)} {...entry} />
              ))}
            </div>
          ))}
        </Menu.Items>
      ) : (
        <div className={cn}>
          {(userTitle != null || userSubTitle != null) && (
            <div className="w-full text-start px-4 py-2 select-none">
              {userTitle != null && (
                <span
                  title={userTitle}
                  className="block text-gray-500 dark:text-gray-500 text-sm overflow-ellipsis overflow-hidden"
                >
                  {userTitle}
                </span>
              )}
              {userSubTitle != null && (
                <span
                  title={userSubTitle}
                  className="block text-gray-400 dark:text-gray-600 text-xs overflow-ellipsis overflow-hidden"
                >
                  {userSubTitle}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </Transition>
  );
}
