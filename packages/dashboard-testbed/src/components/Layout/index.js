// @flow
import React from 'react';
import { DashboardLayout } from '@pija-ab/next-dashboard';
import Sidebar from './Sidebar';
import Header from './Header';

type Props = {
  children: React$Node,
  header?: boolean,
  sidebar?: boolean,
  footer?: boolean,
};
export default function Layout({
  children,
  sidebar,
  header,
  ...props
}: Props): React$Element<typeof DashboardLayout> {
  return (
    <DashboardLayout
      {...props}
      header={header && <Header />}
      sidebar={sidebar && <Sidebar />}
    >
      {children}
    </DashboardLayout>
  );
}

Layout.defaultProps = {
  header: true,
  sidebar: true,
  footer: undefined,
};
