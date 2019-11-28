// @flow
import React from 'react';
import {
  Statistic,
  PageContent,
  DashboardLayout,
  PageTable,
} from '@pija-ab/next-dashboard';
import withDashboard from 'src/utils/withDashboard';
import Nav from 'src/components/Nav';

const columns = [
  {
    title: 'Servicegroup',
    field: 'servicegroup',
  },
  {
    title: 'Current Queue',
    field: 'currentqueue',
  },
  {
    title: 'Available',
    field: 'available',
  },
  {
    title: 'Busy',
    field: 'busy',
  },
  {
    title: 'Busy Other',
    field: 'busyother',
  },
  {
    title: 'Unavailable',
    field: 'unavailable',
  },
  {
    title: 'Logged On',
    field: 'loggedon',
  },
  {
    title: 'Longest Queue (s)',
    field: 'longestqueue',
  },
  {
    title: 'Estimated Queue (s)',
    field: 'estimatedqueue',
  },
];

const data = [
  {
    servicegroup: 'Kundärende',
    currentqueue: 0,
    available: 1,
    busy: 1,
    busyother: 2,
    unavailable: 4,
    loggedon: 8,
    longestqueue: 0,
    estimatedqueue: 0,
  },
  {
    servicegroup: 'Websupport',
    currentqueue: 0,
    available: 0,
    busy: 0,
    busyother: 0,
    unavailable: 0,
    loggedon: 0,
    longestqueue: 0,
    estimatedqueue: 0,
  },
  {
    servicegroup: 'Lösenord',
    currentqueue: 0,
    available: 1,
    busy: 0,
    busyother: 3,
    unavailable: 4,
    loggedon: 8,
    longestqueue: 0,
    estimatedqueue: 0,
  },
  {
    servicegroup: 'Omval',
    currentqueue: 0,
    available: 0,
    busy: 0,
    busyother: 0,
    unavailable: 0,
    loggedon: 0,
    longestqueue: 0,
    estimatedqueue: 0,
  },
  {
    servicegroup: 'Kundär. Prio',
    currentqueue: 0,
    available: 1,
    busy: 0,
    busyother: 3,
    unavailable: 4,
    loggedon: 8,
    longestqueue: 0,
    estimatedqueue: 0,
  },
  {
    servicegroup: 'AGS',
    currentqueue: 0,
    available: 1,
    busy: 0,
    busyother: 3,
    unavailable: 4,
    loggedon: 8,
    longestqueue: 0,
    estimatedqueue: 0,
  },
  {
    servicegroup: 'Fora_Kundärende_Eng',
    currentqueue: 0,
    available: 1,
    busy: 0,
    busyother: 3,
    unavailable: 3,
    loggedon: 7,
    longestqueue: 0,
    estimatedqueue: 0,
  },
  {
    servicegroup: 'Fora_FTG',
    currentqueue: 0,
    available: 1,
    busy: 1,
    busyother: 2,
    unavailable: 4,
    loggedon: 8,
    longestqueue: 0,
    estimatedqueue: 0,
  },
  {
    servicegroup: 'Fora_Fackforbund',
    currentqueue: 0,
    available: 1,
    busy: 0,
    busyother: 3,
    unavailable: 4,
    loggedon: 8,
    longestqueue: 0,
    estimatedqueue: 0,
  },
  {
    servicegroup: 'Fora_Anstalld',
    currentqueue: 0,
    available: 1,
    busy: 0,
    busyother: 3,
    unavailable: 4,
    loggedon: 8,
    longestqueue: 0,
    estimatedqueue: 0,
  },
  {
    servicegroup: 'Fora_FTG_Fakt',
    currentqueue: 0,
    available: 1,
    busy: 1,
    busyother: 2,
    unavailable: 4,
    loggedon: 8,
    longestqueue: 0,
    estimatedqueue: 0,
  },
  {
    servicegroup: 'Fora_FTG_FA',
    currentqueue: 0,
    available: 1,
    busy: 0,
    busyother: 3,
    unavailable: 4,
    loggedon: 8,
    longestqueue: 0,
    estimatedqueue: 0,
  },
];

const Start = () => (
  <DashboardLayout>
    <Nav />
    <div className="">
      <h1 className="page-title">Overview</h1>
      <div className="grid">
        <div className="cell column-6-medium column-3-large">
          <Statistic />
        </div>
        <div className="cell column-6-medium column-3-large">
          <Statistic
            label="Quality"
            value="8,2"
            description="46% from last period"
          />
        </div>
        <div className="cell column-6-medium column-3-large">
          <Statistic
            label="Volume"
            value="7,5"
            description="15% from last period"
          />
        </div>
        <div className="cell column-6-medium column-3-large">
          <Statistic
            label="Leadership"
            value="7,5"
            description="55% from last period"
          />
        </div>
        <div className="cell column-6 column-4-medium">
          <Statistic />
        </div>
        <div className="cell column-6 column-4-medium">
          <Statistic value="7,5" />
        </div>
        <div className="cell column-6 column-4-medium">
          <Statistic value="7,5" />
        </div>
        <div className="cell">
          <PageContent>
            <p>
              Integer posuere erat a ante venenatis dapibus posuere velit
              aliquet. Maecenas faucibus mollis interdum. Sed posuere
              consectetur est at lobortis. Fusce dapibus, tellus ac cursus
              commodo, tortor mauris condimentum nibh, ut fermentum massa justo
              sit amet risus. Curabitur blandit tempus porttitor. Nullam id
              dolor id nibh ultricies vehicula ut id elit. Vivamus sagittis
              lacus vel augue laoreet rutrum faucibus dolor auctor.
            </p>
            <p>
              Maecenas faucibus mollis <a href="/awd">interdum</a>. Donec id
              elit non mi porta gravida at eget metus. Aenean lacinia bibendum
              nulla sed consectetur. Etiam porta sem malesuada magna mollis
              euismod. Integer posuere erat a ante venenatis dapibus posuere
              velit aliquet. Donec id elit non mi porta gravida at eget metus.
              Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
            </p>
          </PageContent>
        </div>
        <div className="cell">
          <PageTable
            columns={columns}
            data={data}
            columnKeyExtractor={({ field }) => field}
            dataKeyExtractor={({ servicegroup }) => servicegroup}
          />
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default withDashboard<{}>(Start, false);
