// @flow
import React from 'react';
import App from 'next/app';
import Router from 'next/router';
import Head from 'next/head';
import NProgress from 'nprogress';
import { Title } from 'src/components/SEO';

// import '@pija-ab/next-dashboard/sass/index.scss';
import '../styles/index.scss';

function getTitleFromComponent(
  component: React$ComponentType<mixed> & { title?: string | (() => string) },
): ?string | string[] {
  const { title } = component;
  if (typeof title === 'string') return title;
  if (typeof title === 'function') return title();
  return null;
}

const BASE_URL = process.env.NEXT_STATIC_BASE_URL;

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

class MyApp extends App {
  state = {
    cookiesNoticeAccepted: undefined,
  };

  render() {
    const { Component, router, pageProps } = this.props;
    const { url } = Component;
    let ogUrl;
    switch (typeof url) {
      case 'function':
        ogUrl = url(router);
        break;
      case 'string':
        ogUrl = url;
        break;
      default:
    }
    if (!ogUrl) {
      ogUrl = router.asPath;
    }
    return (
      <>
        <Title siteName pageName={getTitleFromComponent(Component)} />
        <Head>
          <meta
            key="meta-description"
            name="description"
            content="XVision dashboard"
          />
          <meta key="meta-abstract" name="abstract" content="Dashboard" />
          <meta
            key="meta-keywords"
            name="keywords"
            content="XVision Dashboard"
          />
          <meta
            key="meta-og-image"
            name="og:image"
            content="/images/logo.png"
          />
          <meta key="meta-og-type" name="og:type" content="article" />
          {ogUrl != null && (
            <meta
              key="meta-og-url"
              name="og:url"
              content={`${BASE_URL || ''}${ogUrl}`}
            />
          )}
        </Head>
        <Component {...pageProps} generateTitle={this.title} />
      </>
    );
  }
}

export default MyApp;
