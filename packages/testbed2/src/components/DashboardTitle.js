// @flow
import React from 'react';

import { Title } from './SEO';

type Props = {
  title: string | string[],
};

export default function DashboardTitle({
  title,
}: Props): React$Element<typeof Title> {
  // eslint-disable-next-line no-param-reassign
  if (!Array.isArray(title)) title = [title];
  return <Title pageName={['Dashboard', ...title]} />;
}
