import classnames from 'classnames';
import React from 'react';
import type { DataType } from '../utils/types';

interface Props<
  El extends keyof HTMLElementTagNameMap & keyof JSX.IntrinsicElements = 'div'
> extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElementTagNameMap[El]>,
    HTMLElementTagNameMap[El]
  > {
  data?: DataType | DataType[];
  updating?: boolean;
  as: El;
  className?: string;
}

function dataIsUpdating(data: DataType | DataType[]): boolean {
  return Array.isArray(data)
    ? data.some((d) => d.status !== 'loading' && d.updating)
    : data.status !== 'loading' && Boolean(data.updating);
}

export default function Fader<
  El extends keyof HTMLElementTagNameMap & keyof JSX.IntrinsicElements = 'div'
>({
  data,
  updating,
  as,
  className,
  children,
  ...props
}: Props<El>): JSX.Element {
  const parsedUpdating = updating || (data != null && dataIsUpdating(data));
  const Comp = as as any;
  return (
    <Comp
      {...props}
      className={classnames(
        'data-fader',
        parsedUpdating && 'data-fader__updating',
        className,
      )}
    >
      {children}
    </Comp>
  );
}
