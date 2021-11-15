import React from 'react';
declare type Props = React.PropsWithChildren<{
    id?: string;
    active: boolean;
    className?: string;
    close: () => void;
    title?: string;
    header?: React.ReactNode;
    content?: React.ReactNode;
    footer?: React.ReactNode;
    style?: React.CSSProperties;
}>;
export default function Modal({ id: providedId, active, close, title, header, content, children, footer, className, style, }: Props): React.ReactPortal | null;
export {};
