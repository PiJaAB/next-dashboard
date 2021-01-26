import React from 'react';

type DotProps = {
  className: string;
  offset: boolean;
  backgroundColor: string;
  extraStyles: React.CSSProperties;
};
const LoadingDot = ({
  extraStyles,
  backgroundColor,
  className,
  offset,
}: DotProps) => {
  return (
    <span
      className={className}
      style={{
        marginLeft: offset ? '0.5rem' : undefined,
        backgroundColor,
        ...extraStyles,
      }}
    />
  );
};

export type LoadingIconProps = {
  backgroundColor?: string;
  extraStyles?: React.CSSProperties;
};

export default function LoadingIndicator({
  backgroundColor = '#487fff',
  extraStyles = {},
}: LoadingIconProps): JSX.Element {
  return (
    <div className="loading-indicator">
      <LoadingDot
        className="loading-dot-1"
        backgroundColor={backgroundColor}
        extraStyles={extraStyles}
        offset
      />
      <LoadingDot
        className="loading-dot-2"
        backgroundColor={backgroundColor}
        extraStyles={extraStyles}
        offset
      />
      <LoadingDot
        className="loading-dot-3"
        backgroundColor={backgroundColor}
        extraStyles={extraStyles}
        offset
      />
    </div>
  );
}
