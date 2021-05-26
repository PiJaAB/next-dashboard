import React, { useMemo } from 'react';

import {
  Legend,
  RadialBar,
  RadialBarChart as RechartRadialBarChart,
  ResponsiveContainer,
  PolarAngleAxis,
  Tooltip,
  Customized,
} from 'recharts';
import WrapChart from '../WrapChart';
import PageChart from '../PageChart';
import TextComp, { StyledText } from './TextComp';
import type { Plot } from './types';

import {
  PADDING,
  INNER_RADIUS,
  OUTER_RADIUS,
  radius,
  getCenter,
  renderCustomLegend,
} from '../utils';

type Props<T extends Plot> = React.PropsWithChildren<{
  plots: T[];
  offsetAngle?: number;
  angularSize?: number;
  valueFormatter?: (
    num: string | number | ReadonlyArray<string | number>,
    plot: T,
    isTooltip: boolean,
  ) => string | number | null | undefined;
  centerText?: StyledText | [StyledText, StyledText];
}>;

function getTooltipFormatter<T extends Plot>(
  valueFormatter?: Props<T>['valueFormatter'],
) {
  return (
    value: string | number | Array<string | number>,
    name: string,
    { payload }: { payload: T },
  ) => [
    (valueFormatter && valueFormatter(value, payload, true)) || value,
    payload.name,
  ];
}

const NO_MARGIN = { top: 0, right: 0, bottom: 0, left: 0 };

export default function RadialBarChart<T extends Plot>({
  plots,
  children,
  offsetAngle,
  angularSize,
  valueFormatter,
  centerText,
}: Props<T>): JSX.Element {
  const startAngle = 90 - (offsetAngle || 0);
  const endAngle = startAngle - (angularSize != null ? angularSize : 360);
  const tooltipFormatter = useMemo(() => getTooltipFormatter(valueFormatter), [
    valueFormatter,
  ]);
  return (
    <PageChart>
      <ResponsiveContainer>
        <WrapChart hoffset={PADDING.BOTTOM}>
          {(width, height) => (
            <RechartRadialBarChart
              startAngle={startAngle}
              endAngle={endAngle}
              data={plots}
              {...getCenter(width, height)}
              innerRadius={radius(INNER_RADIUS, width, height) * 1.2}
              outerRadius={radius(OUTER_RADIUS, width, height) * 1.2}
              width={width}
              height={height}
              margin={NO_MARGIN}
              barCategoryGap="25%"
            >
              {children}
              <Tooltip
                labelFormatter={() => null}
                formatter={tooltipFormatter}
                isAnimationActive={false}
              />
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ bottom: -14 }}
                content={renderCustomLegend}
              />
              <PolarAngleAxis type="number" tick={false} />
              <RadialBar
                dataKey="value"
                background={{ fill: 'rgba(0,0,0,0.2)' }}
                cornerRadius="50%"
              />
              {centerText && (
                <Customized
                  component={() => (
                    <TextComp
                      text={centerText}
                      width={width}
                      height={height}
                      radius={radius(INNER_RADIUS, width, height)}
                    />
                  )}
                  key="RadialBarChartCustomizedElement"
                />
              )}
            </RechartRadialBarChart>
          )}
        </WrapChart>
      </ResponsiveContainer>
    </PageChart>
  );
}
