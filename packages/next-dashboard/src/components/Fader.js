// @flow

import React, { type ElementProps, type Node } from 'react';
import type { DataType } from '../utils/types';

type Props<El: string = 'div'> = {
  ...ElementProps<El>,
  data: DataType<>,
  children?: Node,
  as?: El,
  className?: string,
};

function Fader<El: string = 'div'>({
  data,
  as = 'div',
  className,
  children,
  ...props
}: Props<El>): Node {
  if (as == null) return null;
  const Comp = as;
  return (
    <Comp
      {...props}
      className={[
        'data-fader',
        data.updating && 'data-fader__updating',
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
