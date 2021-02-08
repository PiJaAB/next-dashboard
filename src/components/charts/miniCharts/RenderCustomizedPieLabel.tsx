import React from 'react';
import { PieLabelRenderProps } from 'recharts';
import type { Plot } from './types';

import { PADDING } from '../utils';

interface Props<T extends Plot> extends PieLabelRenderProps {
  width: number;
  valueFormatter?: (
    num: string | number | ReadonlyArray<string | number>,
    plot: T,
    isTooltip: boolean,
  ) => string | number | null | undefined;
}

const H_PADDING = 15;

const RADIAN = Math.PI / 180;

const CONSTANT_OFFSET = 10;

const RenderCustomizedPieLabel = <T extends Plot>({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  fill,
  value,
  width,
  valueFormatter,
  payload,
}: Props<T>): JSX.Element => {
  if (typeof outerRadius !== 'number') throw new Error('Invalid outer radius');
  if (typeof cx !== 'number') throw new Error('Invalid center x');
  if (typeof cy !== 'number') throw new Error('Invalid center y');
  if (typeof midAngle !== 'number') throw new Error('Invalid mid angle');
  let labelRadius = outerRadius * 1.25;
  if (width <= 400) {
    labelRadius += CONSTANT_OFFSET;
  }
  const x = Math.min(
    Math.max(
      cx + labelRadius * Math.cos(-midAngle * RADIAN),
      PADDING.LEFT + H_PADDING,
    ),
    width - H_PADDING - PADDING.RIGHT,
  );
  const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <text
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="pie-chart-label-text"
      >
        {(valueFormatter && valueFormatter(value, payload, false)) ||
          `${Math.round((percent || 0) * 100)}%`}
      </text>
      <line
        x1={x > cx ? 30 : -30}
        x2="0"
        y1="15"
        y2="15"
        className="pie-chart-label-line"
        style={{ stroke: fill }}
      />
    </g>
  );
};

export default RenderCustomizedPieLabel;
