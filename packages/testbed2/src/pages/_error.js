// @flow
import React, { Component } from 'react';

import type { InitialPropsContext } from 'src/utils/nextTypes';

import { Title } from 'src/components/SEO';

type InitialProps = {
  statusCode: number,
};

type Props = InitialProps & {};

class Page extends Component<Props> {
  static async getInitialProps(
    ctx: InitialPropsContext,
  ): Promise<InitialProps> {
    const { res, err } = ctx;
    const errStatus = err && err.statusCode;
    const resStatus = res && res.statusCode;
    const statusCode = resStatus || errStatus || 404;
    return { statusCode };
  }

  static title = 'Fel';

  renderError = () => {
    return <span> WOOO </span>;
  };

  render() {
    const RenderError = this.renderError;
    const { statusCode } = this.props;
    return (
      <>
        <Title
          pageName={[String(statusCode) || Page.title, String(statusCode)]}
        />
        <RenderError />
      </>
    );
  }
}

export default Page;
