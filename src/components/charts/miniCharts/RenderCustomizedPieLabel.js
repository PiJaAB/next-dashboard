// @flow

import React from 'react';
import type { Plot } from './types';

import { PADDING } from '../utils';

type Props<T: Plot> = {
  cx: number,
  cy: number,
  midAngle: number,
  outerRadius: number,
  percent: number,
  fill: string,
  value: number,
  width: number,
  valueFormatter?: (number, T, boolean) => ?string | number,
  payload: T,
};

const H_PADDING = 15;

const RADIAN = Math.PI / 180;

const CONSTANT_OFFSET = 10;

const RenderCustomizedPieLabel = <T: Plot>({
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
}: Props<T>) => {
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
          `${Math.round(percent * 100)}%`}
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
