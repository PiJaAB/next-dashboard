import React from 'react';
export type Props = React.PropsWithChildren<{
    className?: string;
}>;
export default function NavSection({ children, className, }: Props): JSX.Element;
