// @flow

import React from 'react';
import { PADDING } from '../utils';

export type StyledText =
  | string
  | {
      str: string,
      size:
        | number
        | ((width: number, height: number, radius: number) => number),
    };

type Props = {
  text: StyledText | [StyledText, StyledText],
  width: number,
  height: number,
  radius: number,
};

function defaultTopTextSize(
  width: number,
  height: number,
  radius: number,
): number {
  return radius / 1.5;
}
function defaultBottomTextSize(
  width: number,
  height: number,
  radius: number,
): number {
  return radius / 4;
}

const TextComp = ({ text, width, height, radius }: Props) => {
  if (!Array.isArray(text)) {
    let size;
    let strText;
    if (typeof text === 'object') {
      size =
        typeof text.size === 'function'
          ? text.size(width, height, radius)
          : text.size;
      strText = text.str;
    } else {
      strText = text;
      size = defaultTopTextSize(width, height, radius);
    }
    return (
      <text
        y={height / 2 - PADDING.BOTTOM + PADDING.TOP}
        x={width / 2 - PADDING.RIGHT + PADDING.LEFT}
        style={{
          fontSize: `${size}px`,
        }}
        className="radial-bar-chart__center-text radial-bar-chart__center-text__single"
      >
        {strText}
      </text>
    );
  }
  let topSize;
  let bottomSize;
  const [top, bottom] = text;
  let topStr;
  let bottomStr;
  if (typeof top === 'object') {
    topSize =
      typeof top.size === 'function'
        ? top.size(width, height, radius)
        : top.size;
    topStr = top.str;
  } else {
    topStr = top;
    topSize = defaultTopTextSize(width, height, radius);
  }
  if (typeof bottom === 'object') {
    bottomSize =
      typeof bottom.size === 'function'
        ? bottom.size(width, height, radius)
        : bottom.size;
    bottomStr = bottom.str;
  } else {
    bottomStr = bottom;
    bottomSize = defaultBottomTextSize(width, height, radius);
  }
  return (
    <>
      <text
        y={height / 2 - PADDING.BOTTOM + PADDING.TOP}
        x={width / 2 - PADDING.RIGHT + PADDING.LEFT}
        dy={`${-bottomSize / 2}px`}
        style={{
          fontSize: `${topSize}px`,
        }}
        className="radial-bar-chart__center-text radial-bar-chart__center-text__top"
      >
        {topStr}
      </text>
      <text
        y={height / 2 - PADDING.BOTTOM + PADDING.TOP}
        x={width / 2 - PADDING.RIGHT + PADDING.LEFT}
        dy={`${topSize / 2}px`}
        style={{
          fontSize: `${bottomSize}px`,
        }}
        className="radial-bar-chart__center-text radial-bar-chart__center-text__bottom"
      >
        {bottomStr}
      </text>
    </>
  );
};

export default TextComp;
