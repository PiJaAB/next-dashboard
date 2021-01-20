// @flow
import React from 'react';

type DotProps = {
  className: string,
  offset: boolean,
  backgroundColor: string,
  extraStyles: { [string]: mixed },
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
        marginLeft: offset ? '0.5rem' : null,
        backgroundColor,
        ...extraStyles,
      }}
    />
  );
};

export type LoadingIconProps = {
  backgroundColor?: string,
  extraStyles?: { [string]: mixed },
};

const LoadingIndicator = ({
  backgroundColor = '#487fff',
  extraStyles = {},
}: LoadingIconProps) => {
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
};

export default LoadingIndicator;
