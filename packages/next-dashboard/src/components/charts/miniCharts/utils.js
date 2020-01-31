// @flow

import { RENDER_ISSUE_OFFSET_SIZE } from './rechartsCorrections';

export const PADDING_BOTTOM = 13;
export const INNER_RADIUS = 0.6;
export const OUTER_RADIUS = 0.8;

export const pieRadius = (ratio: number, width: number, height: number) =>
  (ratio *
    Math.min(height - RENDER_ISSUE_OFFSET_SIZE - PADDING_BOTTOM * 2, width)) /
  2;

export const radius = (ratio: number, width: number, height: number) =>
  (ratio * Math.min(height - PADDING_BOTTOM * 2, width)) / 2;
