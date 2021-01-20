// @flow
/*:: import * as R from 'react'; */

// Look, I'm technically hooking into some recharts magic.
// They have a bug in that the cx/cy calculation is done differently
// for radial charts and piecharts, so I'm hooking into their
// magic here, with some weird ass typing, just to recalculate cy/cx
// in the same way in all charts.

type Props = {
  children: (number, number) => R.Node,
  height?: number,
  width?: number,
  hoffset?: number,
  voffset?: number,
};

const WrapChart = ({
  children,
  height = 0,
  width = 0,
  hoffset = 0,
  voffset = 0,
}: Props) => {
  return children(width - voffset, height - hoffset);
};

export default WrapChart;
