import { useContext } from 'react';
import ConfigContext from '../utils/configContext';
import LayoutContext, { ILayoutContext } from '../utils/layoutContext';

export default function useColorScheme(): ILayoutContext['defaultColorScheme'] {
  const { defaultColorScheme, getState } = useContext(LayoutContext);
  const { themeSelect } = useContext(ConfigContext);
  if (!themeSelect) return defaultColorScheme;
  return getState('colorScheme', defaultColorScheme);
}
