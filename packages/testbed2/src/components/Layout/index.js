// @flow
import React from 'react';
import { DashboardLayout } from '@pija-ab/next-dashboard';
import Nav from './Nav';

type Props = {
  children: React$Node,
  header?: boolean,
  sidebar?: boolean,
  footer?: boolean,
};
export default function Layout({
  children,
  sidebar,
  ...props
}: Props): React$Element<typeof DashboardLayout> {
  return (
    <DashboardLayout {...props} sidebar={sidebar && <Nav />}>
      {children}
    </DashboardLayout>
  );
}

Layout.defaultProps = {
  header: undefined,
  sidebar: true,
  footer: undefined,
};
