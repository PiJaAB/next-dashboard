import { ComponentType } from 'react';

export default <T extends {}>(Comp: ComponentType<T>): string =>
  Comp.displayName || Comp.name || '';
