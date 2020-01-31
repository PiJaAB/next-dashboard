// @flow

import React from 'react';

type Props = {
  cx: number,
  cy: number,
  midAngle: number,
  outerRadius: number,
  percent: number,
  fill: string,
};

const RADIAN = Math.PI / 180;
const RenderCustomizedPieLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  fill,
}: Props) => {
  const labelRadius = outerRadius * 1.25;
  const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
  const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <text
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="pie-chart-label-text"
      >
        {Math.round(percent * 100)}%
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
