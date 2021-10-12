/// <reference types="react" />
import defaultStrings from '../utils/dashboardStringsEnglish';
export declare const StringsProvider: import("react").Provider<{
    theme: string;
    'theme-dark': string;
    'theme-light': string;
    'open-sidebar': string;
    'close-sidebar': string;
    search: string;
    'open-user-menu': string;
    'profile-picture': string;
    dismiss: string;
    info: string;
    warning: string;
    error: string;
    'sidebar-compact': string;
    'sidebar-expand': string;
}>;
export default function useS(): (key: keyof typeof defaultStrings) => string;
