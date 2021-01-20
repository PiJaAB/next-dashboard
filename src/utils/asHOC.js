// @flow
import React from 'react';
/*:: import * as R from 'react'; */

import type { InitialPropsContext, NextComponent } from './nextTypes';
import displayNameOf from './displayNameOf';

type InitialProps = {};

type HasChild = { children?: R.Node };

type WithoutChildren<P: {}> = $Diff<P, HasChild>;

/**
 * Transforms a "provider" component into a HOC.  A component is a "provider"
 * if it wraps a single child, taking some props and providing some kind of
 * non-visual service to this part of the tree.  Think Redux <Provider>, or
 * React's Context <Provider>.
 */
export default <T: HasChild, U: {}>(
  ProviderComp: NextComponent<T>,
  providerProps: WithoutChildren<T>,
) => (Comp: NextComponent<U>) => {
  if (ProviderComp == null) {
    throw new Error(
      `Can't create asHOC(${String(ProviderComp)})(${displayNameOf(
        Comp,
      )}) because ProviderComp is undefined/null`,
    );
  }

  const funcComp = (props: U) => (
    <ProviderComp {...providerProps}>
      <Comp {...props} />
    </ProviderComp>
  );

  funcComp.getInitialProps = async (
    ctx: InitialPropsContext,
  ): Promise<InitialProps> => {
    return {
      ...((ProviderComp.getInitialProps
        ? await ProviderComp.getInitialProps(ctx)
        : null) || {}),
      ...((Comp.getInitialProps ? await Comp.getInitialProps(ctx) : null) ||
        {}),
    };
  };

  const WrappedComp: NextComponent<U> = funcComp;

  WrappedComp.displayName = `asHOC(${displayNameOf(
    ProviderComp,
  )})(${displayNameOf(Comp)})`;

  return WrappedComp;
};
