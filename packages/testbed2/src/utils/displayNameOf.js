// @flow
import type { ComponentType } from 'react';

export default <T: {}>(Comp: ComponentType<T>) =>
  Comp.displayName || Comp.name || '';
