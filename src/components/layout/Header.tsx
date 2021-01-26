import React, { useContext } from 'react';
import Link from 'next/link';

import { LayoutContext, ConfigContext } from '../../utils';
import HamburgerMenu from '../HamburgerMenu';

type Props = React.PropsWithChildren<{
  toggleSidebarActive: () => void;
  sidebarActive: boolean;
}>;

const getLogoURL = (
  conf: string | Record<string, string> | undefined | null,
  theme: string,
) => {
  if (typeof conf === 'object' && conf !== null) {
    return conf[theme];
  }
  const imageName = `logo${theme !== 'default' ? `-${theme}` : ''}.png`;
  return `${conf || '/images'}/${imageName}`;
};

function Header({
  toggleSidebarActive,
  sidebarActive,
  children,
}: Props): JSX.Element {
  const { theme } = useContext(LayoutContext);
  const { branding } = useContext(ConfigContext);

  const { logoURL: logoURLConf, homepageURL = '/', name } = branding;
  const logoURL = getLogoURL(logoURLConf, theme.class);

  return (
    <header className="dashboard-header">
      <div className="header-content-container">
        <div className="grid grid-x3-medium-nosidebar align-items-center flex-wrap-nowrap">
          <div className="cell dashboard-header-cell dashboard-header-cell_sidebar">
            <HamburgerMenu
              sidebarActive={sidebarActive}
              toggleSidebarActive={toggleSidebarActive}
            />
          </div>
          <div className="cell dashboard-header-cell dashboard-header-cell_logo">
            <Link href={homepageURL}>
              <a className="dashboard-header-logo">
                <img src={logoURL} alt={name || 'Logo'} />
              </a>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </header>
  );
}

export default Header;
