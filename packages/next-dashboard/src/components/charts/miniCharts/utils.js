// @flow

import { RENDER_ISSUE_OFFSET_SIZE } from './rechartsCorrections';

export const PADDING = {
  TOP: 0,
  LEFT: 0,
  RIGHT: 0,
  BOTTOM: 13,
};

export const INNER_RADIUS = 0.6;
export const OUTER_RADIUS = 0.8;

export const pieRadius = (ratio: number, width: number, height: number) =>
  (ratio *
    Math.min(
      height - RENDER_ISSUE_OFFSET_SIZE - PADDING.BOTTOM * 2 - PADDING.TOP * 2,
      width - PADDING.LEFT * 2 - PADDING.RIGHT * 2,
    )) /
  2;

export const radius = (ratio: number, width: number, height: number) =>
  (ratio *
    Math.min(
      height - PADDING.BOTTOM * 2 - PADDING.TOP * 2,
      width - PADDING.LEFT * 2 - PADDING.RIGHT * 2,
    )) /
  2;
