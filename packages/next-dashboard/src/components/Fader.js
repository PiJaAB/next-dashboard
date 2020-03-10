// @flow

import React, { type ElementProps, type Node } from 'react';
import type { DataType } from '../utils/types';

type Props<El: string = 'div'> = {
  ...ElementProps<El>,
  data?: DataType<> | $ReadOnlyArray<DataType<>>,
  updating?: boolean,
  children?: Node,
  as?: El,
  className?: string,
};

function dataIsUpdating(
  data: DataType<> | $ReadOnlyArray<DataType<>>,
): boolean {
  return !Array.isArray(data)
    ? data.status !== 'loading' && Boolean(data.updating)
    : data.some(d => d.status !== 'loading' && d.updating);
}

function Fader<El: string = 'div'>({
  data,
  updating,
  as = 'div',
  className,
  children,
  ...props
}: Props<El>): Node {
  const parsedUpdating = updating || (data != null && dataIsUpdating(data));
  if (as == null) return null;
  const Comp = as;
  return (
    <Comp
      {...props}
      className={[
        'data-fader',
        parsedUpdating && 'data-fader__updating',
        className,
      ]
        .filter(c => c)
        .join(' ')}
    >
      {children}
    </Comp>
  );
}

export default Fader;
