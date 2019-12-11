// @flow
import React from 'react';
import {
  Statistic,
  PageContent,
  PageTable,
  PageChart,
} from '@pija-ab/next-dashboard';

import Layout from 'src/components/Layout';
import { useCurrentCustomerInfo } from 'src/utils/dataHooks';
import withDashboard from 'src/utils/withDashboard';
import useThemeVars from 'src/utils/useThemeVars';

import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
} from 'recharts';
import readFromData from 'src/utils/readFromData';

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

const renderAsParagraph = str => <p className="pre">{str}</p>;

const renderAsList = str => {
  const lines = str
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);
  return (
    <ul>
      {lines.map(line => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  );
};

const chartData = [
  {
    name: 'Page A',
    value: 2400,
  },
  {
    name: 'Page B',
    value: 1398,
  },
  {
    name: 'Page C',
    value: 9800,
  },
  {
    name: 'Page D',
    value: 3908,
  },
  {
    name: 'Page E',
    value: 4800,
  },
  {
    name: 'Page F',
    value: 3800,
  },
  {
    name: 'Page G',
    value: 4300,
  },
];

const Start = () => {
  const { chartBarColor } = useThemeVars();
  const customer = useCurrentCustomerInfo();
  const readFromCustInfo = fn =>
    readFromData(customer, fn, 'ERROR!', 'Loading...');

  const summary = readFromCustInfo(c => renderAsParagraph(c.Summary));
  const prognoseInfo = readFromCustInfo(c => renderAsParagraph(c.PrognoseInfo));
  const customerContacts = readFromCustInfo(c =>
    renderAsList(c.CustomerContacts),
  );

  return (
    <Layout>
      <div>
        <h1 className="page-title">Overview</h1>
        <div className="grid">
          <div className="cell column-6-medium column-3-large">
            <Statistic
              label="Quality"
              value="8,2"
              description="46% from last period"
            />
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
          <div className="cell">
            <PageChart>
              <ResponsiveContainer>
                <ComposedChart data={chartData}>
                  <CartesianGrid />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip animationDuration={250} />
                  <Bar
                    dataKey="value"
                    fill={chartBarColor}
                    barSize={20}
                    animationDuration={250}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </PageChart>
          </div>
          <div className="cell">
            <PageTable
              columns={columns}
              data={data}
              columnKeyExtractor={({ field }) => field}
              dataKeyExtractor={({ servicegroup }) => String(servicegroup)}
            />
          </div>
          <div className="cell">
            <PageContent>
              <h2 className="h4-size">Brief Facts about the Assignment</h2>
              {summary}
              <h3 className="h5-size">Prognose Information</h3>
              {prognoseInfo}
              <h3 className="h5-size">Contact Information</h3>
              {customerContacts}
            </PageContent>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withDashboard<{}>(Start, true);
