import React from 'react';
import { LegendPayload, LegendProps } from 'recharts';
import {
  RENDER_ISSUE_OFFSET_SIZE,
  RENDER_ISSUE_OFFSET_PADDING,
} from './rechartsCorrections';

export const PADDING = {
  TOP: 0,
  LEFT: 0,
  RIGHT: 0,
  BOTTOM: 14,
};

export const INNER_RADIUS = 0.5;
export const OUTER_RADIUS = 0.8;

export const pieRadius = (
  ratio: number,
  width: number,
  height: number,
): number =>
  (ratio *
    Math.min(
      height - RENDER_ISSUE_OFFSET_SIZE - PADDING.BOTTOM * 2 - PADDING.TOP * 2,
      width - PADDING.LEFT * 2 - PADDING.RIGHT * 2,
    )) /
  2;

export const radius = (ratio: number, width: number, height: number): number =>
  (ratio *
    Math.min(
      height - PADDING.BOTTOM * 2 - PADDING.TOP * 2,
      width - PADDING.LEFT * 2 - PADDING.RIGHT * 2,
    )) /
  2;

export const getCenter = (
  width: number,
  height: number,
): { cy: number; cx: number } => ({
  cy: height / 2 - PADDING.BOTTOM + PADDING.TOP - RENDER_ISSUE_OFFSET_PADDING,
  cx: width / 2 - PADDING.RIGHT + PADDING.LEFT,
});

export const renderCustomLegend = ({ payload }: LegendProps): JSX.Element => (
  <ul className="radial-bar-chart-types-list">
    {payload?.map(
      (entry: LegendPayload & { dataKey?: string | number | null }) => (
        <li
          key={entry.dataKey != null ? entry.dataKey : entry.value}
          className="radial-bar-chart-type"
        >
          <div
            className="radial-bar-chart-type-color"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </li>
      ),
    )}
  </ul>
);
