// @flow
import React, { Component } from 'react';
import nextCookie from 'next-cookies';
import Router from 'next/router';

import type { InitialPropsContext } from 'src/utils/nextTypes';

type InitialProps = {
  token: string,
};

export default function withAuth<P: {}>(
  Comp: React$ComponentType<P> & {
    +getInitialProps?: (ctx: InitialPropsContext) => Promise<{}>,
  },
): React$ComponentType<P> & {
  +getInitialProps?: (ctx: InitialPropsContext) => Promise<{}>,
} {
  return class WithAuth extends Component<P> {
    static async getInitialProps(
      ctx: InitialPropsContext,
    ): Promise<InitialProps> {
      const { token } = nextCookie(ctx);
      const { res } = ctx;
      if (res && !token) {
        res.writeHead(302, { Location: '/dashboard/login' });
        res.end();
        return {};
      }

      if (!token) {
        Router.push('/dashboard/login');
        return {};
      }
      const ctxWithToken: InitialPropsContext & { token?: string } = {
        ...ctx,
        token,
      };

      const childprops =
        (Comp.getInitialProps
          ? await Comp.getInitialProps(ctxWithToken)
          : null) || {};

      return {
        ...childprops,
        token,
      };
    }

    // eslint-disable-next-line flowtype/no-weak-types
    static url = ((c: any) => c.url)(Comp);

    static title: ?string | string[];

    render() {
      return <Comp {...this.props} />;
    }
  };
}
