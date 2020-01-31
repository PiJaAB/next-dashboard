// @flow

// Look, I'm technically hooking into some recharts magic.
// They have a bug in that the cx/cy calculation is done differently
// for radial charts and piecharts, so I'm hooking into their
// magic here, with some weird ass typing, just to recalculate cy/cx
// in the same way in all charts.

// eslint-disable-next-line flowtype/no-weak-types
const WrapChart = ({ children, height, width }: any) => {
  return children(width, height);
};

export default WrapChart;
