// @flow
import React from 'react';
import {
  Statistic,
  PageContent,
  PageTable,
  PageChart,
} from '@pija-ab/next-dashboard';
import Layout from 'src/components/Layout';
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
              <p>
                Xzakt ska regelbundet förse Fora med den statistik som parterna
                överkommer, enligt avtal. Veckorapportering gälland: Ink, Besv,
                Tapp, Tapp%, Max Kö, Snitt Kö, Snitt Service, Snitt Clearical,
                AHT, Total handling och SLA%.
              </p>
              <h3 className="h5-size">Prognose Information</h3>
              <p>
                Senaste utbildningen slutfördes 23/10 2017. Senaste 9:e ska
                prognos inkomma för kommande 3 månader.
              </p>
              <ul>
                <li>
                  Månad 1 är 100% beställning, månad 2 är 70% beställning och
                  månad 3 är 50% beställning. SLA 90/300
                </li>
                <li>Max tapp 10% (gäller ej tapp inom 5 sek)</li>
                <li>AHT 5 min</li>
                <li>Uppklarningsprocent 95%</li>
                <li>Generell nöjdhet 86%</li>
                <li>Vidarekoppling max 10%</li>
              </ul>

              <h3 className="h5-size">Contact Information</h3>
              <ul>
                <li>Ann Hägerlind Ekehov, ann.hagerlind.ekehov@fora.se</li>
                <li>
                  Moa Holmsten, Trafikledare/Kvalitet, 08-787 45 98,
                  moa.holmsten@fora.se
                </li>
                <li>Bindia Chamat, Trafikledare, bindia.chamat@fora.se</li>
              </ul>
            </PageContent>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withDashboard<{}>(Start, true);
