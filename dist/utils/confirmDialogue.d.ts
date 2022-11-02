import React from 'react';
export declare type Options = {
    ok: () => void;
    renderOk?: React.ReactNode | React.FunctionComponent<{
        onClick: () => void;
    }>;
    cancel?: () => void;
    renderCancel?: React.ReactNode | React.FunctionComponent<{
        onClick: () => void;
    }>;
    title?: string;
    message?: React.ReactNode;
};
declare let listener: null | {
    onDialogue(opts: Options): void;
    onCancel(opts: Options): void;
};
export declare function onConfirmDialogue(newListener: typeof listener): Options[];
export declare function offConfirmDialogue(newListener: typeof listener): void;
export default function confirm(opts: Options): () => void;
export {};
