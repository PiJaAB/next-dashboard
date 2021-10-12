/// <reference types="react" />
export declare type Options = {
    ok: () => void;
    renderOk?: React.ReactNode | ((confirm: () => void) => React.ReactNode);
    cancel?: () => void;
    renderCancel?: React.ReactNode | ((cancel: () => void) => React.ReactNode);
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
