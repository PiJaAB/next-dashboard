import React from 'react';
export type JsonType = Partial<{
    [key: string]: JsonType;
}> | JsonType[] | string | number | null;
interface UsePersistentState<PersistentState extends Partial<Record<string, JsonType>>> {
    (): PersistentState;
    <K extends keyof PersistentState>(key: K): PersistentState[K];
    <K extends keyof PersistentState>(key: K, def: NonNullable<PersistentState[K]>): NonNullable<PersistentState[K]>;
}
export default function createPersistentState<PersistentState extends Partial<Record<string, JsonType>>>(defaultState: PersistentState): {
    PersistentStateProvider: React.FunctionComponent<{
        name: string;
        version?: number;
    }>;
    usePersistentState: UsePersistentState<PersistentState>;
};
export {};
