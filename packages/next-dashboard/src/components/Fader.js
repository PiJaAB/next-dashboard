// @flow

import React, {
  Fragment,
  type ElementProps,
  type Node,
  type Element,
} from 'react';
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
  as,
  className,
  children,
  ...props
}: Props<El>): Element<El> | Element<typeof Fragment> {
  if (as == null) return <Fragment />;
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

Fader.defaultProps = {
  className: undefined,
  as: 'div',
  children: undefined,
};

export default Fader;
