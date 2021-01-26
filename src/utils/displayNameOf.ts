// @flow
import { ComponentType } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
export default <T extends {}>(Comp: ComponentType<T>): string =>
  Comp.displayName || Comp.name || '';
