/// <reference types="react" />
import type { SiteMessageType } from '../utils/types';
interface Props extends SiteMessageType {
    dismiss?: () => void;
}
declare function SiteMessage({ title, message, status, timer, count, dismiss, }: Props): JSX.Element;
export default SiteMessage;