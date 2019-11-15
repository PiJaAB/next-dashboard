// @flow

import React from 'react';
import withDashboard from 'src/utils/withDashboard';
import DashboardLayout from 'src/components/DashboardLayout';

function Test(): React$Element<typeof DashboardLayout> {
  return <DashboardLayout>Hello Authenticated user</DashboardLayout>;
}

export default withDashboard<{}>(Test);
